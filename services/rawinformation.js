const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  Origin: 'harap isi field Origin',
  Status: 'harap isi field Status',
  TransactionId: 'harap isi field TransactionId',
  ReferenceData: 'harap isi field ReferenceData',
  ExternalExecutionTime: 'harap isi field ExternalExecutionTime',
}

const joiQueries = {
  origin: Joi.string().optional(),
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
  transactionId: Joi.number().optional(),
  withTransaction: Joi.bool().optional().default(false),
}
const joiParams = {
  withTransaction: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  origin: Joi.string().optional(),
  transactionId: Joi.number().required().messages({
    'any.required': ErrorMessage.TransactionId,
  }),
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
    .required()
    .default('CREATED'),
  referenceData: Joi.object().default(() => {}),
  externalExecutionTime: Joi.date().optional(),
}
const joiEditPayload = {
  origin: Joi.string().optional(),
  transactionId: Joi.number().optional(),
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
  referenceData: Joi.object().default(() => {}),
  externalExecutionTime: Joi.date().optional(),
}

module.exports = ({ models }) => {
  const h = handler('RawInformation', 'rawInformationId', { models })
  const buildQuery = ({ origin, status, transactionId }) => {
    const condition = []

    if (origin) {
      condition.push({
        origin: { [Op.iLike]: `%${origin}%` },
      })
    }
    if (status) {
      condition.push({
        status: { [Op.eq]: status },
      })
    }
    if (transactionId) {
      condition.push({
        transactionId: { [Op.eq]: transactionId },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { User, Profile, Transaction } = models
    const { withTransaction } = relations

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

    if (withTransaction) {
      include.push({ model: Transaction, as: 'transaction' })
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

  const Create = async (payload) => await h.Create(payload)

  return {
    ValidateQueries,
    ValidateParams,
    ValidateCreatePayload,
    ValidateEditPayload,
    ValidateId,
    Create,
    GetAll,
    GetOne,
    Delete,
    Restore,
    Update,
    InjectActor,
  }
}
