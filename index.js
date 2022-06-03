;(async () => {
  require('./internal/config').Init()

  const config = require('./internal/config').Var
  const { models, httpRouter } = await require('./infra').Init()
  const {
    middleware,
    userService,
    roleService,
    permissionService,
    authService,
    transactionService,
    rawInformationService,
  } = require('./services').Init({
    models,
  })

  require('./domain').New({
    httpTool: {
      httpRouter,
      middleware,
    },
    services: {
      userService,
      roleService,
      permissionService,
      authService,
      transactionService,
      rawInformationService,
    },
  })

  require('./infra/httpserver')
    .Invoke(httpRouter)
    .listen(config.AppPort, () => {
      console.log(`+++ Application is Running on Port ${config.AppPort}. +++`)
    })
})()
