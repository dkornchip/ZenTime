import React from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

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
    if(timeLeft && play){
      seTtimeLeft(timeLeft - 1)
    }
  }, 1000);
  
  /////////Button functions
  const handleBreakIncrease = () => {
    if(breakLength < 60){
      setBreakLength(breakLength + 1)
    }
  }
  
  const handleBreakDecrease = () => {
    if(breakLength > 1){
      setBreakLength(breakLength - 1)
    }
  }
  
  const handleSessionIncrease = () => {
    if(sessionLength < 60){
      setSessionLength(sessionLength + 1)
      seTtimeLeft(timeLeft + 60)
    }
  }
  
  const handleSessionDecrease = () => {
    if(sessionLength > 1){
      setSessionLength(sessionLength - 1)
      seTtimeLeft(timeLeft - 60)
    }
  }
  
  const handleReset = () => {
    clearTimeout(timeout);
    setPlay(false);
    seTtimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setTimingtype("SESSION");
    const audio = document.getElementById("beep");
    audio.pause()
    audio.currentTime = 0;
  }
  
  const handlePlay = () => {
    clearTimeout(timeout);
    setPlay(!play);
  }
  
  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if(!timeLeft && timingType === "SESSION"){
      seTtimeLeft(breakLength * 60)
      setTimingtype("BREAK")
      audio.play()
    }
    if(!timeLeft && timingType === "BREAK"){
      seTtimeLeft(sessionLength * 60)
      setTimingtype("SESSION")
      audio.pause()
      audio.currentTime = 0;
    }
  }
  
  //////////Clock "listener" functions
  const clock = () => {
    if(play){
      timeout
      resetTimer()
    }else {
      clearTimeout(timeout)
    }
  }
  
  ///////////Actual "listeners"
  React.useEffect(() => {
    clock()
  }, [play, timeLeft, timeout])
  
  ////////////Defining how the time values will be rendered
  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
  const title = timingType === "SESSION" ? "Session" : "Break";
  
  return(
  <div>
  <div className="wrapper">
  <h1>ZenTime</h1>
    <div>
      <div>
        <h3 id="break-label">Break Length</h3>
        <div className="break-session-length">
          <button id="break-increment" disabled={play} onClick={handleBreakIncrease}>Increment</button>
           <strong id="break-length">{breakLength}</strong>
          <button id="break-decrement" disabled={play} onClick={handleBreakDecrease}>Decrement</button>
        </div>
      </div>
      <div>
        <h3 id="session-label">Session Length</h3>
        <div>
          <button id="session-increment" disabled={play} onClick={handleSessionIncrease}>Increment</button>
           <strong id="session-length">{sessionLength}</strong>
          <button id="session-decrement" disabled={play} onClick={handleSessionDecrease}>Decrement</button>
        </div>
      </div>
    </div>
    <div className="timer-wrapper">
      <div className="timer">
        <h2 id="timer-label">{title}</h2>
        <h3 id="time-left">{timeFormatter()}</h3>
      </div>
        <button id="start_stop" onClick={handlePlay}>START/STOP</button>
        <button id="reset" onClick={handleReset}>RESET</button>
    </div>
  </div>
      <audio
      id="beep" 
      preload="auto"
      src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    />
  </div>
  )
}

ReactDOM.render(<App />,document.querySelector("#App"))