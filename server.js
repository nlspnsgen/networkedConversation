const express = require("express");
const cors = require("cors");
const osc = require("node-osc");
const { exec } = require("child_process");
// CHANGE THIS FOR LINUX OR JUST OPEN THE INDEX.HTML BY HAND
require('child_process').exec(`open ./public/index.html`); 
let sayings = [];
let ips = [];
let ms = 1000;
let probability = 50;
const app = express();

app.use(cors());
app.use(express.json());
app.post("/", (req, res) => {
  console.log(req.body);
  ips = req.body.ips;
  ms = req.body.ms;
  sayings = req.body.sayings;
  probability = req.body.probability;
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server is running on port 3000"));

// Now, let's listen for incoming OSC messages
var oscServer = new osc.Server(12345, "0.0.0.0");
oscServer.on("message", function (msg, rinfo) {
  console.log("TUIO message:");
  console.dir(msg);

  // Check if the message is equal to "1"
  if (msg[1] == "1") {
    console.log(probability)
    if (Math.random() * 100 < probability) {
      let saying = sayings[Math.floor(Math.random() * sayings.length)]; // Pick a random saying
      // CHANGE THIS FOR LINUX
      exec(`say ${saying}`, (error, stdout, stderr) => {
         if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });

      // Send Ping to all other IPs
      const activeIps = ips.filter((ip) => ip.adr && ip.state);
      setTimeout(() => {
        activeIps.forEach((ip) => {
          var client = new osc.Client(ip.adr, 12345);
          client.send("/oscAddress", 1, () => {
            client.close();
          });
        });
      }, ms);
    }
  }
});
