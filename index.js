require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post("/msg", urlencodedParser, (req, res) => {
  axios
    .post(
      "https://messages-sandbox.nexmo.com/v0.1/messages",
      {
        from: { type: "messenger", id: process.env.BOT_ID },
        to: { type: "messenger", id: process.env.RECIPIENT_ID },
        message: {
          content: {
            type: "text",
            text: req.body.Body,
          },
        },
      },
      {
        auth: {
          username: process.env.VONAGE_ID,
          password: process.env.VONAGE_SECRET,
        },
      }
    )
    .then(function (response) {
      console.log("Status: " + response.status);
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});
app.post("/reverse", bodyParser.json(), (req, res) => {
  const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
  );
  client.messages
    .create({
      body: req.body.message.content.text,
      from: "Your twilio phone number here",
      to: "Your phone number here",
    })
    .then((message) => console.log(message.sid));
  res.status(200).send();
});
app.listen(5000);
