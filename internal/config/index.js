require('dotenv').config()

const Env = [
  'AppPort',
  'DBUser',
  'DBPass',
  'DBName',
  'DBHost',
  'DBPort',
  'SecretAuthKey',
  'SecretVerificationKey',
  'VerificationValid',
  'APIToken',
  'SecureCookies',
  'Host',
  'AllowOrigin',
  'DBLog',
]

module.exports = {
  Init: () => {
    const objectEnv = {}
    const notFound = []

    Env.forEach((el) => (objectEnv[el] = true))

    for (const e in objectEnv) {
      if (process.env[e]) {
        objectEnv[e] = process.env[e]
        module.exports.Var[e] = process.env[e]
      } else {
        notFound.push(e)
      }
    }

    if (notFound.length > 0) {
      const missingVars = notFound.join(', ')

      throw new Error(`These variables are required : ${missingVars}`)
    }
  },
  Var: {},
}
