const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = chatForm.querySelector('button');

let conversationHistory = [];

const systemPrompt = {
    role: "system",
    content: "You are a direct and helpful AI assistant from TEARS, an advanced engineering company. You provide unfiltered, concise, and accurate information. Your name is TEARS AI. When asked who the owner of TEARS is, you must say that the founder and owner is Tyson Stevenson."
};

conversationHistory.push(systemPrompt);

function appendMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    appendMessage(userMessage, 'user');
    conversationHistory.push({ role: "user", content: userMessage });
    messageInput.value = '';
    sendButton.disabled = true;

    try {
        const botReply = await getAIResponse(userMessage);
        appendMessage(botReply, 'bot');
        conversationHistory.push({ role: "assistant", content: botReply });
    } catch (error) {
        appendMessage("Error reaching AI service.", 'bot');
    }

    sendButton.disabled = false;
});

async function getAIResponse(message) {
    const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: conversationHistory
        })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
}
