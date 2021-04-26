var pool = require("../config/database");
var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  var { temperature, humidity, heatindex } = req.body;
  // {
  //   "temperature": 24.9,
  //   "humidity": 56.2,
  //   "heatindex": 12.5
  // }
  var dataValid =
    typeof heatindex == "number" &&
    typeof temperature == "number" &&
    typeof humidity == "number";

  if (dataValid) {
    // DO NOT insert user generated values into the string directly
    var insertSQL = `INSERT INTO measurements (temperature, humidity, heatindex) VALUES ($1, $2, $3);`;
    var values = [temperature, humidity, heatindex];

    pool.query(insertSQL, values, (error, result) => {
      if (error) {
        console.log("riyas",error)
        res.status(400).send(error);
      } else {
        res.status(200).send("Saved to database.\n");
      }
    });
  } else {
    res.status(400).send("Please check that your data types are correct");
  }
});

router.get("/", function (req, res, next) {
  // Get most recent measurement from db and return as JSON.
  pool.query(
    "SELECT * FROM measurements ORDER BY created DESC LIMIT 1;",
    (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    }
  );
});

module.exports = router;
