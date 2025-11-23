import React from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const STORAGE_KEY = 'zentime-preferences'
const DEFAULT_BREAK = 5
const DEFAULT_SESSION = 25

const loadPreferences = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return null
    const { breakLength, sessionLength } = saved
    if (
      typeof breakLength === 'number' &&
      typeof sessionLength === 'number' &&
      breakLength >= 1 &&
      sessionLength >= 1
    ) {
      return {
        breakLength,
        sessionLength,
      }
    }
  } catch (error) {
    console.warn('Unable to load saved preferences', error)
  }
  return null
}

const savePreferences = (breakLength, sessionLength) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ breakLength, sessionLength })
    )
  } catch (error) {
    console.warn('Unable to save preferences', error)
  }
}

const formatTime = (valueInSeconds) => {
  const minutes = Math.floor(valueInSeconds / 60)
  const seconds = valueInSeconds % 60
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
  return `${formattedMinutes}:${formattedSeconds}`
}

const usePersistentDurations = () => {
  const savedPreferences = React.useMemo(loadPreferences, [])
  const [breakLength, setBreakLength] = React.useState(
    savedPreferences?.breakLength ?? DEFAULT_BREAK
  )
  const [sessionLength, setSessionLength] = React.useState(
    savedPreferences?.sessionLength ?? DEFAULT_SESSION
  )

  React.useEffect(() => {
    savePreferences(breakLength, sessionLength)
  }, [breakLength, sessionLength])

  return {
    breakLength,
    setBreakLength,
    sessionLength,
    setSessionLength,
  }
}

const App = () => {
  const {
    breakLength,
    setBreakLength,
    sessionLength,
    setSessionLength,
  } = usePersistentDurations()

  const [timeLeft, setTimeLeft] = React.useState(sessionLength * 60)
  const [timingType, setTimingType] = React.useState('SESSION')
  const [play, setPlay] = React.useState(false)

  const audioRef = React.useRef(null)

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const applyPreset = (sessionMinutes, breakMinutes) => {
    setPlay(false)
    setTimingType('SESSION')
    setSessionLength(sessionMinutes)
    setBreakLength(breakMinutes)
    setTimeLeft(sessionMinutes * 60)
    stopAudio()
  }

  const handleBreakIncrease = () => {
    if (breakLength < 60) {
      const nextLength = breakLength + 1
      setBreakLength(nextLength)
      if (!play && timingType === 'BREAK') {
        setTimeLeft(nextLength * 60)
      }
    }
  }

  const handleBreakDecrease = () => {
    if (breakLength > 1) {
      const nextLength = breakLength - 1
      setBreakLength(nextLength)
      if (!play && timingType === 'BREAK') {
        setTimeLeft(nextLength * 60)
      }
    }
  }

  const handleSessionIncrease = () => {
    if (sessionLength < 60) {
      const nextLength = sessionLength + 1
      setSessionLength(nextLength)
      if (!play && timingType === 'SESSION') {
        setTimeLeft(nextLength * 60)
      }
    }
  }

  const handleSessionDecrease = () => {
    if (sessionLength > 1) {
      const nextLength = sessionLength - 1
      setSessionLength(nextLength)
      if (!play && timingType === 'SESSION') {
        setTimeLeft(nextLength * 60)
      } else if (play && timingType === 'SESSION' && timeLeft > nextLength * 60) {
        setTimeLeft(nextLength * 60)
      }
    }
  }

  const handleReset = () => {
    setPlay(false)
    setBreakLength(DEFAULT_BREAK)
    setSessionLength(DEFAULT_SESSION)
    setTimingType('SESSION')
    setTimeLeft(DEFAULT_SESSION * 60)
    stopAudio()
  }

  const togglePlay = () => {
    setPlay((current) => !current)
  }

  React.useEffect(() => {
    if (!play) return undefined

    if (timeLeft === 0) return undefined

    const timer = setTimeout(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => clearTimeout(timer)
  }, [play, timeLeft])

  React.useEffect(() => {
    if (!play || timeLeft !== 0) return undefined

    const audio = audioRef.current
    audio?.play()

    const transitionTimer = setTimeout(() => {
      const nextIsSession = timingType === 'BREAK'
      const nextDuration = nextIsSession ? sessionLength : breakLength
      setTimingType(nextIsSession ? 'SESSION' : 'BREAK')
      setTimeLeft(nextDuration * 60)
    }, 1000)

    return () => clearTimeout(transitionTimer)
  }, [play, timeLeft, timingType, sessionLength, breakLength])

  const title = timingType === 'SESSION' ? 'Session' : 'Break'

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>ZenTime</h1>
        <p className="tagline" aria-hidden="true">
          A gentle Pomodoro companion
        </p>
      </header>
      <main className="wrapper">
        <section className="length-controls" aria-label="Timer lengths">
          <div className="length-card">
            <h3 id="break-label">Break Length</h3>
            <div className="break-session-length">
              <button
                id="break-increment"
                type="button"
                aria-label="Increase break length"
                disabled={play}
                onClick={handleBreakIncrease}
              >
                + Break
              </button>
              <strong id="break-length" aria-live="polite">
                {breakLength}
              </strong>
              <button
                id="break-decrement"
                type="button"
                aria-label="Decrease break length"
                disabled={play}
                onClick={handleBreakDecrease}
              >
                – Break
              </button>
            </div>
          </div>
          <div className="length-card">
            <h3 id="session-label">Session Length</h3>
            <div className="break-session-length">
              <button
                id="session-increment"
                type="button"
                aria-label="Increase session length"
                disabled={play}
                onClick={handleSessionIncrease}
              >
                + Session
              </button>
              <strong id="session-length" aria-live="polite">
                {sessionLength}
              </strong>
              <button
                id="session-decrement"
                type="button"
                aria-label="Decrease session length"
                disabled={play}
                onClick={handleSessionDecrease}
              >
                – Session
              </button>
            </div>
          </div>
        </section>

        <section className="timer-wrapper" aria-live="polite">
          <div className="timer" role="timer" aria-atomic="true">
            <h2 id="timer-label">{title}</h2>
            <p id="time-left" className="time-display">
              {formatTime(timeLeft)}
            </p>
          </div>
          <div className="timer-actions">
            <button id="start_stop" type="button" onClick={togglePlay}>
              {play ? 'Pause' : 'Start'}
            </button>
            <button id="reset" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </section>

        <section className="presets" aria-label="Timer presets">
          <h3>Presets</h3>
          <div className="preset-grid">
            <button type="button" onClick={() => applyPreset(25, 5)}>
              Focus 25 / 5
            </button>
            <button type="button" onClick={() => applyPreset(50, 10)}>
              Deep Work 50 / 10
            </button>
            <button type="button" onClick={() => applyPreset(15, 3)}>
              Sprint 15 / 3
            </button>
          </div>
        </section>
      </main>
      <audio
        id="beep"
        preload="auto"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#App'))
