import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends a confirmation email to a registered team.
 * @param {Object} team - Team object containing details like teamLeaderName, email, teamId
 */
export const sendConfirmationEmail = async (team) => {
    console.log("Called");
  try {
    const msg = {
      to: team.email, // Team leader's email       // recipient
      from: {
        email: 'akulasahith268@gmail.com', // Verified sender in SendGrid
        name: 'Omnitrix Hackathon',           // Display name
      },
      subject: 'Team Registration Confirmation',
      html: `
      <h2>Hey ${team.teamLeaderName},</h2>

<p>Your team <strong>${team.teamName}</strong> has unlocked access to the <em>Omnitrix</em> 🔥</p>

<p><strong>Team ID:</strong> ${team.teamId}</p>
<p><strong>Team Size:</strong> ${team.teamSize}</p>
<p><strong>College:</strong> ${team.college}</p>

<p>Get ready to transform your ideas into reality 💡⚡.  
Problem statements will be revealed soon — and your coding superpowers will be put to the test!</p>

<br/>
<p>— Team Omnitrix 🚀</p>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Confirmation email sent to ${team.email}`);
  } catch (err) {
    console.error('❌ Error sending confirmation email:', err);
  }
};
