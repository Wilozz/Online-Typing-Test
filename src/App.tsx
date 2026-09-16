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
        <p className="">{(elapsedTime/1000).toFixed(1)}s</p>

          {results && (
              <p>WPM: {results.wpm.toFixed(0)}, Accuracy: {results.accuracy.toFixed(0)}%</p>
          )}
      </section>
    </div>
  )
}