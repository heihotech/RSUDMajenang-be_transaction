const baseHandler = require('./base')

module.exports = ({ httpTool, roleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: roleService })

  httpRouter.post('/api/roles', [middleware.JWTAuth], h.CreateAndInjectActor)
}
