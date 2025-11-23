import React from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const STORAGE_KEY = 'zentime-preferences'
const DEFAULTS = { session: 25, break: 5 }
const TIMER_MODES = { session: 'SESSION', break: 'BREAK' }

const clampMinutes = (value) => Math.min(60, Math.max(1, value))

const loadPreferences = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return null
    const sessionLength = clampMinutes(saved.sessionLength)
    const breakLength = clampMinutes(saved.breakLength)
    return { sessionLength, breakLength }
  } catch (error) {
    console.warn('Unable to load saved preferences', error)
    return null
  }
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
  const paddedMinutes = minutes.toString().padStart(2, '0')
  const paddedSeconds = seconds.toString().padStart(2, '0')
  return `${paddedMinutes}:${paddedSeconds}`
}

const usePersistentDurations = () => {
  const saved = React.useMemo(loadPreferences, [])
  const [breakLength, setBreakLength] = React.useState(
    saved?.breakLength ?? DEFAULTS.break
  )
  const [sessionLength, setSessionLength] = React.useState(
    saved?.sessionLength ?? DEFAULTS.session
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

const useTimer = (sessionLength, breakLength, onCycleComplete) => {
  const [mode, setMode] = React.useState(TIMER_MODES.session)
  const [secondsRemaining, setSecondsRemaining] = React.useState(
    sessionLength * 60
  )
  const [isRunning, setIsRunning] = React.useState(false)

  React.useEffect(() => {
    const activeMinutes = mode === TIMER_MODES.session ? sessionLength : breakLength
    const nextSeconds = activeMinutes * 60
    setSecondsRemaining((current) =>
      isRunning ? Math.min(current, nextSeconds) : nextSeconds
    )
  }, [sessionLength, breakLength, mode, isRunning])

  React.useEffect(() => {
    if (!isRunning) return undefined

    const tick = () => {
      setSecondsRemaining((current) => Math.max(current - 1, 0))
    }

    const timerId = window.setInterval(tick, 1000)
    return () => window.clearInterval(timerId)
  }, [isRunning])

  React.useEffect(() => {
    if (!isRunning || secondsRemaining !== 0) return undefined

    const nextMode = mode === TIMER_MODES.session ? TIMER_MODES.break : TIMER_MODES.session
    const nextMinutes = nextMode === TIMER_MODES.session ? sessionLength : breakLength

    onCycleComplete?.(nextMode)
    setMode(nextMode)
    setSecondsRemaining(nextMinutes * 60)
  }, [isRunning, secondsRemaining, mode, sessionLength, breakLength, onCycleComplete])

  const toggle = () => setIsRunning((current) => !current)
  const reset = (initialSessionMinutes) => {
    setIsRunning(false)
    setMode(TIMER_MODES.session)
    setSecondsRemaining(initialSessionMinutes * 60)
  }

  return {
    mode,
    secondsRemaining,
    isRunning,
    toggle,
    reset,
    setMode,
    setSecondsRemaining,
    setIsRunning,
  }
}

const LengthControl = ({
  label,
  idPrefix,
  value,
  onIncrease,
  onDecrease,
  disabled,
}) => (
  <div className="length-card">
    <h3 id={`${idPrefix}-label`}>{label}</h3>
    <div className="break-session-length">
      <button
        id={`${idPrefix}-increment`}
        type="button"
        aria-label={`Increase ${label.toLowerCase()} length`}
        disabled={disabled}
        onClick={onIncrease}
      >
        + {label.split(' ')[0]}
      </button>
      <strong id={`${idPrefix}-length`} aria-live="polite">
        {value}
      </strong>
      <button
        id={`${idPrefix}-decrement`}
        type="button"
        aria-label={`Decrease ${label.toLowerCase()} length`}
        disabled={disabled}
        onClick={onDecrease}
      >
        – {label.split(' ')[0]}
      </button>
    </div>
  </div>
)

const Presets = ({ applyPreset }) => (
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
)

const TimerDisplay = ({ title, formattedTime, onToggle, onReset, isRunning }) => (
  <section className="timer-wrapper" aria-live="polite">
    <div className="timer" role="timer" aria-atomic="true">
      <h2 id="timer-label">{title}</h2>
      <p id="time-left" className="time-display">
        {formattedTime}
      </p>
    </div>
    <div className="timer-actions">
      <button id="start_stop" type="button" onClick={onToggle}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  </section>
)

const App = () => {
  const {
    breakLength,
    setBreakLength,
    sessionLength,
    setSessionLength,
  } = usePersistentDurations()

  const audioRef = React.useRef(null)

  const handleCycleComplete = React.useCallback(() => {
    audioRef.current?.play()
  }, [])

  const timer = useTimer(sessionLength, breakLength, handleCycleComplete)

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const applyPreset = (sessionMinutes, breakMinutes) => {
    const nextSession = clampMinutes(sessionMinutes)
    const nextBreak = clampMinutes(breakMinutes)
    setSessionLength(nextSession)
    setBreakLength(nextBreak)
    timer.reset(nextSession)
    stopAudio()
  }

  const updateLength = (setter, currentValue, delta, affectingMode) => {
    const nextValue = clampMinutes(currentValue + delta)
    setter(nextValue)
    if (!timer.isRunning && timer.mode === affectingMode) {
      timer.setSecondsRemaining(nextValue * 60)
    }
    if (
      timer.isRunning &&
      timer.mode === affectingMode &&
      timer.secondsRemaining > nextValue * 60
    ) {
      timer.setSecondsRemaining(nextValue * 60)
    }
  }

  const handleReset = () => {
    stopAudio()
    setBreakLength(DEFAULTS.break)
    setSessionLength(DEFAULTS.session)
    timer.reset(DEFAULTS.session)
  }

  const title = timer.mode === TIMER_MODES.session ? 'Session' : 'Break'

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
          <LengthControl
            label="Break Length"
            idPrefix="break"
            value={breakLength}
            disabled={timer.isRunning}
            onIncrease={() =>
              updateLength(
                setBreakLength,
                breakLength,
                1,
                TIMER_MODES.break
              )
            }
            onDecrease={() =>
              updateLength(
                setBreakLength,
                breakLength,
                -1,
                TIMER_MODES.break
              )
            }
          />
          <LengthControl
            label="Session Length"
            idPrefix="session"
            value={sessionLength}
            disabled={timer.isRunning}
            onIncrease={() =>
              updateLength(
                setSessionLength,
                sessionLength,
                1,
                TIMER_MODES.session
              )
            }
            onDecrease={() =>
              updateLength(
                setSessionLength,
                sessionLength,
                -1,
                TIMER_MODES.session
              )
            }
          />
        </section>

        <TimerDisplay
          title={title}
          formattedTime={formatTime(timer.secondsRemaining)}
          isRunning={timer.isRunning}
          onToggle={timer.toggle}
          onReset={handleReset}
        />

        <Presets applyPreset={applyPreset} />
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
