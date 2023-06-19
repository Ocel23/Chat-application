import React from "react";
import { Form, redirect } from "react-router-dom";
import { apiPost } from "../utils/api";

export async function action({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const data = await apiPost("http://localhost:5000/user/login", {email, password})
        return redirect("/dashboard");
    } catch(err) {
        throw err;
    }

}
export default function LoginPage() {
    return (
        <div>
            <Form method="post" replace>
                <label>Zadej email:</label>
                <input type="email" name="email" />
                <label>Zadej heslo:</label>
                <input type="password" name="password" />
                <button>Přihlásit</button>
            </Form>
        </div>
    )
}