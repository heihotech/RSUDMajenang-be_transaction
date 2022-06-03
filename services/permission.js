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
}
const joiParams = {
  withUsers: Joi.bool().optional().default(false),
  withUserProfile: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required().min(3),
  path: Joi.string().required().min(3),
  method: Joi.string()
    .required()
    .valid('post', 'put', 'get', 'patch', 'delete', 'del'),
  description: Joi.string().required(),
  isPublic: Joi.bool().required().default(false),
}
const joiEditPayload = {
  name: Joi.string().optional().empty(),
  path: Joi.string().optional().empty(),
  method: Joi.string()
    .optional()
    .empty()
    .valid('post', 'put', 'get', 'patch', 'delete', 'del'),
  description: Joi.string().optional().empty(),
  isPublic: Joi.bool().optional().default(false),
}

module.exports = ({ models }) => {
  const h = handler('Permission', 'permissionId', { models })
  const buildQuery = ({ name, path, method, isPublic }) => {
    const condition = []

    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }

    if (path) {
      condition.push({
        path: { [Op.iLike]: `%${path}%` },
      })
    }

    if (method) {
      condition.push({
        method: { [Op.eq]: method },
      })
    }

    if (isPublic) {
      condition.push({
        isPublic: { [Op.eq]: isPublic },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { User, Profile } = models
    const { withUsers, withUserProfile } = relations

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

  const AssignPermissionToRole = async (permissionId, roleId) => {
    const { RolePermission } = models
    try {
      return sequelize.transaction(async (t) => {
        return await RolePermission.create({
          roleId: roleId,
          permissionId: permissionId,
        })
      })
    } catch (err) {
      throw err
    }
  }

  const AssignPermissionsToRole = async (permissions, roleId) => {
    const { RolePermission, Permission } = models
    try {
      const exists = []

      await Promise.all(
        permissions.map(async (permission) => {
          const found = await Permission.findByPk(permission)

          if (found) {
            exists.push({
              permissionId: found.id,
              roleId: roleId,
            })
          }

          return permission
        })
      )

      return sequelize.transaction(async (t) => {
        return await RolePermission.bulkCreate(exists)
      })
    } catch (err) {
      throw err
    }
  }

  const AssignPermissionToUser = async (permissionId, userId) => {
    const { UserPermission } = models
    try {
      return sequelize.transaction(async (t) => {
        return await UserPermission.create({
          userId: userId,
          permissionId: permissionId,
        })
      })
    } catch (err) {
      throw err
    }
  }

  const AssignPermissionsToUser = async (permissions, userId) => {
    const { UserPermission, Permission } = models
    try {
      const exists = []

      await Promise.all(
        permissions.map(async (permission) => {
          const found = await Permission.findByPk(permission)

          if (found) {
            exists.push({
              permissionId: found.id,
              userId: userId,
            })
          }

          return permission
        })
      )

      return sequelize.transaction(async (t) => {
        return await UserPermission.bulkCreate(exists)
      })
    } catch (err) {
      throw err
    }
  }

  const AssignPermissionsToUserByRoleIds = async (roleIds, userId) => {
    const { UserPermission, Permission, Role, RolePermission } = models
    try {
      const exists = []

      await Promise.all(
        roleIds.map(async (roleId) => {
          const found = await Role.findOne({
            where: { id: roleId },
            include: { model: Permission, as: 'permissions' },
          })

          if (found && found.permissions.length > 0) {
            found.permissions.map((permission) => {
              exists.push({
                permissionId: permission.id,
                userId: userId,
              })
            })
          }

          return roleId
        })
      )

      return sequelize.transaction(async (t) => {
        return await UserPermission.bulkCreate(exists)
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
    AssignPermissionToRole,
    AssignPermissionToUser,
    AssignPermissionsToRole,
    AssignPermissionsToUser,
    AssignPermissionsToUserByRoleIds,
  }
}
