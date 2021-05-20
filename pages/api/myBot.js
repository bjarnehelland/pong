import { WebClient } from "@slack/web-api";
import { createHmac } from "crypto";
import tsscmp from "tsscmp";

export default async function handler(req, res) {
  // Validate Signature
  if (!legitSlackRequest(req)) return res.status(401);

  console.log(req.body);

  const { channel, user } = req.body.event;
  const { challenge } = req.body;
  const bot = new WebClient(process.env.SLACK_TOKEN);
  const chatMessage = await bot.chat.postMessage({
    channel,
    text: `Hey <@${user}>! So glad to have you on my Slack!`,
  });
  res.status(200).json({ challenge });
}

function legitSlackRequest(req) {
  // Your signing secret
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

  // Grab the signature and timestamp from the headers
  const requestSignature = req.headers["x-slack-signature"];
  const requestTimestamp = req.headers["x-slack-request-timestamp"];

  // Create the HMAC
  const hmac = createHmac("sha256", slackSigningSecret);

  // Update it with the Slack Request
  const [version, hash] = requestSignature.split("=");
  const base = `${version}:${requestTimestamp}:${JSON.stringify(req.body)}`;
  hmac.update(base);

  // Returns true if it matches
  return tsscmp(hash, hmac.digest("hex"));
}
