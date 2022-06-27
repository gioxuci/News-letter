const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { json } = require("body-parser");
const { response } = require("express");

mailchimp.setConfig({
  apiKey: "276b7f6e393b82e2426e0f4424e5d6a3-us10",
  server: "us10",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fName;
  const lastname = req.body.lName;
  const email = req.body.email;

  const run = async () => {
    const response = await mailchimp.lists.addListMember("910e5c8539", {
      email_address: email,
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname,
      },
      status: "subscribed",
    });
  };

  run();
  console.log(res);
  // var jsondata = JSON.stringify(res);
  // console.log(jsondata);
  if (res.statusCode === 200) {
    console.log("im here");
    res.sendFile(__dirname + "/success_page.html");
  } else {
    res.sendFile(__dirname + "/faliure_page.html");
  }
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(1000);
