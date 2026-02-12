const { WebClient } = require("@slack/web-api");

exports.slackAgent = async (req, res) => {
  const payload = req.body || {};
  const text = payload.text || "(no text)";
  const responseUrl = payload.response_url;

  // Slack Slash Commandは3秒以内に返信が必要
  res.status(200).send("OK");

  const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

  try {
    await slack.chat.postMessage({
      channel: "#planner",
      text: `TASK: ${text}\n(ここにplanner出力が入る)`,
    });
  } catch (e) {
    if (responseUrl) {
      await fetch(responseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_type: "ephemeral",
          text: `投稿に失敗しました: ${e.message}`,
        }),
      });
    }
  }
};
