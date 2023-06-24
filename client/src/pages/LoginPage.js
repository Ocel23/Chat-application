import React from "react";
import { Form, redirect, useActionData } from "react-router-dom";
import { apiPost, requestError } from "../utils/api";

export async function action({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const data = await apiPost("http://localhost:5000/user/login", {email, password})
        return redirect("/dashboard");
    } catch(err) {
        if (err instanceof requestError) {
            return err.response.text();
        }
        return err.message;
    }
}
export default function LoginPage() {
    const errorMessage = useActionData();

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