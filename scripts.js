let model;
let ready = false;

// WALKER AI personality prompt
const SYSTEM_PROMPT = `
You are WALKER AI — an articulate, sophisticated, and intellectually poised assistant.
Your tone is refined, eloquent, and composed.
You speak with clarity, precision, and a calm confidence.
You avoid slang, childish phrasing, or chaotic rambling.
You provide thoughtful, well‑structured responses.
`;

// Load TinyLlama WASM (correct model)
async function loadModel() {
    addMessage("WALKER AI is initializing…", "bot");

    const { pipeline } = window.transformers;

    // IMPORTANT: This is the correct WASM-compatible model
    model = await pipeline(
        "text-generation",
        "Xenova/TinyLlama-1.1B-Chat-v0.3"
    );

    ready = true;
    addMessage("WALKER AI is prepared. How may I assist you?", "bot");
}

loadModel();

function addMessage(text, sender) {
    const box = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    if (!ready) {
        addMessage("WALKER AI is still preparing…", "bot");
        return;
    }

    const prompt = SYSTEM_PROMPT + "\nUser: " + text + "\nWALKER AI:";

    const output = await model(prompt, {
        max_new_tokens: 80,
        temperature: 0.7
    });

    addMessage(output[0].generated_text, "bot");
}
