import React, { useCallback, useEffect } from "react";
import { Form, redirect, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { apiPost, requestError, apiGet, } from "../utils/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import showServerError from "../utils/showServerError";

export async function action({ request }) {
    //get data from request object
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        //post login, if not login then redirect to dashboard
        await apiPost("http://localhost:5000/user/login", {email, password});
        const MySwall = withReactContent(Swal);
        MySwall.fire({
            icon: "success",
            title: "You have successfully logged in.",
            position: 'center',
            showConfirmButton: false,
            timer: 3000
        })
        return redirect("/dashboard");
    } catch(err) {
        //if erro was in request from server, then get error message text
        if (err instanceof requestError) {
            return err.response.text();
        } else {
            throw err.message;
        }
    }
}
export default function LoginPage() {
    //get error data from form if was some error
    const errorMessage = useActionData();
    //navigation hook
    const navigation = useNavigation();
    //navigate hook
    const navigate = useNavigate();
    //maswall library
    const MySwall = withReactContent(Swal);

    useEffect(() => {
        //function for log-in
        async function logIn() {
            try {
                await apiGet("http://localhost:5000/user/login");
                return navigate("/dashboard");
            } catch(err) {
                if (err instanceof requestError && err.response.status === 401) {
                    return;
                } else {
                    return showServerError(await err.message);
                }
            }
        }
        logIn();
    }, [])

    const showError = useCallback(() => {
        if (errorMessage) {
            MySwall.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            });    
        }
    })
        
    //output
    return (
        <div className="log-in--center">
            <div className="log-in--container">
                <h1 className="log-in--heading">Log-in</h1>
                <Form method="post" replace className="log-in--form">
                    <input type="email" name="email" placeholder="email" className="log-in--input"/>
                    <input type="password" name="password" placeholder="password" className="log-in--input"/>
                    <button className="log-in--button" disabled={navigation.state === "submitting"} onClick={showError}>{navigation.state === "submitting" ? "Logging in" : "Log in"}</button>
                </Form>
            </div>    
        </div>
        
    )
}