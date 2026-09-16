import { useRef, useState } from "react"

// Custom hook
export function useStopwatch() {
    const [elapsedTime, setElapsedTime] = useState(0)
    const intervalRef = useRef<number | null>(null)

    function start() {
        if (intervalRef.current !== null) return

        const startTime = Date.now() - elapsedTime
        intervalRef.current = window.setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 100)
    }

    function stop() {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    function reset() {
        stop()
        setElapsedTime(0);
    }

    return { elapsedTime, start, stop, reset }
}