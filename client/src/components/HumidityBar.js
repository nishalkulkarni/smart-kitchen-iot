import React, { useState } from "react";
import * as HomeConstants from "../constants/HomeConstants";
import ReactCardFlip from "react-card-flip";
import { animate, motion } from "framer-motion";
import ToolTip from "@material-ui/core/Tooltip";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function HumidityBar({ humidity, mainIndex, value }) {
  const [isFlipped, setIsFlipped] = useState(false);
  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  const humidityMaxValue = 100;
  let humidityCircles = [];
  const circlesToolTips = ["High", "Medium", "Low"];
  for (let i = 1; i < 4; i++) {
    humidityCircles.push(
      <ToolTip title={circlesToolTips[i - 1]}>
        <motion.div
          whileHover={{ scale: "1.1" }}
          style={{
            margin: "1rem",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: `rgba(76, 100, 233,${
              humidityMaxValue / (i * 100)
            })`,
          }}
        ></motion.div>
      </ToolTip>
    );
  }

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: -1 }}
          style={{ width: "200px", height: "200px", margin: "auto" }}
        >
          <CircularProgressbar
            value={value}
            text={`Humidity : ${value}`}
            minValue={0}
            maxValue={humidityMaxValue}
            background={true}
            backgroundPadding={5}
            styles={buildStyles({
              textSize: "9px",
              textColor: "white",
              pathColor: "white",
              backgroundColor: `rgba(76, 100, 233,${value / humidityMaxValue})`,
            })}
          />
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {humidityCircles.map((item) => {
            return item;
          })}
        </div>
        <svg
          onClick={handleClick}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z" />
        </svg>
      </div>

      <div className={"info-text"}>
        <p>
          Humidity is the amount of water vapour in the air. The more there
          water vapour, the humidity is higher and the more damp it will feel
          outside.
          <br />
          When humidity is high, the air is so clogged with water vapor that
          there isnt room for much else. If you sweat when its humid, it can be
          hard to cool off because your sweat cant evaporate into the air like
          it needs to
          <br />
          <strong>
            This circular gauge changes color based on the humidity. So the
            higher humidity, the more opaque the blue color is
          </strong>
        </p>
        <svg
          onClick={handleClick}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z" />
        </svg>
      </div>
    </ReactCardFlip>
  );
}
