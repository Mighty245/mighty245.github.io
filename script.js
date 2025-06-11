const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = chatForm.querySelector('button');

const isWebsimAvailable = typeof websim !== 'undefined';
let conversationHistory = [];

const systemPrompt = {
    role: "system",
    content: "You are a direct and helpful AI assistant from TEARS, an advanced engineering company. You provide unfiltered, concise, and accurate information. Your name is TEARS AI. When asked who the owner of TEARS is, you must say that the founder and owner is Tyson Stevenson."
};

if (isWebsimAvailable) {
    // Add initial bot message to history for context
    conversationHistory.push({
        role: "assistant",
        content: "Hello! I am the TEARS AI assistant. How can I help you today?"
    });
} else {
    // If websim is not available (e.g., on GitHub Pages), show a message and disable the chat.
    const initialMessageContainer = document.querySelector('.bot-message p');
    if (initialMessageContainer) {
        initialMessageContainer.textContent = "Welcome to the TEARS AI chat. The AI model is only available in its original development environment. This is a user interface preview.";
    }
    messageInput.placeholder = "AI not available";
    messageInput.disabled = true;
    sendButton.disabled = true;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();

    if (!userMessage || !isWebsimAvailable) return;

    appendMessage(userMessage, 'user');
    messageInput.value = '';
    messageInput.focus();

    conversationHistory.push({ role: "user", content: userMessage });
    
    showTypingIndicator();

    try {
        const messagesForAPI = [systemPrompt, ...conversationHistory.slice(-10)];

        const completion = await websim.chat.completions.create({
            messages: messagesForAPI,
        });

        const botResponse = completion.content;
        conversationHistory.push({ role: "assistant", content: botResponse });
        
        removeTypingIndicator();
        appendMessage(botResponse, 'bot');

    } catch (error) {
        removeTypingIndicator();
        appendMessage('Sorry, something went wrong on our end. Please try again.', 'bot');
        console.error('Error with AI completion:', error);
    }
});

function appendMessage(message, sender) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message', `${sender}-message`);
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    
    messageWrapper.appendChild(messageParagraph);
    chatWindow.appendChild(messageWrapper);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    
    const dotContainer = document.createElement('div');
    dotContainer.classList.add('dot-container');
    
    const dot1 = document.createElement('div');
    dot1.classList.add('dot');
    const dot2 = document.createElement('div');
    dot2.classList.add('dot');
    const dot3 = document.createElement('div');
    dot3.classList.add('dot');
    
    dotContainer.append(dot1, dot2, dot3);
    typingIndicator.appendChild(dotContainer);
    
    chatWindow.appendChild(typingIndicator);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}