const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 3253;
const PiCamera = require("pi-camera");

app.get("/", (req, res) => {
  // var dataToSend;
  // // spawn new child process to call the python script
  // const python = spawn("python", ["fb-photo.py"]);
  // // collect data from script
  // python.stdout.on("data", function (data) {
  //   console.log("Pipe data from python script ...");
  //   dataToSend = data.toString();
  // });
  // // in close event we are sure that stream from child process is closed
  // python.on("close", (code) => {
  //   console.log(`child process close all stdio with code ${code}`);
  //   // send data to browser
  //   res.send(dataToSend);
  // });

  var dt = new Date().toLocaleString();
  var fname = dt + ".jpg";

  const myCamera = new PiCamera({
    mode: "photo",
    output: `${__dirname}/${fname}`,
    width: 1280,
    height: 720,
    nopreview: true,
  });

  myCamera
    .snap()
    .then((result) => {
      console.log(`<img src="${result}">`);
    })
    .catch((error) => {
      console.log("Error: Cant take photo.");
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
