import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'LCarDrive <noreply@lcardrive.com.au>'

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) console.error('Resend error:', error)
    return !error
  } catch (err) {
    console.error('Email send failed:', err)
    return false
  }
}
