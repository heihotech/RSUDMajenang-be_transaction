const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  NameRequired: 'harap isi field Name',
}

const joiQueries = {
  name: Joi.string().optional().min(3).message({
    'any.required': ErrorMessage.NameRequired,
  }),
  withUsers: Joi.bool().optional().default(false),
  withUserProfile: Joi.bool().optional().default(false),
  withPermissions: Joi.bool().optional().default(false),
}
const joiParams = {
  withUsers: Joi.bool().optional().default(false),
  withUserProfile: Joi.bool().optional().default(false),
  withPermissions: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required().min(3).message({
    'any.required': ErrorMessage.NameRequired,
  }),
}
const joiEditPayload = {
  name: Joi.string().required().min(3).message({
    'any.required': ErrorMessage.NameRequired,
  }),
}

module.exports = ({ models }) => {
  const h = handler('Role', 'roleId', { models })
  const buildQuery = ({ name }) => {
    const condition = []

    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { User, Profile, Permission } = models
    const { withUsers, withUserProfile, withPermissions } = relations

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

    if (withUsers) {
      if (withUserProfile) {
        include.push({
          model: User,
          as: 'users',
          include: { model: Profile, as: 'profile' },
        })
      } else {
        include.push({ model: User, as: 'users' })
      }
    }

    if (withPermissions) {
      include.push({ model: Permission, as: 'permissions' })
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

  const Create = async (payload) => await h.Create(payload)

  const Update = async (params, payload) => await h.Update(params, payload)

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  const AssignRoleToUser = async (userId, roleId) => {
    const { UserRole } = models
    try {
      return sequelize.transaction(async (t) => {
        return await UserRole.create({
          roleId: roleId,
          userId: userId,
        })
      })
    } catch (err) {
      throw err
    }
  }

  const AssignRolesToUser = async (roles, userId) => {
    const { UserRole, Role } = models
    try {
      const exists = []

      await Promise.all(
        roles.map(async (role) => {
          const found = await Role.findByPk(role)

          if (found) {
            exists.push({
              roleId: found.id,
              userId: userId,
            })
          }

          return found
        })
      )

      return sequelize.transaction(async (t) => {
        return await UserRole.bulkCreate(exists)
      })
    } catch (err) {
      throw err
    }
  }

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
    AssignRoleToUser,
    AssignRolesToUser,
  }
}
