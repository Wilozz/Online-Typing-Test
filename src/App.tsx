import { useState } from "react";
import { TypingTest } from "./Components/TypingTest";
import { useStopwatch } from "./Hooks/Timer";

export default function App() {
  const { elapsedTime, start, stop, reset } = useStopwatch()
  const [results, setResults] = useState<{ wpm: Number, accuracy: Number } | null>(null)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-30 gap-10">
      <TypingTest 
        start={start}
        stop={stop} 
        reset={reset} 
        elapsedTime={elapsedTime}
        onFinish={setResults} 
      />

      <p className="text-9xl opacity-20">{(elapsedTime/1000).toFixed(1)}s</p>

      {results && (
          <p className="mt-4">WPM: {results.wpm.toFixed(0)}, Accuracy: {results.accuracy.toFixed(0)}%</p>
      )}
    </div>
  )
}