import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';

const App = () => {
  ////////Define "hard" values here
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timeLeft, seTtimeLeft] = React.useState(1500);
  const [timingType, setTimingtype] = React.useState("SESSION");

  ////////Should define timer stop/go. Always initializes to false
  const [play, setPlay] = React.useState(false);

  ////////Ticks down every 1000ms
  const timeout = setTimeout(() => {
    if (timeLeft && play) {
      seTtimeLeft(timeLeft - 1);
    }
  }, 1000);

  /////////Button functions
  const handleBreakIncrease = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleBreakDecrease = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleSessionIncrease = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      seTtimeLeft(timeLeft + 60);
    }
  };

  const handleSessionDecrease = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      seTtimeLeft(timeLeft - 60);
    }
  };

  const handleReset = () => {
    clearTimeout(timeout);
    setPlay(false);
    seTtimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setTimingtype("SESSION");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  const handlePlay = () => {
    clearTimeout(timeout);
    setPlay(!play);
  };

  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if (!timeLeft && timingType === "SESSION") {
      seTtimeLeft(breakLength * 60);
      setTimingtype("BREAK");
      audio.play();
    }
    if (!timeLeft && timingType === "BREAK") {
      seTtimeLeft(sessionLength * 60);
      setTimingtype("SESSION");
      audio.pause();
      audio.currentTime = 0;
    }
  };

  //////////Clock "listener" functions
  const clock = () => {
    if (play) {
      timeout;
      resetTimer();
    } else {
      clearTimeout(timeout);
    }
  };

  ///////////Actual "listeners"
  React.useEffect(() => {
    clock();
  }, [play, timeLeft, timeout]);

  ////////////Defining how the time values will be rendered
  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const title = timingType === "SESSION" ? "Session" : "Break";

  return /*#__PURE__*/(
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("div", { className: "wrapper" }, /*#__PURE__*/
    React.createElement("h1", null, "ZenTime"), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", { id: "break-label" }, "Break Length"), /*#__PURE__*/
    React.createElement("div", { className: "break-session-length" }, /*#__PURE__*/
    React.createElement("button", { id: "break-increment", disabled: play, onClick: handleBreakIncrease }, "Increment"), /*#__PURE__*/
    React.createElement("strong", { id: "break-length" }, breakLength), /*#__PURE__*/
    React.createElement("button", { id: "break-decrement", disabled: play, onClick: handleBreakDecrease }, "Decrement"))), /*#__PURE__*/


    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", { id: "session-label" }, "Session Length"), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("button", { id: "session-increment", disabled: play, onClick: handleSessionIncrease }, "Increment"), /*#__PURE__*/
    React.createElement("strong", { id: "session-length" }, sessionLength), /*#__PURE__*/
    React.createElement("button", { id: "session-decrement", disabled: play, onClick: handleSessionDecrease }, "Decrement")))), /*#__PURE__*/



    React.createElement("div", { className: "timer-wrapper" }, /*#__PURE__*/
    React.createElement("div", { className: "timer" }, /*#__PURE__*/
    React.createElement("h2", { id: "timer-label" }, title), /*#__PURE__*/
    React.createElement("h3", { id: "time-left" }, timeFormatter())), /*#__PURE__*/

    React.createElement("button", { id: "start_stop", onClick: handlePlay }, "START/STOP"), /*#__PURE__*/
    React.createElement("button", { id: "reset", onClick: handleReset }, "RESET"))), /*#__PURE__*/


    React.createElement("audio", {
      id: "beep",
      preload: "auto",
      src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" })));



};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#App"));