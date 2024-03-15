import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import pick from '../utils/pick'

const validator = (schema: any) => (req: any, res: any, next: any) => {
  const validSchema = pick(schema, ['params', 'query', 'body'])

  const object = pick(req, Object.keys(validSchema))

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message.replace(/"/g, ''))
      .join(', ')
    return res.status(400).json({ error: errorMessage })
  }
  Object.assign(req, value)
  return next()
}

export default validator
