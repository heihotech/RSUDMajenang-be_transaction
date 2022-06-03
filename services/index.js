module.exports = {
  Init: ({ models }) => {
    return {
      middleware: require('./middleware')({ models }),
      userService: require('./user')({ models }),
      roleService: require('./role')({ models }),
      permissionService: require('./permission')({ models }),
      authService: require('./auth')({ models }),
      transactionService: require('./transaction')({ models }),
      rawInformationService: require('./rawinformation')({ models }),
    }
  },
}
