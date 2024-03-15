import { Types } from 'mongoose'

export interface EmailJobObject {
  type: string
  subject: string
  text: string
  greeting: string
  mail_content: string
  metadata: any
  to: string
  _id: Types.ObjectId
}
