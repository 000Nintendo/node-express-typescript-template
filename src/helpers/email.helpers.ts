import { buildEmail } from '../email/templates'

const nodemailer = require('nodemailer')
import { EmailJobObject } from '../@types/jobs'
import EmailJobsModel from '../models/email-jobs.model'

import * as fs from 'fs'

import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const adminResetPasswordTemplate = fs.readFileSync(
  './src/email/templates/reset-password.template.html',
  'utf-8'
)

/**
 * Type interfaces
 */

interface ISendMail {
  subject: string
  text?: string
  greeting: string
  mail_content: string
  to: string
}

// const mailTransport = nodemailer.createTransport({
//   host: 'smtpout.secureserver.net',
//   secure: true,
//   secureConnection: false, // TLS requires secureConnection to be false
//   tls: {
//     ciphers: 'SSLv3',
//   },
//   requireTLS: true,
//   port: 465,
//   debug: true,
//   auth: {
//     user: 'no-reply@mylo.global',
//     pass: 'meganalphamegan9',
//   },
// })

/**
 * Send email using gmail
 */
// const mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: true,
//   auth: {
//     user: process.env.AUTH_USER,
//     pass: process.env.AUTH_PASS,
//   },
// })

const mailTransport = nodemailer.createTransport({
  // service: 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
})

class EmailHelpers {
  static fetchEmailJobsFromDb = false
  static executingEmailJobs = false

  static startFetchEmailJobs = () => {
    this.fetchEmailJobsFromDb = true
  }

  static stopFetchingEmailJobs = () => {
    this.fetchEmailJobsFromDb = false
  }

  static startEmailJobExecution = () => {
    this.executingEmailJobs = true
  }

  static stopEmailJobExecution = () => {
    this.executingEmailJobs = false
  }

  static sendMail = async ({
    subject,
    text = '',
    greeting,
    mail_content,
    to,
  }: ISendMail) => {
    let mailOptions = {
      from: 'test@test.com',
      to,
      subject,
      text,
      html: buildEmail({ greeting, content: mail_content }),
    }

    await mailTransport.sendMail(mailOptions)

    return true
  }

  static sendResetPasswordEmailToAdmin = async ({
    subject,
    text = '',
    to,
    event_login_link,
  }: {
    subject: string
    text?: string
    to: string
    event_login_link: string
  }) => {
    const htmlContent = (adminResetPasswordTemplate as any).replaceAll(
      '{reset_password_link}',
      event_login_link
    )

    let mailOptions = {
      from: 'test@hikomore.com',
      to,
      subject,
      text,
      html: htmlContent,
    }

    await mailTransport.sendMail(mailOptions)

    return true
  }

  static sendEmailTemplate = async ({
    subject,
    text = '',
    html_content,
    to,
  }: {
    subject: string
    text?: string
    html_content: string
    to: string
  }) => {
    let mailOptions = {
      from: 'test@hikomore.com',
      to,
      subject,
      text,
      html: html_content,
    }

    await mailTransport.sendMail(mailOptions)

    return true
  }

  static readingEmailJobsFile = false
  static writingEmailJobsFile = false

  /**
   * Execute all the pending emails from email jobs file
   */
  static executeEmailJobs = async () => {
    try {
      if (!this.fetchEmailJobsFromDb) return

      if (this.executingEmailJobs) return

      this.startEmailJobExecution()

      const emailJobs = await EmailJobsModel.find({}).lean().exec()

      if (!emailJobs?.length) {
        this.stopFetchingEmailJobs()
        this.stopEmailJobExecution()
      }

      const emailJobPromises: any[] = []
      let deletableJobs: any[] = []
      let failedJobs = []

      Object.values(emailJobs).forEach((item) => {
        const jobItem = item as any as EmailJobObject

        const sendEmail = async () => {
          try {
            if (false) {
            } else {
              await this.sendMail({
                greeting: jobItem.greeting,
                mail_content: jobItem.mail_content,
                subject: jobItem.subject,
                to: jobItem.to,
                text: jobItem.text,
              })
            }

            return jobItem._id.toString()
          } catch (err) {
            failedJobs.push(jobItem._id)
          }
        }

        emailJobPromises.push(sendEmail)
      })

      if (!emailJobPromises.length) {
        this.readingEmailJobsFile = false
        this.writingEmailJobsFile = false
        this.executingEmailJobs = false

        return false
      }

      const res = await Promise.all(emailJobPromises.map((_job) => _job()))

      await EmailJobsModel.deleteMany({ _id: { $in: res } })

      const updatedEmailJobs = await EmailJobsModel.find({}).lean().exec()

      if (!updatedEmailJobs.length) {
        this.stopFetchingEmailJobs()
      }

      this.stopEmailJobExecution()

      return true
    } catch (err) {
      console.log('Something went wrong')
      console.log(err)
    }
  }
}

export default EmailHelpers
