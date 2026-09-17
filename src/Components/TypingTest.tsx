import { useEffect, useRef, useState } from "react"

type Quote = {
    Quote: string,
    Author: string,
    Tags: string[],
    Popularity: number,
    Category: string
}

type TypingTestProps = {
    start: () => void
    stop: () => void
    reset: () => void
    elapsedTime: number
    onFinish: (results: {wpm: number, accuracy : number} | null) => void
}

export function TypingTest({ start, stop, reset, elapsedTime, onFinish }: TypingTestProps) {
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
        onFinish(null)
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

    function calculateWpm(typed: string, target: string, elapsedTime: number): number {
        const typedWords = typed.split(" ")
        const targetWords = target.split(" ")

        let correctWords = 0
        for (let i = 0; i < targetWords.length; i++) {
            if (typedWords[i] === targetWords[i]) {
                correctWords++
            }
        }

        const minutes = elapsedTime / 1000 / 60
        return correctWords / minutes
    }

    function processTypedText(newValue: string) {
        if (typedText === "" && newValue !== "") {
            start()
        }

        if (newValue.length >= targetText.length) {
            stop()

            let correctChars = 0
            for (let i = 0; i < targetText.length; i++) {
                if (newValue[i] === targetText[i]) correctChars++
            }
            const accuracy = (correctChars / targetText.length) * 100
            const wpm = calculateWpm(newValue, targetText, elapsedTime)

            onFinish({ wpm, accuracy })
        }

        setTypedText(newValue)
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        processTypedText(event.target.value)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === " ") {
            event.preventDefault()

            const nextSpaceIndex = targetText.indexOf(" ", typedText.length)
            const newTypedText =
                nextSpaceIndex === -1
                    ? targetText
                    : typedText.padEnd(nextSpaceIndex + 1, " ")

            processTypedText(newTypedText)
        }
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

            <input ref={inputRef} value={typedText} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus style={{ position: "absolute", opacity: 0}}/>
        </div>
    )
}