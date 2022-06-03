const { v4: uuidv4 } = require('uuid')
const roles = [
  {
    id: 7,
    guid: uuidv4(),
    name: 'super',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 1,
    guid: uuidv4(),
    name: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = roles
