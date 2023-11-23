import { nanoid } from "nanoid";
import React, {useEffect, useState} from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import BotQuestion from "./BotQuestion";
import BotIcon from "../../images/icon.png";
import Loader from "./Loader";
import LoaderOnSubmit from "../PageLoader";
import { config } from "../../config";

export default function Questions({messages, loadingAnswer, handleMessages, messagesLenght}) {

    //state for check is selected option
    const [isSelectOption, setIsSelectOption] = useState(false);
    //function for loading questions
    const [loadingQuestionsState, setLoadingQuestionsState] = useState(true);

    const navigate = useNavigate();

    const navigation = useNavigation();

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

    function navigateToChatPage() {
        navigate(`chat?room=${nanoid()}`);
    }

    //output
    return (
        <>
            {loadingQuestionsState && <Loader side="left" first={true}/>}
            {!loadingQuestionsState && 
            <div className="bot-questions--container">
                <img src={BotIcon} alt="bot icon" className="bot-icon--question right"></img>
                <div className="bot-question-options--container">
                    {messages.map(((message, index) => 
                        <BotQuestion message={message} handleClick={handleClick} key={index}/>
                    ))}    
                    <button onClick={() => navigateToChatPage()} className="bot--question accent" disabled={navigation.state === "submitting"}>{navigation.state === "submitting" ? config.botPage.contactingSupportText : config.botPage.contactSupportText}</button>  
                </div>
            </div>
            }
        </>
    )
}
