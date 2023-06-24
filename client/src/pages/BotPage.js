import React, { useEffect, useState } from "react";
import {nanoid} from "nanoid";
import BotMessage from "../components/BotMessage";

export default function BotPage() {
    //create data
    const data = 
        [
            {
                "How are you?": "fine",
                "How old are you?" :"1 week",
                "Where are you from?" : "I from Czech Republic"
            },
            
        ]

    //create messages with properties
    const [messages, setMessages] = useState(createAnswers());

    //function for create messages
    function createAnswers() {
        const array = [];
        data.forEach(item => {
            const propersties = [];
            for (let property in item) {
                propersties.push({
                    id: nanoid(),
                    isActive: false,
                    question: property,
                    answer: item[property]
                });
            }
            array.push(propersties);
        })
        return array;
    }

    //function for create another message
    function addMessage() {
        setMessages([...messages, ...createAnswers()])
    }

    //create count in session storage for chat page
    useEffect(() => {
        sessionStorage.setItem("count", "0");
    }, [])

    //output
    return (
        <div className="Bot-page--container">
            <div className="bot-page-message--container">
                {messages.map((message, index) => {
                    return <BotMessage key={message.id} message={message} addMessage={addMessage} />
                })}
            </div>
        </div>
    )
}