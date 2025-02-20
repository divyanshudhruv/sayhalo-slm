import { Resend } from "resend";

export async function POST(req) {
  try {
    const { email } = await req.json(); // Get user input from request body

    if (!email || !email.trim()) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    await resend.emails.send({
      from: "SayHalo <sayhalo-earlyaccess@resend.dev>",
      to: process.env.NEXT_PUBLIC_PERSONAL_EMAIL,
      subject: "Early Access Request",
      html: `<p>User: <b>${email}</b> has requested early access.</p>`,
    });

    return Response.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
