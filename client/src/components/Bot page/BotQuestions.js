import { nanoid } from "nanoid";
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import BotQuestion from "./BotQuestion";
import BotIcon from "../../images/icon.png";
import Loader from "./Loader";

export default function Questions({messages, loadingAnswer, handleMessages, messagesLenght}) {

    //state for check is selected option
    const [isSelectOption, setIsSelectOption] = useState(false);
    //function for loading questions
    const [loadingQuestionsState, setLoadingQuestionsState] = useState(true);

    //fucntion for load questions
    function loadingQuestions() {
        setTimeout(() => {
            setLoadingQuestionsState(false);
        }, 3000);
    }

    //loading on load
    useEffect(() => {
        loadingQuestions();
    }, [])

      //function for select question
      function handleClick(id) {
        if (isSelectOption) return;
            loadingAnswer();
            setIsSelectOption(true);
            handleMessages(messages.map(answer => {
                if (answer.id === id) {
                    return {
                        ...answer,
                        isActive: true
                    }
                }
                else {
                    return answer;
                }
            }), messagesLenght)
            
    }

    //output
    return (
        <>
            {loadingQuestionsState && <Loader side="left" first={true}/>}
            {!loadingQuestionsState && 
            <div className="bot-questions--container">
                <img src={BotIcon} alt="bot icon" className="bot-icon--question right"></img>
                <div className="bot-question-options--container">
                    {messages.map((message => 
                        <BotQuestion message={message} handleClick={handleClick}/>
                    ))}    
                    <Link to={`chat?room=${nanoid()}`} className="bot--question accent">Do you want to contact support?</Link>  
                </div>
            </div>
            }
        </>
    )
}
