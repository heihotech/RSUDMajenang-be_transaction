const jwt = require('jsonwebtoken')
const config = require('../config').Var
const bcryptjs = require('bcryptjs')

module.exports = {
  GenerateJWT: async (user, opt = { expiresIn: config.VerificationValid }) => {
    try {
      const payload = user

      return jwt.sign(payload, config.SecretAuthKey, opt)
    } catch (err) {
      throw err
    }
  },
  VerifyJWT: async (token) => jwt.verify(token, config.SecretAuthKey),
  GenerateRandom: async (number) => bcryptjs.genSaltSync(number),
}
