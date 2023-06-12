import React, { useState } from "react";
import {nanoid} from "nanoid";
import BotMessage from "./BotMessage";

export default function Main() {

    const data = 
        [
            {
                "How are you?": "fine",
                "How old are you?" :"1 week",
                "Where are you from?" : "I from Czech Republic"
            },
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
                    answer: data[index]
                });
            }
            array.push(propresties);
        })
        return array;
    }

    return (
        <div className="bot-page-message--container">
        {messages.map((message, index) => {
            <BotMessage key={index} message={message}/>
        })}
        </div>
    )
}
