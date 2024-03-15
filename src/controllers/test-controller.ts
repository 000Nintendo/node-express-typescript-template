// @ts-nocheck

import moment from 'moment'
import { sendResponse } from '../helpers/common'
import EmailHelpers from '../helpers/email.helpers'
import CountriesModel from '../models/countries.model'
import { DelegateServices } from '../services/delegates.services'
import { EventServices } from '../services/event.services'
import { UserServices } from '../services/users.services'
import { catchAsync } from '../utils/catchAsync'
import { FileLocationEnums } from '../utils/files.enums'
import ResponseCodes from '../utils/responseCodes'
var crypto = require('crypto')
var assert = require('assert')

const fs = require('fs').promises

class TestController {
  static addCountries = catchAsync(async (req: Request, res: Response) => {})

  static testFunction = catchAsync(async (req: Request, res: Response) => {
    // await EmailService.sendAdminRegistrationEmail({
    //   first_name: 'Niten',
    //   last_name: 'Solanki',
    //   email: 'test@hikomore.com',
    //   password: '12345678',
    // })

    // await EventServices.addMediaPartner({
    //   event_ids: ['65a2df01732c37fa8273b1bd', '65a0e796b2338453ec1837c7'],
    //   media_partner_id: '65a16ef6b2338453ec183ac8',
    // })

    // await EventServices.removeEventFromDelegates({
    //   delegate_ids: ['65aad5dfee6423b297c44876', '65aabd269e95c455591f6ffd'],
    //   event_id: '65a0e796b2338453ec1837c7',
    // })

    // const _res = await DelegateServices.getProfileSurvey({
    //   user_id: '65b7853bc826bb0ef1e4ddde',

    // })
    const user = req.user

    // await EmailHelpers.sendEmailTemplate({
    //   to: 'test@hikomore.com',
    //   subject: 'Email template test',
    //   html_content: ``,
    // })

    // await UserServices.getUserColleaguesForEvent()

    // var algorithm = 'aes256' // or any other algorithm supported by OpenSSL
    // var key = 'password'
    // var text = 'I love kittens'

    // var cipher = crypto.createCipher(algorithm, key)
    // var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    // var decipher = crypto.createDecipher(algorithm, key)
    // var decrypted =
    //   decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')

    // assert.equal(decrypted, text)

    return sendResponse({
      res,
      res_code: 200,
      response_code: ResponseCodes.DELETE_SUCCESS,
      success: true,
    })
  })

  static testEmailTemplate = catchAsync(async (req: Request, res: Response) => {
    const { html, to } = req.body

    await EmailHelpers.sendEmailTemplate({
      to: to,
      subject: 'Email template test',
      html_content: html,
    })

    return sendResponse({
      res,
      res_code: 200,
      response_code: ResponseCodes.SUCCESS,
      success: true,
    })
  })
}

export default TestController
