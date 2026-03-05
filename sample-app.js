require("dotenv").config();

const express = require("express");
const { Resend } = require("resend");
const { renderWelcomeEmail } = require("./emails/welcome");

const app = express();
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (name, email) => {
  const html = await renderWelcomeEmail(name);
  const { data, error } = await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Welcome to Forge — your workspace is ready",
    html,
  });
  if (error) throw error;
  return data;
};

app.post("/register", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });
  try {
    const data = await sendWelcomeEmail(name, email);
    console.log(`[REGISTER] Welcome email sent to ${email} | ID: ${data.id}`);
    res.status(201).json({ message: `Welcome to Forge, ${name}! Check your inbox.`, emailId: data.id });
  } catch (error) {
    console.error("[REGISTER] Failed:", error);
    res.status(500).json({ error: "Failed to send welcome email" });
  }
});

app.post("/register/bounce", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  try {
    const data = await sendWelcomeEmail(name, "bounced@resend.dev");
    console.log(`[BOUNCE TEST] ID: ${data.id}`);
    res.status(201).json({ message: "Bounce test triggered.", emailId: data.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger bounce test" });
  }
});

app.post("/register/spam", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  try {
    const data = await sendWelcomeEmail(name, "complained@resend.dev");
    console.log(`[SPAM TEST] ID: ${data.id}`);
    res.status(201).json({ message: "Spam complaint test triggered.", emailId: data.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger spam test" });
  }
});

const PORT = process.env.SAMPLE_APP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Forge sample app running on port ${PORT}`);
  console.log(`
  POST /register         → Send welcome email (real delivery)
  POST /register/bounce  → Trigger bounce scenario
  POST /register/spam    → Trigger spam complaint scenario
  `);
});
