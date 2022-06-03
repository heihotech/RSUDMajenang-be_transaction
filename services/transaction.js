const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  AmountRequired: 'harap isi field Amount',
  AmountPaidRequired: 'harap isi field AmountPaid',
  StatusRequired: 'harap isi field Status',
  VaNumberRequired: 'harap isi field VaNumber',
}

const joiQueries = {
  amount: Joi.number().optional(),
  amountPaid: Joi.number().optional(),
  status: Joi.string().min(3).optional(),
  vaNumber: Joi.number().optional(),
  withAllReferences: Joi.bool().optional().default(false),
}
const joiParams = {
  withAllReferences: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  amount: Joi.number().required().messages({
    'any.required': ErrorMessage.AmountRequired,
  }),
  amountPaid: Joi.number().optional().default(0),
  status: Joi.string()
    .valid(
      'SUCCESS',
      'PENDING',
      'FAIL',
      'CANCELED',
      'REVERSAL',
      'CREATED',
      'UPDATED'
    )
    .optional()
    .default('CREATED'),
  rawInformation: Joi.object().default(() => {}),
}
const joiEditPayload = {
  amount: Joi.number().optional().messages({
    'any.required': ErrorMessage.AmountRequired,
  }),
  amountPaid: Joi.number().optional().default(0),
  status: Joi.string()
    .valid(
      'SUCCESS',
      'PENDING',
      'FAIL',
      'CANCELED',
      'REVERSAL',
      'CREATED',
      'UPDATED'
    )
    .optional(),
  vaNumber: Joi.number().optional().messages({
    'any.required': ErrorMessage.VaNumberRequired,
  }),
}

