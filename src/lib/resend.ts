import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Nikah Muyassar <assalam@nikahmuyassar.org>',
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) {
  try {
    const data = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Nikah Muyassar — Verify Your Email',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFDF7;">
        <div style="background: #0D7377; padding: 30px; text-align: center;">
          <h1 style="color: #F4A81D; font-family: 'Playfair Display', serif; margin: 0; font-size: 28px;">Nikah Muyassar</h1>
          <p style="color: #E8F5F5; margin: 5px 0 0 0; font-size: 14px;">نكاح ميسر</p>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #1A1A2E; line-height: 1.6;">Assalamu Alaikum ${name},</p>
          <p style="font-size: 16px; color: #1A1A2E; line-height: 1.6;">Welcome to Nikah Muyassar! We are honored to have you join our community dedicated to facilitating marriage for those in need.</p>
          <p style="font-size: 16px; color: #1A1A2E; line-height: 1.6;">Please verify your email address to get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/callback" style="background: #0D7377; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Email</a>
          </div>
          <hr style="border: none; border-top: 1px solid #E8F5F5; margin: 20px 0;" />
          <p style="font-size: 14px; color: #6B7280; font-style: italic;">"And among His signs is that He created for you from yourselves mates that you may find tranquility in them." — Ar-Rum 30:21</p>
        </div>
        <div style="background: #1A1A2E; padding: 20px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">&copy; 2024 Nikah Muyassar. All rights reserved.</p>
          <p style="color: #9CA3AF; font-size: 12px; margin: 5px 0 0 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #F4A81D; text-decoration: none;">Privacy Policy</a> |
            <a href="%unsubscribe_url%" style="color: #F4A81D; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  })
}
