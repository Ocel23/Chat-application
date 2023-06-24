import React from "react";
import { Form, redirect, useActionData } from "react-router-dom";
import { apiPost, requestError } from "../utils/api";

export async function action({ request }) {
    //get data from request object
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        //post login, if not login then redirect to dashboard
        const data = await apiPost("http://localhost:5000/user/login", {email, password})
        return redirect("/dashboard");
    } catch(err) {
        //if erro was in request from server, then get error message text
        if (err instanceof requestError) {
            return err.response.text();
        }
        return err.message;
    }
}
export default function LoginPage() {
    //get error data from form if was some error
    const errorMessage = useActionData();

    //output
    return (
        <div>
            <Form method="post" replace>
                <label>Zadej email:</label>
                <input type="email" name="email" />
                <label>Zadej heslo:</label>
                <input type="password" name="password" />
                <button>Přihlásit</button>
                {errorMessage && <span>{errorMessage}</span>}
            </Form>
        </div>
    )
}