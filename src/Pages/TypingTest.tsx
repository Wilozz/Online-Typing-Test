import { useState } from "react"

export function TypingTest() {
    const targetText = "A quick brown fox jumps over the lazy dog"
    const [typedText, setTypedText] = useState("")

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTypedText(event.target.value)
    }

    return (
        <div>
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

            <input value={typedText} onChange={handleChange} autoFocus style={{ position: "absolute", opacity: 0}}/>
        </div>
    )
}