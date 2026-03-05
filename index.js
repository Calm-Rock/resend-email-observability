require("dotenv").config();

const express = require("express");
const { trace, SpanStatusCode, metrics } = require("@opentelemetry/api");

const app = express();
app.use(express.json());

const tracer = trace.getTracer("resend-webhook-receiver");
const meter = metrics.getMeter("resend-webhook-receiver");

const emailEventCounter = meter.createCounter("email.events", {
  description: "Count of Resend email events by type",
});

const extractDomain = (email) => email?.split("@")[1] ?? "unknown";

app.post("/webhook", (req, res) => {
  const event = req.body;
  const eventType = event.type;
  const data = event.data;
  const emailId = data?.email_id;
  const toEmail = data?.to?.[0] ?? "unknown";
  const domain = extractDomain(toEmail);
  const bounceType = data?.bounce?.type ?? null;
  const bounceSubType = data?.bounce?.subType ?? null;

  const span = tracer.startSpan(`resend.${eventType}`);

  const attributes = {
    "email.event_type": eventType,
    "email.id": emailId,
    "email.to": toEmail,
    "email.domain": domain,
    "email.from": data?.from ?? "unknown",
    "email.subject": data?.subject ?? "unknown",
    "email.timestamp": data?.created_at ?? "unknown",
  };

  if (bounceType) attributes["email.bounce_type"] = bounceType;
  if (bounceSubType) attributes["email.bounce_subtype"] = bounceSubType;

  span.setAttributes(attributes);

  const metricAttributes = {
    "email.event_type": eventType,
    "email.domain": domain,
  };
  if (bounceType) metricAttributes["email.bounce_type"] = bounceType;

  emailEventCounter.add(1, metricAttributes);

  console.log(`[WEBHOOK] ${eventType} | email_id: ${emailId} | domain: ${domain}${bounceType ? ` | bounce: ${bounceType}` : ""}`);

  span.setStatus({ code: SpanStatusCode.OK });
  span.end();

  res.status(200).json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});
