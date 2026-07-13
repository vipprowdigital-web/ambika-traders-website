import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ subject, html }) => {
  try {
    await resend.emails.send({
      from: "Brisco <onboarding@resend.dev>", // testing ke liye ye default rahega
      to: process.env.SHOP_EMAIL,
      subject,
      html,
    });
    console.log("Email sent successfully via Resend");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};