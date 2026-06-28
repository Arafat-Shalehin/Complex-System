import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the connection configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"SimpleWay" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export async function sendRegistrationEmail(
  userEmail: string,
  name: string,
): Promise<void> {
  const subject = "Welcome to SimpleWay";

  const text = `
Hello ${name},

Welcome to SimpleWay.

Your account has been successfully created and is now ready to use.

Account Information:
- Name: ${name}
- Email: ${userEmail}

What happens next?
- Complete your profile information
- Verify your identity when required
- Keep your account credentials secure

Security Notice:
If you did not create this account, please contact our support team immediately.

Support:
Email: support@simpleway.com

Thank you for choosing SimpleWay.

Best Regards,
SimpleWay Team

This is an automated email. Please do not reply directly to this message.
`;

  const html = `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

  <div style="background:#111827;color:white;padding:24px;text-align:center;">
    <h1 style="margin:0;">SimpleWay</h1>
  </div>

  <div style="padding:32px;">
    <h2 style="margin-top:0;">
      Welcome, ${name} 👋
    </h2>

    <p>
      Your account has been successfully created and is now ready to use.
    </p>

    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:24px 0;">
      <h3 style="margin-top:0;">Account Information</h3>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
    </div>

    <h3>What's Next?</h3>

    <ul>
      <li>Complete your profile information</li>
      <li>Verify your identity when required</li>
      <li>Keep your account credentials secure</li>
    </ul>

    <div style="background:#fef3c7;padding:16px;border-radius:8px;margin-top:24px;">
      <strong>Security Notice</strong>
      <p style="margin-bottom:0;">
        If you did not create this account, please contact our support team immediately.
      </p>
    </div>

    <div style="margin-top:32px;">
      <p>
        Need help? Contact us at:
        <strong>support@simpleway.com</strong>
      </p>
    </div>
  </div>

  <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
    © 2026 SimpleWay. All rights reserved.
    <br />
    This is an automated email. Please do not reply directly to this message.
  </div>

</div>
`;

  try {
    await sendEmail(userEmail, subject, text, html);
  } catch (error) {
    console.error("Registration email failed:", error);
  }
}

export async function sendTransactionEmail(
  userEmail: string,
  name: string,
  amount: number,
  recipientAccountNumber: string,
): Promise<void> {
  const subject = "Transaction Completed";

  const text = `
Hello ${name},

Your transaction has been completed successfully.

Transaction Details:
- Amount: ${amount}
- Recipient Account: ${recipientAccountNumber}
- Status: COMPLETED

Please review your account if you do not recognize this transaction.

Thank you for banking with SimpleWay.

Best Regards,
SimpleWay Team

This is an automated email. Please do not reply to this email.
`;

  const html = `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

  <div style="background:#111827;color:white;padding:24px;text-align:center;">
    <h1 style="margin:0;">SimpleWay</h1>
  </div>

  <div style="padding:32px;">

    <h2 style="margin-top:0;">
      Transaction Completed ✅
    </h2>

    <p>
      Hello <strong>${name}</strong>,
    </p>

    <p>
      Your transaction has been completed successfully.
    </p>

    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:24px 0;">
      <h3 style="margin-top:0;">Transaction Details</h3>

      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Recipient Account:</strong> ${recipientAccountNumber}</p>
      <p><strong>Status:</strong> COMPLETED</p>
    </div>

    <div style="background:#ecfdf5;padding:16px;border-radius:8px;">
      <strong>Security Reminder</strong>
      <p style="margin-bottom:0;">
        If you do not recognize this transaction, please contact our support team immediately.
      </p>
    </div>

  </div>

  <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
    © 2026 SimpleWay. All rights reserved.
    <br/>
    This is an automated email. Please do not reply directly to this message.
  </div>

</div>
`;

  await sendEmail(userEmail, subject, text, html);
}

export async function sendTransactionFailureEmail(
  userEmail: string,
  name: string,
  amount: number,
  recipientAccountNumber: string,
): Promise<void> {
  const subject = "Transaction Failed";

  const text = `
Hello ${name},

Unfortunately, we could not complete your transaction.

Transaction Details:
- Amount: ${amount}
- Recipient Account: ${recipientAccountNumber}
- Status: FAILED

No money has been transferred.

Please verify your account information and try again. If the issue continues, contact our support team.

Best Regards,
SimpleWay Team

This is an automated email. Please do not reply to this email.
`;

  const html = `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

  <div style="background:#111827;color:white;padding:24px;text-align:center;">
    <h1 style="margin:0;">SimpleWay</h1>
  </div>

  <div style="padding:32px;">

    <h2 style="margin-top:0;">
      Transaction Failed ❌
    </h2>

    <p>
      Hello <strong>${name}</strong>,
    </p>

    <p>
      Unfortunately, your transaction could not be completed.
    </p>

    <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:24px 0;">
      <h3 style="margin-top:0;">Transaction Details</h3>

      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Recipient Account:</strong> ${recipientAccountNumber}</p>
      <p><strong>Status:</strong> FAILED</p>
    </div>

    <div style="background:#fef2f2;padding:16px;border-radius:8px;">
      <strong>What should you do?</strong>
      <p style="margin-bottom:0;">
        Please verify your information and try again. If the issue persists, contact our support team.
      </p>
    </div>

  </div>

  <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
    © 2026 SimpleWay. All rights reserved.
    <br/>
    This is an automated email. Please do not reply directly to this message.
  </div>

</div>
`;

  await sendEmail(userEmail, subject, text, html);
}
