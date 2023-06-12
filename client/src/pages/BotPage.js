import React, { useState } from "react";
import {nanoid} from "nanoid";
import BotMessage from "../components/BotMessage";

export default function BotPage() {
    const data = 
        [
            {
                "How are you?": "fine",
                "How old are you?" :"1 week",
                "Where are you from?" : "I from Czech Republic"
            },
            
        ]

    const [messages, setMessages] = useState(fillAnswers());

    function fillAnswers() {
        const array = [];
        data.forEach(item => {
            const propresties = [];
            for (let index in item) {
                propresties.push({
                    id: nanoid(),
                    isActive: false,
                    question: index,
                    answer: item[index]
                });
            }
            array.push(propresties);
        })
        return array;
    }

    function addMessage() {
        setMessages([...messages, ...fillAnswers()])
    }

    return (
        <div className="Bot-page--container">
            <div className="bot-page-message--container">
                {messages.map((message, index) => {
                    return <BotMessage key={index} message={message} addMessage={addMessage} />
                })}
            </div>
        </div>
    )
}