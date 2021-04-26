var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  var data = req.body;

  console.log(req.params);
  console.log(req.body);
  console.log(req.query);
  res.send(`live POST received successfully: ${data}`);
});

module.exports = router;
