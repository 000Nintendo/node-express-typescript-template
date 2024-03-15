import { AvatarType } from './enums'
import Expert from '../models/experts.model'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

export const formatField = (field: string, data?: string) => {
  if (field === 'years_of_experience' && data) return `${data?.trim()}yrs exp`
  return data
}

export const getProfileTitle = (expertBrief: any) => {
  return expertBrief.profile_title_format.map((px: string) =>
    formatField(px, expertBrief[px])
  ).filter((x: any) => x).join(', ')
}

export const sanitizeExpertForWeb = (expert: any) => {
  let profileTitle = null
  let avatar_url = null

  if (!expert) return null

  if (expert?.brief) profileTitle = getProfileTitle(expert.brief)

  if (expert?.avatar === AvatarType.PUBLIC) {
    const url = s3.getSignedUrl('getObject', {
      Bucket: `${process.env.AWS_BUCKET}/avatar/expert`,
      Key: `${expert._id}`,
      Expires: 86400
    })

    if (url) avatar_url = url
  }

  return {
    ...(expert?.toObject ? expert.toObject() : expert) ,
    brief: undefined,
    avatar: undefined,
    profileTitle, avatar_url
  }
}

export const fetchSanitizedExpertForWeb = async (expertId: string) => {
  let expert: any = await Expert.findOne(
    { _id: expertId }, {},
    { projection: '_id first_name last_name prefix brief avatar avatar_url' }
  )

  return sanitizeExpertForWeb(expert)
}
