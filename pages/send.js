import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function buildHTML(name, email) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:0;">
<div style="background:#185FA5;padding:18px 24px;display:flex;align-items:center;gap:12px;">
  <div style="width:40px;height:40px;border-radius:50%;background:#E6F1FB;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#185FA5;">${name.trim().split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div>
  <div style="display:inline-block;margin-left:12px;">
    <div style="color:#E6F1FB;font-size:16px;font-weight:600;">Kairotech Solutions</div>
    <div style="color:#B5D4F4;font-size:12px;">Registration Confirmation</div>
  </div>
</div>
<div style="padding:24px;background:#ffffff;">
  <p style="font-size:15px;font-weight:600;margin-bottom:6px;">Dear ${name},</p>
  <div style="display:inline-block;background:#EAF3DE;color:#3B6D11;border-radius:6px;padding:5px 12px;font-size:13px;font-weight:600;margin-bottom:14px;">✅ Registered successfully</div>
  <p style="font-size:14px;color:#444;margin-bottom:20px;">You have been registered successfully with Kairotech Solutions.<br>Thank you for working with us!</p>
  <div style="background:#f5f5f5;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
    <p style="font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Your login credentials</p>
    <p style="font-size:13px;margin:6px 0;">🔗 <strong>Login:</strong> <a href="https://redalertsol.com/" style="color:#185FA5;">https://redalertsol.com/</a></p>
    <p style="font-size:13px;margin:6px 0;">👤 <strong>Username:</strong> ${email}</p>
    <p style="font-size:13px;margin:6px 0;">🔑 <strong>Password:</strong> Your Phone Number</p>
  </div>
  <a href="https://redalertsol.com/" style="display:block;text-align:center;background:#185FA5;color:#ffffff;border-radius:8px;padding:11px;font-size:14px;font-weight:600;text-decoration:none;margin-bottom:20px;">🔗 Go to Login Page</a>
  <div style="background:#E6F1FB;border-radius:8px;padding:16px;margin-bottom:16px;">
    <p style="font-size:14px;font-weight:600;color:#0C447C;margin-bottom:8px;">🌟 Need Help? We're Here for You!</p>
    <p style="font-size:13px;color:#185FA5;margin-bottom:10px;">If you have any questions or need assistance, feel free to contact our Helpline Team. We'll be happy to help! 😊</p>
    <p style="font-size:13px;color:#185FA5;margin:4px 0;">📞 7434921437</p>
    <p style="font-size:13px;color:#185FA5;margin:4px 0;">📧 kairotechsolutionshelpline@gmail.com</p>
    <div style="background:#fff;border-radius:6px;padding:8px 12px;margin-top:8px;font-size:12px;color:#555;">🕒 Helpline Working Hours<br>Monday – Saturday &nbsp;|&nbsp; 10:00 AM – 5:00 PM</div>
  </div>
  <p style="font-size:12px;color:#888;margin-bottom:16px;">☎️ If your call is not connected, kindly send us an email and our team will get back to you as soon as possible.</p>
  <div style="border-top:1px solid #eee;padding-top:14px;text-align:center;font-size:12px;color:#888;">
    Thank you for reaching out to us! 💙<br><br>
    Warm regards,<br><strong>Kairotech Solutions Team</strong>
  </div>
</div></body></html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { members } = req.body
  if (!members || !Array.isArray(members)) return res.status(400).json({ error: 'Invalid members list' })

  const results = []
  for (const member of members) {
    try {
      await resend.emails.send({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: [member.email],
        subject: 'You have been registered successfully with Kairotech Solutions',
        html: buildHTML(member.name, member.email),
        tags: [{ name: 'member', value: member.email.replace('@','_').replace(/\./g,'_') }]
      })
      results.push({ email: member.email, status: 'sent' })
    } catch (e) {
      results.push({ email: member.email, status: 'failed', error: e.message })
    }
    await new Promise(r => setTimeout(r, 200))
  }
  return res.status(200).json({ results })
}
