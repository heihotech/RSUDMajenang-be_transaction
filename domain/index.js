const Event = require('./event')
const Health = require('./health')
const Signing = require('./signing')
const Updating = require('./updating')
const Listing = require('./listing')
const Creating = require('./creating')
const Uploading = require('./uploading')
const Inserting = require('./inserting')
const Deleting = require('./deleting')

module.exports = {
  New: ({ httpTool, services }) => {
    const {
      authService,
      userService,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    } = services

    const {} = Event({})

    Health({ httpTool })
    Signing({ httpTool, authService, userService })
    Updating({
      httpTool,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    })
    Listing({
      httpTool,
      userService,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    })
    Creating({
      httpTool,
      userService,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    })
    Uploading({
      httpTool,
      userService,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    })
    Inserting({
      httpTool,
      userService,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    })
    Deleting({
      httpTool,
      roleService,
      permissionService,
      transactionService,
      rawInformationService,
    })
  },
}
