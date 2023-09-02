import React, { useState } from "react";
import { Form, redirect, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { apiPost, requestError } from "../utils/api";
import SendIcon from "../images/send-icon.svg";
import CloseIcon from "../images/close-icon.svg";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import showServerError from "../utils/showServerError";

export async function action({ request }) {
    //get data from request object
    const formData = await request.formData();
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
        //post email
        await apiPost("http://localhost:5000/email/send", {email, subject, message});
        const MySwall = withReactContent(Swal);
        MySwall.fire({
            position: 'center',
            icon: 'success',
            title: 'Your email was successfully sended.',
            showConfirmButton: false,
            timer: 3000
        })
        return redirect("/");
    } catch(err) {
        //send error if response was not ok througth request error
        if (err instanceof requestError) {
            return err.response.text()
        }
        else {
            return err.message;
        }
    }
    
}

export default function EmailForm() {
    
    //get error data from form if was some error
    const errorMessage = useActionData();
    //navigation hook
    const navigation = useNavigation();
    //navigate hook
    const navigate = useNavigate();

    const [close, setClose] = useState(false);

    //function to navigato to home page
    function backToHomePage() {
        setClose(true);
        setTimeout(() => {
            navigate("/");
        }, 300);
    }

    //output
    return (
        <div className="email-form--container">
            <Form method="post" replace className={close ? "email-form--hide" : "email-form--show"}>
                <img className="email-form--close-icon" src={CloseIcon} onClick={() => backToHomePage()}></img>
                <h5 className="email-form--heading">Sorry, but no admin is  online. Send you email and we are going to answer to you later.</h5>
                <input type="email" placeholder="Email" name="email" className="email-form--input" required/>
                <input type="text" placeholder="Subject" name="subject" className="email-form--input" required/>
                <textarea placeholder="Napiš prosím zprávu..." name="message" className="email-form--textarea" required></textarea>
                <button className="email-form--button" onClick={errorMessage && showServerError(errorMessage)} disabled={navigation.state === "submitting"}>{navigation.state === "submitting" ? "Sending..." : "Send"}<img src={SendIcon} className="email-form--send-icon"></img></button>
            </Form>
        </div>
    )
}