import { useEffect, useRef, useState } from "react"
import { useStopwatch } from "./Timer"

type Quote = {
    Quote: string,
    Author: string,
    Tags: string[],
    Popularity: number,
    Category: string
}

export function TypingTest() {
    const { elapsedTime, start, stop, reset } = useStopwatch()
    const inputRef = useRef<HTMLInputElement>(null)

    const [typedText, setTypedText] = useState("")
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [targetText, setTargetText] = useState("")

    function focusInput() {
        inputRef.current?.focus()
    }

    useEffect(() => {
        fetch("/quotes.json").then((response) => response.json()).then((data: Quote[]) => {
            setQuotes(data)
            pickRandomQuote(data)
        })
    }, [])

    function pickRandomQuote(quotes: Quote[]) {
        const random = Math.floor(Math.random() * quotes.length)
        const normalised = quotes[random].Quote
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
        setTargetText(normalised)
        setTypedText("")
        reset()
    }

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === "Tab") {
                event.preventDefault()
                pickRandomQuote(quotes)
            }
            inputRef.current?.focus()
        }
        window.addEventListener("keydown", handleKeyPress)

        return () => {
            window.removeEventListener("keydown", handleKeyPress)
        }
    }, [quotes])

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value

        if (typedText === "" && newValue !== "") {
            start()
        }

        if (newValue.length >= targetText.length) {
            stop()
        }

        setTypedText(event.target.value)
    }

    return (
        <div onClick={focusInput}>
            {targetText.split("").map((char, index) => {
                const isTyped = index < typedText.length
                const isCorrect = typedText[index] === char

                let color = "black"
                if (isTyped && isCorrect) {
                    color = "blue"
                } else if (isTyped && !isCorrect) {
                    color = "red"
                }

                return (
                    <span 
                        key={index} 
                        style={{ color: color}}>
                        {char}
                    </span>
                )
            })}

            <input ref={inputRef} value={typedText} onChange={handleChange} autoFocus style={{ position: "absolute", opacity: 0}}/>
            <p>{(elapsedTime / 1000).toFixed(1)}s</p>
        </div>
    )
}