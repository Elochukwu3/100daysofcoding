const nodemailer = require("nodemailer");

const sendOTPEmail = async (email: string, token: string) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const htmlTemplate = `
        <html>
        <body style="text-align: center; max-width:100%; font-family: Arial, sans-serif;">
    
            <h1 style="color: #333;">Ecommerce</h1>
    
            <p>Your one-time Email verification code is:</p>
    
            <h2 style="color: #333; font-size: 24px;">${token}</h2>
    
            <p>Copy the link and Paste it to verify the Email</p>
    
            <div style="margin-top: 20px;">
                <p style="font-size: 14px; color: #666;">Developed by Kariebi</p>
            </div>
        </body>
    </html>    
        `;

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    return "Email Sent Successfully";
  } catch (error) {
    throw error;
  }
};

export default sendOTPEmail;
