import { nanoid } from "nanoid";
import React, {useState} from "react";
import { Link } from "react-router-dom";

export default function BotMessage({message, addMessage}) {
    //we pass message object with question and answers
    const [messageState, setMessageState] = useState(message);
    //count of selected answers
    const [countOfActiveAnswers, setCountOfActiveAnswers] = useState(0);

    //function for select question
    function handleClick(id) {
        if (countOfActiveAnswers === 0) {
            setCountOfActiveAnswers(prevCount => prevCount + 1);
            setMessageState(messageState.map(answer => {
                if (answer.id === id) {
                    return {
                        ...answer,
                        isActive: true
                    }
                }
                else {
                    return answer;
                }
            }))    
        }
        
    }

    //output
    return (
        <div>
            <span>Bot</span>
                {messageState.map(message => 
                    <button type="button" onClick={() => handleClick(message.id)} className={message.isActive ? "bot-page-question--active" : "bot-page-question"}>{message.question}</button>
                )}
                <Link to={`chat?room=${nanoid()}`}>Podpora</Link>
                {messageState.map(answer => {
                    return (
                        <div>
                            {answer.isActive ? 
                            <div>
                            <p>{answer.answer}</p>
                                <p>Potřebuješ zkusit jinou možnost?</p>
                                <button type="button" onClick={() => addMessage()}>Ano</button>
                            </div> : null}
                        </div>    
                    ) 
                })}  
        </div>
    )
}

