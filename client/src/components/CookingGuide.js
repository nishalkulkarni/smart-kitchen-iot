import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import MealList from "./MealList";
import { projectFirestore } from "../firebase/config";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


export default function CookingGuide(props) {
  const [secondsTime, setSeconds] = useState(90);
  const [startCountdown, setStartCountdown] = useState(false);
  const [mealData, setMealData] = useState(null);
  const [calories, setCalories] = useState(2000);

  function getMealData() {
    fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=${process.env.REACT_APP_SPOON_API_KEY}&timeFrame=day&targetCalories=${calories}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMealData(data);
      })
      .catch(() => {
        console.log("error");
      });
  }

  function handleChange(e) {
    setCalories(e.target.value);
  }

  const formatRemainingTime = time => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds}`;
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer"><h2>Countdown over...</h2></div>;
    }

    return (
      <div className="timer">
        <div className="text"><b>Remaining time</b></div>
        <div className="value"><h1>{formatRemainingTime(remainingTime)}</h1></div>
      </div>
    );
  };

  const startTimer = () => {
    setStartCountdown(true);
  };

  const stopTimer = () => {
    setStartCountdown(false);
  };

  const increaseTimer = () => {
    let s = secondsTime + 10;
    console.log(s);
    setSeconds(s);
  };

  const decreaseTimer = () => {
    let s = secondsTime - 10;
    if (s < 0) {
      s = 0;
    }

    console.log(s);
    setSeconds(s);
  };

  return (
    <Grid item xs={12}>
      <div>
        <h2 className="sbi-header">Countdown Timer</h2>
        <div className="timer-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <CountdownCircleTimer
            isPlaying={startCountdown}
            duration={secondsTime}
            key={secondsTime}
            colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
            onComplete={() => [true, 1000]}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
        <br />
        <br />
        <div>
          <button className="button-info" onClick={increaseTimer}>
            ➕
          </button>
          <button className="button-info" onClick={decreaseTimer}>
            ➖
          </button>
          <button className="button-danger" onClick={startTimer}>
            Start
          </button>
          <button className="button-default" onClick={stopTimer}>
            Pause
          </button>
        </div>

      </div>
      <br />
      <hr />
      <h2 className="sbi-header">Daily Meal-Planner</h2>
      <div className="MealApp">
        <section className="controls">
          <input
            type="number"
            className="inputBox"
            placeholder="Calories (e.g. 2000)"
            onChange={handleChange}
          />
          <button className="button-green" onClick={getMealData}>Get Daily Meal Plan</button>
        </section>
        {mealData && <MealList mealData={mealData} />}
      </div>
    </Grid>
  );
}
