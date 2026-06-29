const nodemailer = require('nodemailer');

let transporter;

// Create transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  // Check if SMTP environment variables are set
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('Nodemailer SMTP Transporter configured.');
  } else {
    // Generate Ethereal testing account
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`Nodemailer Ethereal Sandbox Configured. Test account: ${testAccount.user}`);
    } catch (err) {
      console.error('Failed to create Ethereal test account. Falling back to console logger.', err);
      // Fallback logging transporter
      transporter = {
        sendMail: async (options) => {
          console.log('\n================ MOCK EMAIL SENT ================');
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Body: ${options.text || options.html}`);
          console.log('=================================================\n');
          return { messageId: 'mock-id-' + Date.now() };
        }
      };
    }
  }
  return transporter;
};

/**
 * Send confirmation email with registration details
 */
const sendConfirmationEmail = async (registration, event) => {
  try {
    const mailTransporter = await getTransporter();
    
    const qrAttachment = registration.qrCode ? [
      {
        filename: 'ticket-qr.png',
        content: registration.qrCode.split(';base64,').pop(),
        encoding: 'base64',
        cid: 'qrcode'
      }
    ] : [];

    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; text-align: center;">Registration Confirmed!</h2>
        <p>Dear <strong>${registration.studentName}</strong>,</p>
        <p>You have successfully registered for the event: <strong>${event.title}</strong>.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Event Details</h3>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${event.category}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${event.time}</p>
          <p style="margin: 5px 0;"><strong>Venue:</strong> ${event.venue}</p>
          <p style="margin: 5px 0;"><strong>Organiser:</strong> ${event.organiser}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Your Details</h3>
          <p style="margin: 5px 0;"><strong>Roll Number:</strong> ${registration.rollNumber}</p>
          <p style="margin: 5px 0;"><strong>Department:</strong> ${registration.department}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${registration.phone}</p>
        </div>

        ${registration.qrCode ? `
        <div style="text-align: center; margin: 20px 0;">
          <p>Please present this QR Code at the venue entry:</p>
          <img src="cid:qrcode" alt="QR Code Ticket" style="width: 200px; height: 200px; border: 1px solid #e2e8f0; padding: 5px; border-radius: 4px;" />
        </div>
        ` : ''}

        <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 30px;">
          If you need to cancel your registration, please do so from the "My Registrations" portal before the event deadline.
        </p>
      </div>
    `;

    const info = await mailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Event Registration Portal" <noreply@eventportal.com>',
      to: registration.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: htmlContent,
      attachments: qrAttachment,
    });

    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Email sent successfully. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`Confirmation email sent to ${registration.email}`);
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

/**
 * Send reminder email to student
 */
const sendReminderEmail = async (email, studentName, event) => {
  try {
    const mailTransporter = await getTransporter();
    
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #e11d48; text-align: center;">Upcoming Event Reminder!</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>This is a friendly reminder that you are registered for the event: <strong>${event.title}</strong>, which will be starting soon.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Event Details</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${event.time}</p>
          <p style="margin: 5px 0;"><strong>Venue:</strong> ${event.venue}</p>
          <p style="margin: 5px 0;"><strong>Organiser:</strong> ${event.organiser}</p>
        </div>

        <p>Please make sure to arrive on time and have your QR code ticket ready at the door.</p>
        <p style="font-weight: bold; text-align: center; color: #4f46e5; margin-top: 20px;">We look forward to seeing you there!</p>
      </div>
    `;

    const info = await mailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Event Registration Portal" <noreply@eventportal.com>',
      to: email,
      subject: `Reminder: ${event.title} is coming up!`,
      html: htmlContent,
    });

    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Reminder email sent successfully. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`Reminder email sent to ${email}`);
    }
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendReminderEmail,
};
