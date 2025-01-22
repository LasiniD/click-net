import { mailtrapClient,sender } from "../lib/mailtrap.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Clicknet",
            html: createWelcomeEmailTemplate(name,profileUrl),
            category: "welcome"
        });
        console.log("Welcome Email sent successfully",response);
    } catch (error) {
        console.error("Error sending welcome email",error);
        throw error;
    }
};