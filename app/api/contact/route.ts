import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Where submissions land. Matches the EMAIL constant already used in
// SiteFooter — keep these in sync if you ever change your contact email.
const TO_EMAIL = 'jasminetan0510@gmail.com'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      // TODO: onboarding@resend.dev is Resend's shared sandbox sender —
      // it works with zero setup as long as TO_EMAIL above matches the
      // email address on your Resend account (sandbox mode only
      // delivers to your own verified account email). Once you verify
      // jasminetan.dev as a sending domain in the Resend dashboard
      // (adds a couple of DNS records), swap this to something like
      // 'Portfolio Contact <contact@jasminetan.dev>' so messages show
      // your own domain as the sender instead of Resend's.
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name} via jasminetan.dev`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send — please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong — please try again.' }, { status: 500 })
  }
}