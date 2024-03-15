import AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { transliterate as tr } from 'transliteration'
import dotenv from 'dotenv'
import UploadsModel from '../models/uploads.model'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const fs = require('fs-extra')

const s3 = new AWS.S3({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const BUCKET = process.env.AWS_BUCKET + '/attachments'

export class UploadsHelpers {
  static uploadFile = () => {}

  static uploadAvatar = async ({
    file,
    user_id,
  }: {
    file: any
    user_id?: string
  }) => {
    const promises = []
    let failed = false
    let uploadRecord: any = null

    const identifier = `${file.filename}-${uuid()}`
    const fileSize = file.size
    const fileName = file.originalname
    const filetype = file.mimetype

    const readStream = fs.createReadStream(file.path)
    let bucketName = BUCKET + '/avatars/'

    const uploadParams = {
      Bucket: bucketName,
      Key: identifier,
      Body: readStream,
      ContentType: file.mimetype,
      Metadata: {
        'Original-Filename': tr(fileName),
      },
      ACL: 'public-read',
    }

    promises.push(
      new Promise<void>((r) =>
        s3.upload(uploadParams, async (error: Error, data: any) => {
          if (error) {
            failed = true
            fs.remove(file.path)
          } else {
            try {
              const uploadRes = await UploadsModel.create({
                file_name: fileName,
                file_size: fileSize,
                file_url: data.Location,
                bucket: bucketName,
                key: identifier,
                user_id,
              })

              fs.remove(file.path)
              uploadRecord = uploadRes
            } catch (err) {
              fs.remove(file.path)
            }
          }

          r()
        })
      )
    )

    await Promise.all(promises)

    if (!uploadRecord) {
      return {
        success: false,
        uploadRecord: null,
      }
    }

    return {
      success: true,
      uploadRecord: uploadRecord.toJSON(),
    }
  }

  static uploadFeaturedImageForEvent = async ({
    file,
    event_id,
  }: {
    file: any
    event_id?: string
  }) => {
    const promises = []
    let failed = false
    let uploadRecord: any = null

    const identifier = `${file.filename}-${uuid()}`
    const fileSize = file.size
    const fileName = file.originalname
    const filetype = file.mimetype

    const readStream = fs.createReadStream(file.path)
    let bucketName = BUCKET + '/images/'

    const uploadParams = {
      Bucket: bucketName,
      Key: identifier,
      Body: readStream,
      ContentType: file.mimetype,
      Metadata: {
        'Original-Filename': tr(fileName),
      },
      ACL: 'public-read',
    }

    promises.push(
      new Promise<void>((r) =>
        s3.upload(uploadParams, async (error: Error, data: any) => {
          if (error) {
            failed = true
            fs.remove(file.path)
          } else {
            try {
              const uploadRes = await UploadsModel.create({
                file_name: fileName,
                file_size: fileSize,
                file_url: data.Location,
                bucket: bucketName,
                key: identifier,
                event_id,
              })

              fs.remove(file.path)
              uploadRecord = uploadRes
            } catch (err) {
              fs.remove(file.path)
            }
          }

          r()
        })
      )
    )

    await Promise.all(promises)

    if (!uploadRecord) {
      return {
        success: false,
        uploadRecord: null,
      }
    }

    return {
      success: true,
      uploadRecord: uploadRecord.toJSON(),
    }
  }

  static deleteUpload = async ({ image_url = '' }: { image_url: string }) => {
    if (!image_url) return true

    const upload = await UploadsModel.findOne({
      file_url: image_url.trim(),
    })

    if (!upload) {
      return {
        success: true,
      }
    }

    const params = {
      Bucket: upload.bucket,
      Key: upload.key,
    }

    await new Promise<void>((r) =>
      s3.deleteObject(params, async (err) => {
        await UploadsModel.findByIdAndDelete({ _id: upload._id })
        r()
      })
    )

    return true
  }
}
