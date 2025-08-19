# Multilingual Chatbot

This is a simple multilingual chatbot that can translate messages in real-time, speak the bot's responses, and save the chat history.

## Features

-   **Real-time Translation:** The chatbot uses an unofficial Google Translate API to translate messages between different languages.
-   **Text-to-Speech:** The bot's responses can be read out loud using the browser's built-in speech synthesis.
-   **Save Chat History:** The entire conversation can be saved as a `.txt` file.
-   **Email Chat History:** The conversation can be sent to an email address using EmailJS.

## Configuration

To use the email functionality, you need to sign up for a free account at [EmailJS](https://www.emailjs.com/) and get your credentials.

Once you have your credentials, you need to replace the placeholder values in `chatbot/script.js`:

```javascript
// IMPORTANT: You need to replace these with your own EmailJS credentials
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

### How to get your EmailJS credentials:

1.  **Service ID:**
    *   Go to your EmailJS dashboard.
    *   Click on "Email Services" and then "Add New Service".
    *   Choose your email provider (e.g., Gmail) and follow the instructions to connect your account.
    *   Your **Service ID** will be displayed next to the service name.

2.  **Template ID:**
    *   Go to "Email Templates" and click "Create New Template".
    *   Customize the template as you wish. You need to have a variable for `to_email` and `chat_history`.
    *   For example, your template could look like this:
        ```
        To: {{to_email}}

        Here is your chat history:
        {{chat_history}}
        ```
    *   Save the template. The **Template ID** will be available in the template settings.

3.  **Public Key:**
    *   Your **Public Key** is available in your EmailJS account settings, under the "API Keys" section.

Replace the placeholder values in `chatbot/script.js` with your actual credentials, and the email functionality will be ready to use.
