import { CommonEnums } from '../enums/common.enums'
import { sendResponse } from '../helpers/common'
import AdminModel from '../models/admins.model'
import { Role } from '../utils/enums'
import ResponseCodes from '../utils/responseCodes'

const jwt = require('jsonwebtoken')

const config = process.env

export const verifyToken = async (token: any) => {
  try {
    if (token === process.env?.ALLOW_UNAUTHENTICATED_REQUEST_TOKEN) {
      return { success: true, user: undefined }
    } else {
      const decoded = jwt.verify(`${token}`, config.ACCESS_TOKEN_SECRET)
      const user_type = decoded?.user_type

      let user: any = null
      let userId = decoded._id

      /**
       * Add checks for all the user types here to authenticate the users
       */

      user = await AdminModel.findById(userId)

      // if (user_type === user_type.USER) {
      //   user = await User.findOne({ _id: decoded.user_id })
      //   user.user_type = user_type.USER
      // }

      if (!user) return { success: false, user, user_type: null }
      if (decoded) return { success: true, user, user_type }
      return { success: false, user, user_type: null }
    }
  } catch {
    return { success: false, user: undefined, user_type: null }
  }
}

export const authenticateRequests = async (req: any, res: any, next: any) => {
  if (!req.headers?.authorization) {
    return sendResponse({
      res,
      message: 'Access token is required!',
      res_code: 403,
      response_code: ResponseCodes.UNAUTHORIZED,
      success: false,
    })
  }

  if (req.headers?.authorization) {
    let token = req.headers.authorization.split(' ')[1]

    if (token === process.env?.ALLOW_UNAUTHENTICATED_REQUEST_TOKEN) {
      return next()
    } else {
      const decodedToken = await verifyToken(token)

      if (!decodedToken.success) {
        if (decodedToken.user === undefined)
          return res.status(401).json({
            success: false,
            error: 'Unable to decode token.',
            response_code: ResponseCodes.INVALID_TOKEN,
            message: 'Invalid Token.',
          })

        return res.status(401).json({
          success: false,
          error: 'Unable to find user.',
          message: 'User not found.',
          response_code: ResponseCodes.UNAUTHORIZED,
        })
      }

      // for older routes
      req.user = decodedToken.user
      req.user_type = decodedToken.user_type

      // use locals from this point onwards
      res.locals.user = decodedToken.user
      res.locals.user_type = decodedToken.user_type
    }
    return next()
  }
}

export const allowOnlyAdmins = async (req: any, res: any, next: any) => {
  if (res?.locals?.role !== Role.ADMIN)
    return res.status(401).json({
      success: false,
      error: 'Unauthorized API Call.',
      message: 'You are not authorized to use this route.',
      response_code: ResponseCodes.UNAUTHORIZED,
    })

  next()
}
