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

    const targetWords = targetText.split(" ")
    const typedWords = typedText.split(" ")

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

        const newTypedWords = newValue.split(" ")
        const currIndex = newTypedWords.length - 1
        const onLastWord = (currIndex === targetWords.length - 1)
        const lastWordLength = targetWords[targetWords.length - 1].length

        if (onLastWord && newTypedWords[currIndex].length >= lastWordLength) {
            stop()

            let correctWords = 0
            for (let i = 0; i < targetWords.length; i++) {
                if (newTypedWords[i] === targetWords[i]) correctWords++
            }
            const accuracy = (correctWords / targetWords.length) * 100
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

            if (typedText === "" || typedText.endsWith(" " )) return

            processTypedText(typedText + " ")
        }
    }

    return (
        <div onClick={focusInput} className="max-w-2xl mx-auto text-center break-words">
            {targetWords.map((word, wordIndex) => {
                const typedWord = typedWords[wordIndex] ?? ""

                return (
                    <span key={wordIndex}>
                        {word.split("").map((char, charIndex) => {
                            const typedChar = typedWord[charIndex]
                            const isTyped = typedChar !== undefined
                            const isCorrect = typedChar === char

                            let color = "black"
                            if (isTyped && isCorrect) {
                                color = "blue"
                            } else if (isTyped && !isCorrect) {
                                color = "red"
                            }

                            return <span key={charIndex} style={{ color }}>{char}</span>
                        })}

                        {typedWord.length > word.length &&
                            typedWord.slice(word.length).split("").map((char, i) => (
                                <span key={`overflow-${i}`} style={{ color: "red", opacity: 0.5 }}>
                                    {char}
                                </span>
                            ))}
                            
                        {" "}
                    </span>
                )
            })}

            <input ref={inputRef} value={typedText} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus style={{ position: "absolute", opacity: 0}}/>
        </div>
    )
}