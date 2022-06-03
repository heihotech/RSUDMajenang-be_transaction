const { v4: uuidv4 } = require('uuid')

const availableRoutes = [
  {
    path: '/api/sign/out',
    methods: ['POST'],
    middlewares: ['JWTAuth', 'SignOutHandler'],
  },
  {
    path: '/api/users',
    methods: ['GET', 'POST'],
    middlewares: ['JWTAuth', 'GetUsers'],
  },
  {
    path: '/api/users/me',
    methods: ['GET'],
    middlewares: ['JWTAuth', 'GetCurrentUser'],
  },
  {
    path: '/api/users/check/email',
    methods: ['POST'],
    middlewares: ['JWTAuth', 'CheckEmail'],
  },
  {
    path: '/api/users/:userId',
    methods: ['GET'],
    middlewares: ['JWTAuth', 'GetUser'],
  },
  {
    path: '/api/roles',
    methods: ['GET', 'POST'],
    middlewares: ['JWTAuth', 'GetRoles'],
  },
  {
    path: '/api/roles/:roleId',
    methods: ['GET', 'DELETE'],
    middlewares: ['JWTAuth', 'GetRole'],
  },
  {
    path: '/api/permissions',
    methods: ['GET', 'POST'],
    middlewares: ['JWTAuth', 'GetPermissions'],
  },
  {
    path: '/api/permissions/:permissionId',
    methods: ['GET', 'DELETE'],
    middlewares: ['JWTAuth', 'GetPermission'],
  },
  {
    path: '/api/upload/file',
    methods: ['POST'],
    middlewares: ['JWTAuth', 'multerMiddleware', 'UploadFileHandler'],
  },
  {
    path: '/api/roles/:roleId/permissions',
    methods: ['POST'],
    middlewares: ['JWTAuth', 'InsertPermissionsToRole'],
  },
  {
    path: '/api/users/:userId/permissions',
    methods: ['POST'],
    middlewares: ['JWTAuth', 'InsertPermissionsToUser'],
  },
  {
    path: '/api/users/:userId/roles',
    methods: ['POST'],
    middlewares: ['JWTAuth', 'InsertRolesAndPermissionsToUser'],
  },
  {
    path: '/api/permissions/:permissionId/restore',
    methods: ['DELETE'],
    middlewares: ['JWTAuth', 'Restore'],
  },
  {
    path: '/api/permissions/:permissionId/force',
    methods: ['DELETE'],
    middlewares: ['JWTAuth', 'DeleteForce'],
  },
  {
    path: '/api/roles/:roleId/restore',
    methods: ['DELETE'],
    middlewares: ['JWTAuth', 'Restore'],
  },
  {
    path: '/api/roles/:roleId/force',
    methods: ['DELETE'],
    middlewares: ['JWTAuth', 'DeleteForce'],
  },
]

let routes = []

availableRoutes.forEach((route, index) => {
  if (route.length === 1) {
    routes.push({
      guid: uuidv4(),
      name: `${
        route.methods[0].toLowerCase() + '-' + route.path.replace(/\//g, '_')
      }`,
      path: route.path,
      method: route.methods[0].toLowerCase(),
      description: '-',
      is_public: true,
      created_at: new Date(),
      updated_at: new Date(),
    })
  } else {
    route.methods.forEach((mtd) => {
      routes.push({
        guid: uuidv4(),
        name: `${mtd.toLowerCase() + '-' + route.path.replace(/\//g, '_')}`,
        path: route.path,
        method: mtd.toLowerCase(),
        description: '-',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })
  }
})

const permissions = routes

module.exports = permissions
