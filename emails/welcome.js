const {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} = require("@react-email/components");
const { createElement } = require("react");
const { render } = require("@react-email/components");

const WelcomeEmail = ({ name }) => {
  return createElement(
    Html,
    null,
    createElement(Head, null),
    createElement(Preview, null, "Welcome to Forge — your developer workspace is ready."),
    createElement(
      Body,
      { style: styles.body },
      createElement(
        Container,
        { style: styles.container },
        createElement(
          Section,
          { style: styles.header },
          createElement(Text, { style: styles.logo }, "⚡ Forge")
        ),
        createElement(
          Section,
          { style: styles.content },
          createElement(Text, { style: styles.heading }, `Welcome to Forge, ${name}!`),
          createElement(Text, { style: styles.paragraph }, "Your developer workspace is ready. Forge helps you build, deploy, and monitor your applications from a single place."),
          createElement(Text, { style: styles.paragraph }, "Here is what you can do next:"),
          createElement(Text, { style: styles.listItem }, "→ Create your first project"),
          createElement(Text, { style: styles.listItem }, "→ Invite your team members"),
          createElement(Text, { style: styles.listItem }, "→ Connect your repository"),
          createElement(Button, { href: "https://forge.dev/dashboard", style: styles.button }, "Open your dashboard")
        ),
        createElement(Hr, { style: styles.divider }),
        createElement(
          Section,
          null,
          createElement(Text, { style: styles.footer }, "You are receiving this email because you signed up for Forge. If you did not create an account, you can safely ignore this email."),
          createElement(Text, { style: styles.footer }, "Forge · 100 Developer Way · San Francisco, CA 94107")
        )
      )
    )
  );
};

const renderWelcomeEmail = (name) => {
  return render(createElement(WelcomeEmail, { name }));
};

const styles = {
  body: { backgroundColor: "#f4f4f5", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  container: { margin: "0 auto", padding: "40px 20px", maxWidth: "560px" },
  header: { backgroundColor: "#18181b", borderRadius: "8px 8px 0 0", padding: "24px 32px" },
  logo: { color: "#ffffff", fontSize: "20px", fontWeight: "700", margin: "0" },
  content: { backgroundColor: "#ffffff", padding: "32px", borderRadius: "0 0 8px 8px" },
  heading: { fontSize: "22px", fontWeight: "700", color: "#18181b", margin: "0 0 16px" },
  paragraph: { fontSize: "15px", color: "#52525b", lineHeight: "1.6", margin: "0 0 16px" },
  listItem: { fontSize: "15px", color: "#52525b", lineHeight: "1.8", margin: "0" },
  button: { backgroundColor: "#18181b", color: "#ffffff", borderRadius: "6px", padding: "12px 24px", fontSize: "15px", fontWeight: "600", textDecoration: "none", display: "inline-block", marginTop: "24px" },
  divider: { borderColor: "#e4e4e7", margin: "32px 0 24px" },
  footer: { fontSize: "12px", color: "#a1a1aa", lineHeight: "1.6", margin: "0 0 8px" },
};

module.exports = { renderWelcomeEmail };
