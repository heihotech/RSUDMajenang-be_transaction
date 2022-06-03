const Joi = require('joi')
const { ErrorUtil } = require('../internal/utils')
const { Op } = require('sequelize')
const { sequelize } = require('../infra/postgre')
const bcrypt = require('bcryptjs')
const ErrorMessage = {
  UsernameRequired: `harap isi field username`,
  UsernameAlphanum: `username hanya boleh huruf dan angka`,
  UsernameEmail: `username dalam format email`,
  UsernameMin: `username minimal {#limit} karakter`,
  PasswordRequired: `Harap isi field password`,
  PasswordMin: `password minimal {#limit} karakter`,
  EmailRequired: `Harap isi field email`,
  EmailMin: `Email minimal {#limit} karakter`,
  PhoneRequired: `Harap isi field Phone`,
  PhoneMin: `Phone minimal {#limit} karakter`,
  PhoneNum: `Phone hanya boleh angka`,
}

module.exports = ({ models }) => {
  return {
    ValidateSigninReq: async (body = {}) => {
      try {
        const validated = await Joi.object({
          username: Joi.string().required().min(3).messages({
            'any.required': ErrorMessage.UsernameRequired,
            'string.base': ErrorMessage.UsernameRequired,
            'string.required': ErrorMessage.UsernameRequired,
            'string.empty': ErrorMessage.UsernameRequired,
            'string.min': ErrorMessage.UsernameMin,
          }),
          password: Joi.string().required().min(8).messages({
            'any.required': ErrorMessage.PasswordRequired,
            'string.base': ErrorMessage.PasswordRequired,
            'string.empty': ErrorMessage.PasswordRequired,
            'string.required': ErrorMessage.PasswordRequired,
            'string.min': ErrorMessage.PasswordMin,
          }),
        }).validateAsync(body)

        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },
    ValidatePassword: async (password, signedHash) => {
      return bcrypt.compareSync(password, signedHash)
    },
    ValidateSignUp: async (body) => {
      try {
        const validated = await Joi.object({
          username: Joi.string().required().min(3).messages({
            'any.required': ErrorMessage.UsernameRequired,
            'string.base': ErrorMessage.UsernameRequired,
            'string.required': ErrorMessage.UsernameRequired,
            'string.empty': ErrorMessage.UsernameRequired,
            'string.min': ErrorMessage.UsernameMin,
          }),
          password: Joi.string().required().min(8).messages({
            'any.required': ErrorMessage.PasswordRequired,
            'string.base': ErrorMessage.PasswordRequired,
            'string.empty': ErrorMessage.PasswordRequired,
            'string.required': ErrorMessage.PasswordRequired,
            'string.min': ErrorMessage.PasswordMin,
          }),
          email: Joi.string().email().required().min(8).messages({
            'any.required': ErrorMessage.EmailRequired,
            'string.base': ErrorMessage.EmailRequired,
            'string.empty': ErrorMessage.EmailRequired,
            'string.required': ErrorMessage.EmailRequired,
            'string.min': ErrorMessage.EmailMin,
          }),
          phone: Joi.string()
            .min(10)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
              'any.required': ErrorMessage.PhoneRequired,
              'string.base': ErrorMessage.PhoneRequired,
              'string.empty': ErrorMessage.PhoneRequired,
              'string.required': ErrorMessage.PhoneRequired,
              'string.min': ErrorMessage.PhoneMin,
              'string.pattern': ErrorMessage.PhoneNum,
            }),
        }).validateAsync(body)

        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },

    Register: async (body) => {
      try {
        const found = await models.User.findOne({
          where: {
            [Op.or]: [
              {
                email: { [Op.eq]: body.email },
              },
              {
                username: { [Op.eq]: body.username },
              },
            ],
          },
        })

        if (found && found.id !== null) {
          throw new Error('email atau username sudah digunakan')
        }

        return sequelize.transaction(async (t) => {
          const createdUser = await models.User.create(
            {
              username: body.username,
              email: body.username,
              password: bcrypt.hashSync(body.password, 8),
              phone: body.phone,
            },
            { transaction: t }
          )

          console.log('createdUser')
          console.log(createdUser.id)

          if (!createdUser) {
            throw new Error('create user failed')
          }

          const roles = await models.Role.findAll({
            attributes: ['id'],
            where: {
              name: 'user',
            },
          })

          if (roles.length > 0) {
            const payload = roles.map((el) => {
              return { userId: createdUser.id, roleId: el.id }
            })

            await models.UserRole.bulkCreate(payload, { transaction: t })
          }

          return createdUser
        })
      } catch (err) {
        throw err
      }
    },
  }
}
