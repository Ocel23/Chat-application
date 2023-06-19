import React from "react";
import { Form, redirect } from "react-router-dom";
import { apiPost } from "../utils/api";

export async function action({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
        const data = await apiPost("http://localhost:5000/email/send", {email, subject, message})
        return redirect("/");
    } catch(err) {
        throw err;
    }
    
}

export default function EmailForm() {
    return (
        <div>
            <Form method="post" replace>
                <input type="email" placeholder="Zadej prosím svůj email..." name="email" />
                <input type="text" placeholder="Zadej prosím předmět..." name="subject" />
                <textarea placeholder="Napiš prosím zprávu..." name="message"></textarea>
                <button>Odeslat</button>
            </Form>
        </div>
    )
}