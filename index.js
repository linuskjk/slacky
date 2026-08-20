require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/slacky-ping", async ({ ack, respond }) => {
  const start = Date.now();

  await ack();

  const latency = Date.now() - start;

  await respond({
    response_type: "in_channel",
    text: `*Pong!*\nLatency: \`${latency}ms\``,
  });
});

app.command("/slacky-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text: "*Slacky Command Center*",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Slacky Command Center",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Hey! I'm *Slacky*\n\n" +
            "Here are the things I can do:",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "\n*/slacky-ping*\nCheck my latency.",
          },
          {
            type: "mrkdwn",
            text: "\n*/slacky-joke*\nGet a random joke.",
          },
          {
            type: "mrkdwn",
            text: "\n*/slacky-catfact*\nGet a random cat fact.",
          },
          {
            type: "mrkdwn",
            text: "\n*/slacky-challenge*\nGet a coding challenge.",
          },
          {
            type: "mrkdwn",
            text: "\n*/slacky-help*\nShow this menu.",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Try one of the commands below:*",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Ping",
            },
            action_id: "ping_button",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Joke",
            },
            action_id: "joke_button",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Cat Fact",
            },
            action_id: "catfact_button",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Challenge",
            },
            action_id: "challenge_button",
          },
        ],
      },
    ],
  });
});

app.command("/slacky-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");

    await respond({
      response_type: "in_channel",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Cat Fact",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `>${response.data.fact}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Fetched from catfact.ninja",
            },
          ],
        },
      ],
    });
  } catch (err) {
    await respond({
      text: "Failed to fetch a cat fact.",
    });
  }
});

app.command("/slacky-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );

    await respond({
      response_type: "in_channel",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Slacky Joke Generator",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${response.data.setup}*\n\n${response.data.punchline}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Fetched from the Official Joke API",
            },
          ],
        },
      ],
    });
  } catch (err) {
    await respond({
      text: "Failed to fetch a joke.",
    });
  }
});

const challenges = [
  "Write a function that reverses a string without using `.reverse()`.",
  "Build a calculator that supports +, -, × and ÷.",
  "Create a number guessing game from 1–100.",
  "Write a function that checks whether a word is a palindrome.",
  "Build a small to-do list using JavaScript.",
  "Create a countdown timer that reaches zero.",
];

app.command("/slacky-challenge", async ({ ack, respond }) => {
  await ack();

  const challenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  await respond({
    response_type: "in_channel",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Coding Challenge",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Your mission:*\n\n> ${challenge}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Give me another!",
            },
            action_id: "new_challenge_button",
          },
        ],
      },
    ],
  });
});

app.action("ping_button", async ({ ack, respond }) => {
  await ack();

  const start = Date.now();

  await respond({
    response_type: "ephemeral",
    replace_original: false,
    text: `Pong! ${Date.now() - start}ms`,
  });
});

app.action("joke_button", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );

    await respond({
      response_type: "ephemeral",
      replace_original: false,
      text: `${response.data.setup}\n\n${response.data.punchline}`,
    });
  } catch (err) {
    await respond({
      response_type: "ephemeral",
      replace_original: false,
      text: "Failed to fetch a joke.",
    });
  }
});

app.action("catfact_button", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");

    await respond({
      response_type: "ephemeral",
      replace_original: false,
      text: `*Cat fact!*

>${response.data.fact}`,
    });
  } catch (err) {
    await respond({
      response_type: "ephemeral",
      replace_original: false,
      text: "Failed to fetch a cat fact.",
    });
  }
});

app.action("challenge_button", async ({ ack, respond }) => {
  await ack();

  const challenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  await respond({
    response_type: "ephemeral",
    replace_original: false,
    text: `*New challenge!*\n\n${challenge}`,
  });
});

app.action("new_challenge_button", async ({ ack, respond }) => {
  await ack();

  const challenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  await respond({
    response_type: "in_channel",
    replace_original: true,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "New Coding Challenge!",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> ${challenge}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Another one!",
            },
            action_id: "new_challenge_button",
          },
        ],
      },
    ],
  });
});

(async () => {
  try {
    await app.start();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Slacky is online!");
    console.log("Socket Mode connected!");
    console.log("Commands ready!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("Failed to start Slacky:", error);
    process.exit(1);
  }
})();