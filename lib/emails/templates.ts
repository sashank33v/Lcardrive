export const claimReceivedEmail = (instructorName: string) => ({
  subject: 'We received your profile claim — LCarDrive',
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#F0F2FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:#1A3CFF;padding:32px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700">LCarDrive</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Australia's driving instructor directory</p>
        </div>
        <div style="padding:32px">
          <h2 style="color:#1A2444;font-size:20px;margin:0 0 16px">Hi ${instructorName},</h2>
          <p style="color:#4B5563;line-height:1.6;margin:0 0 16px">
            We've received your profile claim and our team will verify your ADI registration within <strong>24–48 hours</strong>.
          </p>
          <p style="color:#4B5563;line-height:1.6;margin:0 0 24px">
            Once approved, your verified badge will appear on your profile and you'll have full access to the instructor portal to update your details.
          </p>
          <div style="background:#F0F2FF;border-radius:12px;padding:16px;margin-bottom:24px">
            <p style="color:#6B7280;font-size:14px;margin:0">
              📋 <strong>What happens next:</strong><br>
              1. Our team verifies your ADI number with VicRoads<br>
              2. You'll receive a confirmation email when approved<br>
              3. Log in to your portal to complete your profile
            </p>
          </div>
          <a href="https://lcardrive.com.au/portal" style="display:inline-block;background:#1A3CFF;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px">
            Visit Your Portal →
          </a>
        </div>
        <div style="padding:16px 32px;background:#F9FAFB;border-top:1px solid #F3F4F6">
          <p style="color:#9CA3AF;font-size:12px;margin:0;text-align:center">
            LCarDrive · Australia's driving instructor directory<br>
            You're receiving this because you claimed a profile on LCarDrive.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
})

export const claimApprovedEmail = (instructorName: string) => ({
  subject: '🎉 Your profile is now verified — LCarDrive',
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#F0F2FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:#1A3CFF;padding:32px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700">LCarDrive</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Australia's driving instructor directory</p>
        </div>
        <div style="padding:32px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="width:64px;height:64px;background:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px">✅</div>
          </div>
          <h2 style="color:#1A2444;font-size:20px;margin:0 0 16px;text-align:center">You're verified, ${instructorName}!</h2>
          <p style="color:#4B5563;line-height:1.6;margin:0 0 16px;text-align:center">
            Your profile now has the <strong>verified badge</strong> and will appear higher in search results.
          </p>
          <div style="background:#DCFCE7;border:1px solid #BBF7D0;border-radius:12px;padding:16px;margin-bottom:24px">
            <p style="color:#15803D;font-size:14px;margin:0">
              🚀 <strong>Next steps to rank higher:</strong><br>
              • Add a profile photo<br>
              • Write your bio (or use our AI writer)<br>
              • Set your service areas and test centres<br>
              • Add your pricing details
            </p>
          </div>
          <div style="text-align:center">
            <a href="https://lcardrive.com.au/portal" style="display:inline-block;background:#1A3CFF;color:white;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px">
              Complete Your Profile →
            </a>
          </div>
        </div>
        <div style="padding:16px 32px;background:#F9FAFB;border-top:1px solid #F3F4F6">
          <p style="color:#9CA3AF;font-size:12px;margin:0;text-align:center">
            LCarDrive · Australia's driving instructor directory
          </p>
        </div>
      </div>
    </body>
    </html>
  `
})

export const claimRejectedEmail = (instructorName: string, reason?: string) => ({
  subject: 'Update on your profile claim — LCarDrive',
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#F0F2FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:#1A3CFF;padding:32px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700">LCarDrive</h1>
        </div>
        <div style="padding:32px">
          <h2 style="color:#1A2444;font-size:20px;margin:0 0 16px">Hi ${instructorName},</h2>
          <p style="color:#4B5563;line-height:1.6;margin:0 0 16px">
            Unfortunately we were unable to verify your profile claim at this time.
          </p>
          ${reason ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:16px"><p style="color:#DC2626;font-size:14px;margin:0"><strong>Reason:</strong> ${reason}</p></div>` : ''}
          <p style="color:#4B5563;line-height:1.6;margin:0 0 24px">
            If you believe this is an error, please reply to this email with your ADI registration documentation and we'll review your claim manually.
          </p>
          <a href="mailto:support@lcardrive.com.au" style="display:inline-block;background:#1A3CFF;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px">
            Contact Support →
          </a>
        </div>
        <div style="padding:16px 32px;background:#F9FAFB;border-top:1px solid #F3F4F6">
          <p style="color:#9CA3AF;font-size:12px;margin:0;text-align:center">LCarDrive · Australia's driving instructor directory</p>
        </div>
      </div>
    </body>
    </html>
  `
})

export const reviewConfirmationEmail = (reviewerName: string, instructorName: string) => ({
  subject: 'Your review has been submitted — LCarDrive',
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#F0F2FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:#1A3CFF;padding:32px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700">LCarDrive</h1>
        </div>
        <div style="padding:32px">
          <h2 style="color:#1A2444;font-size:20px;margin:0 0 16px">Thanks, ${reviewerName}!</h2>
          <p style="color:#4B5563;line-height:1.6;margin:0 0 16px">
            Your review for <strong>${instructorName}</strong> has been submitted and is pending approval by our team.
          </p>
          <p style="color:#4B5563;line-height:1.6;margin:0 0 24px">
            It will appear on the profile within <strong>24 hours</strong> once approved. Reviews help learners make better decisions — thank you for contributing!
          </p>
        </div>
        <div style="padding:16px 32px;background:#F9FAFB;border-top:1px solid #F3F4F6">
          <p style="color:#9CA3AF;font-size:12px;margin:0;text-align:center">LCarDrive · Australia's driving instructor directory</p>
        </div>
      </div>
    </body>
    </html>
  `
})
