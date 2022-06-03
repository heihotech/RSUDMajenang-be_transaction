const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const { sequelize } = require('../infra/postgre')
const { ErrorUtil, PaginationUtil } = require('../internal/utils')
const ErrorMessage = {
  UserIdInvalidFormat: `user id tidak valid`,
  UserIdRequired: `harap masukan user id`,
}

module.exports = ({ models }) => {
  const ValidateGetById = async (query) => {
    try {
      const validated = await Joi.object({
        userId: Joi.string().guid().required().messages({
          'any.required': ErrorMessage.UserIdRequired,
          'string.guid': ErrorMessage.UserIdInvalidFormat,
          'string.base': ErrorMessage.UserIdRequired,
          'string.required': ErrorMessage.UserIdRequired,
          'string.empty': ErrorMessage.UserIdRequired,
        }),
        withRole: Joi.bool().optional().default(false),
        withPermission: Joi.bool().optional().default(false),
        withProfile: Joi.bool().optional().default(false),
        withProfileAddress: Joi.bool().optional().default(false),
      })
        .options({ allowUnknown: true })
        .validateAsync(query)

      return validated
    } catch (err) {
      throw ErrorUtil.ParseJOIError(err)
    }
  }

  const ValidateGetAllReq = async (query) => {
    try {
      const validated = await Joi.object({
        username: Joi.string().optional().min(3).alphanum(),
        email: Joi.string().optional().min(8),
        withRole: Joi.bool().optional().default(false),
        withPermission: Joi.bool().optional().default(false),
        withProfile: Joi.bool().optional().default(false),
        withProfileAddress: Joi.bool().optional().default(false),
      })
        .options({ allowUnknown: true })
        .validateAsync(query)

      return validated
    } catch (err) {
      throw ErrorUtil.ParseJOIError(err)
    }
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Role, Profile, Address, Permission } = models
    const { withProfile, withProfileAddress, withRole, withPermission } =
      relations

    if (withRole) {
      include.push({ model: Role, as: 'roles' })
    }

    if (withPermission) {
      include.push({ model: Permission, as: 'permissions' })
    }

    if (withProfile) {
      include.push({ model: Profile, as: 'profile' })
    }

    if (withProfileAddress) {
      include.push({
        model: Profile,
        as: 'profile',
        include: { model: Address, as: 'address' },
      })
    }

    return include
  }

  const buildQuery = ({ username, email, phone, profileId }) => {
    const condition = []

    if (username) {
      condition.push({
        username: { [Op.iLike]: `%${username}%` },
      })
    }
    if (email) {
      condition.push({
        email: { [Op.iLike]: `%${email}%` },
      })
    }
    if (phone) {
      condition.push({
        phone: { [Op.iLike]: `%${phone}%` },
      })
    }
    if (profileId) {
      condition.push({
        profile_id: { [Op.eq]: profileId },
      })
    }

    return condition
  }

  const GetAll = async (params, relations = {}) => {
    try {
      const {
        page,
        size,
        includeDeleted,
        username,
        email,
        phone,
        profileId,
        order,
      } = params
      const include = parseRelations(relations)
      const condition = buildQuery({ username, email, phone, profileId })
      const { limit, offset, orderField, orderSort } =
        PaginationUtil.GetPagination(page, size, order)
      const rows = await models.User.findAll({
        where: { [Op.and]: condition },
        limit,
        offset,
        order: [[orderField, orderSort]],
        include,
        paranoid:
          includeDeleted === 'true' && includeDeleted != null ? false : true,
      })

      const count = await models.User.count({
        where: { [Op.and]: condition },
        paranoid:
          includeDeleted === 'true' && includeDeleted != null ? false : true,
      })

      return {
        data: rows,
        meta: PaginationUtil.BuildMeta(rows.length, count, page, limit),
      }
    } catch (err) {
      throw err
    }
  }

  const GetById = async (query, relations = {}) => {
    const { userId } = query
    try {
      const include = parseRelations(relations)
      const data = await models.User.findByPk(userId, {
        include,
      })

      return data
    } catch (err) {
      throw err
    }
  }

  // To be continued
  const Create = async (body) => {
    const { User, Role, UserRole } = models
    const user = {
      username: body.username,
      email: body.email,
      phone: body.phone,
      password: bcrypt.hashSync(body.password, 8),
    }

    if (body.roles && body.roles.length > 0) {
    }

    return sequelize.transaction(async (t) => {
      try {
        const createdUser = await User.create(user, {
          transaction: t,
        })

        let roles = []

        if (body.roles && body.roles.length > 0) {
          roles = await Role.findAll({
            attributes: ['id'],
            where: {
              name: {
                [Op.or]: body.roles,
              },
            },
          })
        } else {
          roles = await Role.findAll({
            attributes: ['id'],
            where: {
              name: 'user',
            },
          })
        }

        if (roles.length > 0) {
          const payload = roles.map((el) => {
            return { user_id: createdUser.id, role_id: el.id }
          })

          await UserRole.bulkCreate(payload, { transaction: t })
        }

        return createdUser
      } catch (err) {
        t.rollback()

        throw err
      }
    })
  }

  const Delete = async (id) => {}

  const Restore = async (id) => {}

  const GetOneByQuery = async (query, relations = {}) => {
    const include = parseRelations(relations)
    const { withPassword } = relations

    return withPassword
      ? await models.User.scope('withPassword').findOne({
          where: query,
          include,
        })
      : await models.User.findOne({ where: query, include })
  }

  const CheckEmail = async (email) => {
    try {
      const found = await GetOneByQuery({ email: { [Op.eq]: email } }, {})

      if (found) {
        return true
      }

      return false
    } catch (err) {
      throw err
    }
  }

  const ValidateId = async (params) => {
    try {
      if (!params || !params.userId) {
        throw new Error('perlu data user')
      }

      const found = await models.User.findByPk(params.userId)

      if (!found) {
        throw new Error('id user tidak valid')
      }

      return true
    } catch (err) {
      throw err
    }
  }

  return {
    Create,
    ValidateGetAllReq,
    GetAll,
    ValidateGetById,
    GetById,
    Delete,
    Restore,
    GetOneByQuery,
    CheckEmail,
    ValidateId,
  }
}
