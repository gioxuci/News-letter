const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { info } = require("console");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/main.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fName;
  const lastname = req.body.lName;
  const email = req.body.email;

  const inputData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(inputData);

  const url = "https://us10.api.mailchimp.com/3.0/lists/910e5c8539";
  const option = {
    method: "POST",
    auth: "giorgi:6fd7cece6158d4df92e22774aec7efbd-us10",
  };

  const request = https.request(url, option, function (response) {
    response.on("data", function (inputData) {
      var infoData = JSON.parse(inputData);

      if (infoData.error_count === 1) {
        res.render("faliure", {
          errorEjs: infoData.errors[0].error,
        });
      } else {
        res.render("success", {
          emailEjs: infoData.new_members[0].email_address,
        });
      }
    });
  });

  request.write(jsonData);
  request.end();
});
app.listen(1000);
