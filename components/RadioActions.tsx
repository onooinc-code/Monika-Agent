import React from "react";
import "./RadioActions.css";

const RadioActions = () => (
  <div className="radio-input">
    <label className="label">
      <input type="radio" id="play" name="value-radio" value="play" />
      <span className="text">Play</span>
    </label>
    <label className="label">
      <input type="radio" id="stop" name="value-radio" value="stop" />
      <span className="text">Stop</span>
    </label>
    <label className="label">
      <input type="radio" id="reset" name="value-radio" value="reset" />
      <span className="text">Reset</span>
    </label>
  </div>
);

export default RadioActions;