module.exports = ({ models }) => {
  const h = handler('Transaction', 'transactionId', { models })
  const buildQuery = ({ amount, amountPaid, vaNumber, status }) => {
    const condition = []

    if (amount) {
      condition.push({
        amount: { [Op.eq]: amount },
      })
    }
    if (amountPaid) {
      condition.push({
        amountPaid: { [Op.eq]: amountPaid },
      })
    }
    if (status) {
      condition.push({
        status: { [Op.eq]: status },
      })
    }
    if (vaNumber) {
      condition.push({
        vaNumber: { [Op.eq]: vaNumber },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { User, Profile, RawInformation } = models
    const { withAllReferences } = relations

    include.push({
      model: User,
      as: 'createdBy',
      include: { model: Profile, as: 'profile' },
    })
    include.push({
      model: User,
      as: 'deletedBy',
      include: { model: Profile, as: 'profile' },
    })
    include.push({
      model: User,
      as: 'updatedBy',
      include: { model: Profile, as: 'profile' },
    })

    if (withAllReferences) {
      include.push({ all: true, nested: true })
    }

    return include
  }

  const ValidateParams = async (params) =>
    await h.ValidateParams(joiParams, params)

  const ValidateQueries = async (query) =>
    await h.ValidateQueries(joiQueries, query)

  const ValidateCreatePayload = async (body) =>
    await h.ValidatePayload(joiCreatePayload, body)

  const ValidateEditPayload = async (body) =>
    await h.ValidatePayload(joiEditPayload, body)

  const ValidateId = async (params) => await h.ValidateId(params)

  const GetAll = async (query) =>
    await h.GetAll(parseRelations(query), buildQuery(query), query)

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query), query)

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  const Update = async (params, payload) => await h.Update(params, payload)

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  const Create = async (payload) => {
    var validatedPayload = payload
    const { Transaction, RawInformation } = models
    return sequelize.transaction(async (t) => {
      try {
        const lastTransaction = await CheckLastVaNumber()

        if (lastTransaction) {
          validatedPayload['vaNumber'] =
            parseInt(lastTransaction.dataValues.vaNumber) + 1
        } else {
          validatedPayload['vaNumber'] = 1
        }

        const created = await Transaction.create(validatedPayload, {
          transaction: t,
        })

        const createdRawInformation = await RawInformation.create(
          {
            origin: validatedPayload['origin']
              ? validatedPayload['origin']
              : '',
            status: created.status,
            transactionId: created.id,
            referenceData: validatedPayload['rawInformation']
              ? validatedPayload['rawInformation']
              : {},
          },
          {
            transaction: t,
          }
        )

        if (createdRawInformation) {
          created['rawInformation'] = createdRawInformation
        }

        return created
      } catch (err) {
        t.rollback()

        throw err
      }
    })
  }

  const CheckLastVaNumber = async () => {
    const { Transaction } = models
    try {
      const lastInsertedVaNumber = await Transaction.findOne({
        order: [['vaNumber', 'DESC']],
        attributes: ['id', 'vaNumber'],
      })

      return lastInsertedVaNumber
    } catch (err) {
      throw err
    }
  }

  const GetOneByVaNumber = async (body) => {
    const { Transaction, RawInformation } = models
    try {
      if (body && body.vaNumber) {
        const validatedVaNumber = await Transaction.findOne({
          where: {
            vaNumber: { [Op.eq]: body.vaNumber },
          },
          include: [
            {
              model: RawInformation,
              as: 'histories',
              attributes: ['guid', 'origin', 'status', 'referenceData'],
            },
          ],
        })

        let resp = {}
        if (validatedVaNumber) {
          resp = {
            code: '00',
            desc: 'data ditemukan',
            guid: validatedVaNumber.guid,
            amount: validatedVaNumber.amount,
            amountPaid: validatedVaNumber.amountPaid,
            vaNumber: validatedVaNumber.vaNumber,
            status: validatedVaNumber.status,
          }

          const lastState = validatedVaNumber['histories'][0]

          resp['referenceData'] =
            lastState && lastState.referenceData
              ? lastState.referenceData
              : null
        } else {
          resp = {
            code: '01',
            desc: 'data tidak ditemukan',
          }
        }
        return resp
      } else {
        return {
          code: '02',
          desc: ErrorMessage.VaNumberRequired,
        }
      }
    } catch (err) {
      throw err
    }
  }

  const PayOneByVaNumber = async (body) => {
    const { Transaction, RawInformation } = models
    return sequelize.transaction(async (t) => {
      try {
        if (body && body.vaNumber) {
          const validatedVaNumber = await Transaction.findOne({
            where: {
              vaNumber: { [Op.eq]: body.vaNumber },
            },
          })

          let resp = {}

          if (validatedVaNumber) {
            if (validatedVaNumber.status === 'SUCCESS') {
              resp = {
                code: '03',
                desc: 'tagihan lunas',
              }
            } else if (validatedVaNumber.status === 'PENDING') {
              resp = {
                code: '04',
                desc: 'tagihan sedang diproses',
              }
            } else if (validatedVaNumber.status === 'CANCELED') {
              resp = {
                code: '05',
                desc: 'tagihan dibatalkan',
              }
            } else if (validatedVaNumber.status === 'FAIL') {
              resp = {
                code: '06',
                desc: 'tagihan invalid',
              }
            } else if (validatedVaNumber.status === 'REVERSAL') {
              resp = {
                code: '07',
                desc: 'tagihan invalid',
              }
            } else if (
              validatedVaNumber.status === 'CREATED' ||
              validatedVaNumber.status === 'UPDATED'
            ) {
              const updatedTransaction = await Transaction.update(
                {
                  status: 'SUCCESS',
                  amountPaid: parseInt(validatedVaNumber.amount),
                },
                {
                  where: {
                    id: validatedVaNumber.id,
                  },
                  transaction: t,
                }
              )

              if (updatedTransaction) {
                await RawInformation.create(
                  {
                    origin: '',
                    status: 'SUCCESS',
                    transactionId: validatedVaNumber.id,
                    externalExecutionTime: body.executionTime
                      ? body.executionTime
                      : null,
                  },
                  {
                    transaction: t,
                  }
                )
              }

              // return updatedTransaction
              resp = {
                code: '00',
                desc: 'tagihan berhasil dibayar',
              }
            } else {
              resp = {
                code: '07',
                desc: 'tagihan invalid',
              }
            }
          } else {
            resp = {
              code: '01',
              desc: 'data tidak ditemukan',
            }
          }
          return resp
        } else {
          return {
            code: '02',
            desc: ErrorMessage.VaNumberRequired,
          }
        }
      } catch (err) {
        throw err
      }
    })
  }

  const CancelOneByVaNumber = async (body) => {
    const { Transaction, RawInformation } = models
    return sequelize.transaction(async (t) => {
      try {
        if (body && body.vaNumber) {
          const validatedVaNumber = await Transaction.findOne({
            where: {
              vaNumber: { [Op.eq]: body.vaNumber },
            },
          })

          let resp = {}

          if (validatedVaNumber) {
            if (
              validatedVaNumber.status !== 'SUCCESS' &&
              validatedVaNumber.status !== 'CANCELED' &&
              validatedVaNumber.status !== 'REVERSAL'
            ) {
              const updatedTransaction = await Transaction.update(
                {
                  status: 'CANCELED',
                },
                {
                  where: {
                    id: validatedVaNumber.id,
                  },
                  transaction: t,
                }
              )

              if (updatedTransaction) {
                await RawInformation.create(
                  {
                    origin: '',
                    status: 'CANCELED',
                    transactionId: validatedVaNumber.id,
                  },
                  {
                    transaction: t,
                  }
                )
              }

              resp = {
                code: '00',
                desc: 'tagihan berhasil dibatalkan',
              }
            } else if (validatedVaNumber.status === 'REVERSAL') {
              resp = {
                code: '08',
                desc: 'tagihan telah di reversal',
              }
            } else if (validatedVaNumber.status === 'SUCCESS') {
              resp = {
                code: '03',
                desc: 'tagihan telah lunas',
              }
            }
          } else {
            resp = {
              code: '01',
              desc: 'data tidak ditemukan',
            }
          }
          return resp
        } else {
          return {
            code: '02',
            desc: ErrorMessage.VaNumberRequired,
          }
        }
      } catch (err) {
        throw err
      }
    })
  }

  const ReversalOneByVaNumber = async (body) => {
    const { Transaction, RawInformation } = models
    return sequelize.transaction(async (t) => {
      try {
        if (body && body.vaNumber) {
          const validatedVaNumber = await Transaction.findOne({
            where: {
              vaNumber: { [Op.eq]: body.vaNumber },
            },
          })

          let resp = {}

          if (validatedVaNumber) {
            if (validatedVaNumber.status !== 'REVERSAL') {
              const updatedTransaction = await Transaction.update(
                {
                  status: 'REVERSAL',
                },
                {
                  where: {
                    id: validatedVaNumber.id,
                  },
                  transaction: t,
                }
              )

              if (updatedTransaction) {
                await RawInformation.create(
                  {
                    origin: '',
                    status: 'REVERSAL',
                    transactionId: validatedVaNumber.id,
                  },
                  {
                    transaction: t,
                  }
                )
              }

              resp = {
                code: '00',
                desc: 'tagihan berhasil direversal',
              }
            } else if (validatedVaNumber.status === 'REVERSAL') {
              resp = {
                code: '08',
                desc: 'tagihan telah di reversal',
              }
            }
          } else {
            resp = {
              code: '01',
              desc: 'data tidak ditemukan',
            }
          }
          return resp
        } else {
          return {
            code: '02',
            desc: ErrorMessage.VaNumberRequired,
          }
        }
      } catch (err) {
        throw err
      }
    })
  }

  return {
    ValidateQueries,
    ValidateParams,
    ValidateCreatePayload,
    ValidateEditPayload,
    ValidateId,
    GetOneByVaNumber,
    PayOneByVaNumber,
    CancelOneByVaNumber,
    ReversalOneByVaNumber,
    Create,
    GetAll,
    GetOne,
    Delete,
    Restore,
    Update,
    InjectActor,
    CheckLastVaNumber,
  }
}
