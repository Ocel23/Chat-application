export const config = {
    botPage: {
        questionsWithAnswers: [
            {
                "Which languages was used to development this app?": "HTML, CSS, JavaScript",
                "Who is programmer of this app?" : "Ocel23",
            },
            
        ],
        title: "Ocel bot | Team chat app",
        repeatQuestionText: "Have you got any question?",
        repeatQuestionYesText: "Yes",
        repeatQuestionNoText: "No",
        endMessageText: "Thank you that you used our bot. Have a nice day!",
    },
    chatPage: {
        title: "Support",
        description: "Please wait...  Support will attend to you within minutes.",
        inputPlacelholder: "Send message...",
        //hours = %hours%, minutes = %minutes%, month = %month%, day = %day%
        dateFormat: "%day%.%month% in %hours%:%minutes%",
        templateMessages: ["How are you?", "What is your name?"],
    },
    emailPage: {
        title: "Sorry, but no admin is online. Send you email and we are going to answer to you later.",
        emailPlaceholder: "Email",
        subjectPlaceholder: "Subject",
        messagePlaceholder: "Message",
        buttonSendText: "Send",
        buttonSendingText: "Sending...",
    }
}
