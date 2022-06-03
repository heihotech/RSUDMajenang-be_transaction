const { ResponseUtil } = require('../../internal/utils')

const handler = ({ permissionService, roleService }) => {
  return {
    InsertPermissionsToRole: async (req, res, next) => {
      try {
        await roleService.ValidateId(req.params)

        if (
          !req.body ||
          !req.body.permissions ||
          req.body.permissions.length < 1
        ) {
          throw new Error('harap isi data permissions')
        }

        const data = await permissionService.AssignPermissionsToRole(
          req.body.permissions,
          req.params.roleId
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, permissionService, roleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({
    permissionService,
    roleService,
  })

  httpRouter.post(
    '/api/roles/:roleId/permissions',
    [middleware.JWTAuth],
    h.InsertPermissionsToRole
  )
}
