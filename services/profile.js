const { Op } = require('sequelize')
const Joi = require('joi')
const { sequelize } = require('../infra/postgre')
const { ErrorUtil, PaginationUtil } = require('../internal/utils')
const ErrorMessage = {
  ProfileIdInvalidFormat: `Profile id tidak valid`,
  ProfileIdRequired: `harap masukan Profile id`,
}

const getPagination = (page, size) => {
  const limit = size ? +size : 10
  const offset = page ? page * limit : 0

  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, items, totalPages, currentPage }
}

module.exports = ({ models }) => {
  const validatePayload = async (payload) => {
    try {
      return Joi.object({
        name: Joi.string().required().min(3),
        path: Joi.string().required().min(3),
        method: Joi.string()
          .required()
          .valid('post', 'put', 'get', 'patch', 'delete', 'del'),
        description: Joi.string().required(),
        isPublic: Joi.bool().required().default(false),
      }).validateAsync(payload)
    } catch (err) {
      throw ErrorUtil.ParseJOIError(err)
    }
  }

  const ValidateGetById = async (query) => {
    try {
      const validated = await Joi.object({
        profileId: Joi.number().integer().positive().required().messages({
          'any.required': ErrorMessage.ProfileIdRequired,
          'number.integer': ErrorMessage.ProfileIdInvalidFormat,
          'number.positive': ErrorMessage.ProfileIdInvalidFormat,
          'number.required': ErrorMessage.ProfileIdRequired,
          'number.empty': ErrorMessage.ProfileIdRequired,
        }),
        withUser: Joi.bool().optional().default(false),
        withAddress: Joi.bool().optional().default(false),
      })
        .options({ allowUnknown: true })
        .validateAsync(query)

      return validated
    } catch (err) {
      throw ErrorUtil.ParseJOIError(err)
    }
  }

  return {
    GetAll: async (params) => {
      const {
        page,
        size,
        order,
        orderField,
        includeDeleted,
        fullName,
        frontTitle,
        endTitle,
        nik,
        nip,
        gender,
        religion,
        addressId,
      } = params
      let condition = []

      if (fullName) {
        condition.push({
          full_name: { [Op.iLike]: `%${fullName}%` },
        })
      }
      if (frontTitle) {
        condition.push({
          front_title: { [Op.eq]: frontTitle },
        })
      }
      if (endTitle) {
        condition.push({
          end_title: { [Op.eq]: endTitle },
        })
      }
      if (nik) {
        condition.push({
          nik: { [Op.eq]: nik },
        })
      }
      if (nip) {
        condition.push({
          nip: { [Op.eq]: nip },
        })
      }
      if (gender) {
        condition.push({
          gender: { [Op.eq]: gender },
        })
      }
      if (religion) {
        condition.push({
          religion: { [Op.eq]: religion },
        })
      }
      if (addressId) {
        condition.push({
          address_id: { [Op.eq]: addressId },
        })
      }

      const { limit, offset } = getPagination(page, size)

      try {
        const data = await models.Profile.findAndCountAll({
          where: { [Op.and]: condition },
          limit,
          offset,
          order: [
            [orderField ? orderField : 'created_at', order ? order : 'DESC'],
          ],
          paranoid:
            includeDeleted === 'true' && includeDeleted != null ? false : true,
        })

        return getPagingData(data, page, limit)
      } catch (err) {
        throw err
      }
    },
    GetById: async (id) => {
      try {
        const data = await models.Profile.findByPk(id, {})

        if (data !== null) {
          return data
        } else {
          return {}
        }
      } catch (err) {
        throw err
      }
    },
    Create: async (params) => {},
    Delete: async (id) => {},
    Restore: async (id) => {},
  }
}
