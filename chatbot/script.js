document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const languageSelect = document.getElementById('language-select');
    const ttsBtn = document.getElementById('tts-btn');
    const emailBtn = document.getElementById('email-btn');
    const saveBtn = document.getElementById('save-btn');

    let selectedLanguage = 'en';
    let ttsEnabled = false;

    // API Key placeholders
    // IMPORTANT: You need to replace these with your own EmailJS credentials
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    emailjs.init(EMAILJS_PUBLIC_KEY);

    languageSelect.addEventListener('change', (e) => {
        selectedLanguage = e.target.value;
    });

    ttsBtn.addEventListener('click', () => {
        ttsEnabled = !ttsEnabled;
        ttsBtn.classList.toggle('active');
    });

    emailBtn.addEventListener('click', () => {
        const userEmail = prompt('Please enter your email address:');
        if (userEmail) {
            sendEmail(userEmail);
        }
    });

    saveBtn.addEventListener('click', () => {
        const chatHistory = getChatHistory();
        if (chatHistory) {
            downloadChatHistory(chatHistory);
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        displayMessage(messageText, 'user');
        userInput.value = '';

        // Translate user message to English for the bot
        const translatedToEnglish = await translate(messageText, selectedLanguage, 'en');

        const botResponse = getBotResponse(translatedToEnglish);
        // Translate bot response back to user's language
        const translatedBotResponse = await translate(botResponse, 'en', selectedLanguage);
        displayMessage(translatedBotResponse, 'bot');
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        if (sender === 'bot' && ttsEnabled) {
            speak(message);
        }
    }

    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes('help')) {
            return 'I can help you with translations, text-to-speech, and saving your conversations. Just ask!';
        }

        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            return 'Hello there! How can I assist you today?';
        }

        const responses = [
            'Interesting...',
            'Can you tell me more?',
            'I see.',
            'How can I help you further?',
            'I am a simple bot, but I am learning!'
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage;
        speechSynthesis.speak(utterance);
    }

    function getChatHistory() {
        let history = '';
        const messages = chatWindow.querySelectorAll('.message');
        messages.forEach(message => {
            const sender = message.classList.contains('user-message') ? 'User' : 'Bot';
            history += `${sender}: ${message.textContent}\n`;
        });
        return history;
    }

    function downloadChatHistory(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-history.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function sendEmail(to_email) {
        const templateParams = {
            to_email: to_email,
            chat_history: getChatHistory()
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function(response) {
               alert('Email sent successfully!');
            }, function(error) {
               alert('Failed to send email. Please try again later.');
               console.error('EmailJS error:', error);
            });
    }

    // Real translation function using an unofficial Google Translate API
    async function translate(text, sourceLang, targetLang) {
        if (sourceLang === targetLang) {
            return text;
        }
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();

            if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
                 return data[0].map(sentence => sentence[0]).join('');
            } else {
                console.error("Unexpected response format from translation API:", data);
                return text; // return original text as fallback
            }
        } catch (error) {
            console.error("Translation failed:", error);
            return text; // return original text as fallback
        }
    }
});
