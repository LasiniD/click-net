import { mailtrapClient,sender } from "../lib/mailtrap.js"
import { createWelcomeEmailTemplate, createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate } from "./emailTemplates.js"

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

export const sendCommentNotificationEmail = async (
    recepientEmail, 
    recepientName, 
    commenterName, 
    postUrl, 
    commentContent
) => {
    const recipient = [{email: recepientEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${commenterName} commented on your post`,
            html: createCommentNotificationEmailTemplate(recepientName, commenterName, postUrl, commentContent),
            category: "comment_notification"
        });
        console.log("Comment Notification Email sent successfully",response);
    } catch (error) {
        console.error("Error sending comment notification email",error);
        throw error;
    }
};

export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
	const recipient = [{ email: senderEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: `${recipientName} accepted your connection request`,
			html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "connection_accepted",
		});
	} catch (error) {
        console.error("Error sending connection accepted email", error);
        throw error;
    }
};