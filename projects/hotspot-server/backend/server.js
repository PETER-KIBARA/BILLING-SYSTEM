const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// STEP 1: User clicks pay
app.post("/pay", async (req, res) => {
  const { phone, plan } = req.body;

  // get user IP / MAC
  const clientIp = req.connection.remoteAddress;

  // TODO: Get MAC using "arp -a"

  // TODO: Initiate MPesa STK Push here

  res.send("STK Push sent. Check your phone!");
});

// STEP 2: M-Pesa Callback
app.post("/callback", (req, res) => {
  // TODO: Handle Daraja callback
  // If success → allow MAC
  exec(`sudo iptables -I FORWARD -m mac --mac-source  AA:BB:CC:DD:EE -j ACCEPT`);
  res.sendStatus(200);
});

app.listen(80, () => console.log("Hotspot backend running"));
