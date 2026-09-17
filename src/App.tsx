import { useState } from "react";
import { TypingTest } from "./Components/TypingTest";
import { useStopwatch } from "./Hooks/Timer";

export default function App() {
  const { elapsedTime, start, stop, reset } = useStopwatch()
  const [results, setResults] = useState<{ wpm: Number, accuracy: Number } | null>(null)

  return (
    <div>
      <section className="flex items-center justify-center -mt-20 min-h-screen px-30">
        <TypingTest 
          start={start}
          stop={stop} 
          reset={reset} 
          elapsedTime={elapsedTime}
          onFinish={setResults} 
        />
      </section>

      <section>
        <p className="flex relative justify-center items-center -mt-100 text-9xl opacity-20">{(elapsedTime/1000).toFixed(1)}s</p>
          {results && (
              <p className="flex relative justify-center mt-10">WPM: {results.wpm.toFixed(0)}, Accuracy: {results.accuracy.toFixed(0)}%</p>
          )}
      </section>
    </div>
  )
}