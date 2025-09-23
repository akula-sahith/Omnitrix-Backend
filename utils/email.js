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
      from: 'akulasahith268@gmail.com', 
      subject: 'Team Registration Confirmation',
      html: `
        <h2>Hi ${team.teamLeaderName},</h2>
        <p>Congratulations! Your team <strong>${team.teamName}</strong> has been successfully registered for the Omnitrix Hackathon.</p>
        <p><strong>Team ID:</strong> ${team.teamId}</p>
        <p>Team Size: ${team.teamSize}</p>
        <p>College: ${team.college}</p>
        <p>We look forward to seeing you at the event 🚀</p>
        <br/>
        <p>— Omnitrix Hackathon Team</p>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Confirmation email sent to ${team.email}`);
  } catch (err) {
    console.error('❌ Error sending confirmation email:', err);
  }
};
