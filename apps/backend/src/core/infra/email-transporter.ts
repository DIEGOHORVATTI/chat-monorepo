import nodemailer from 'nodemailer'
import { ENV } from '@repo/service-core'

export const transporter = nodemailer.createTransport({
  host: ENV.EMAIL.MAIL_HOST,
  port: ENV.EMAIL.MAIL_PORT,
  secure: ENV.EMAIL.MAIL_PORT === 465,
  auth: {
    user: ENV.EMAIL.MAIL_USERNAME,
    pass: ENV.EMAIL.MAIL_PASSWORD,
  },
})
