// =========================
// LOG
// =========================
function log(msg) {
    const logBox = document.getElementById("log");
    logBox.innerHTML += `<div>${msg}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

// =========================
// PANEL MODE HANDLER
// =========================
function setPanelMode(side, mode, model) {
    const frame = document.getElementById("frame" + side);
    const apiBox = document.getElementById("api" + side);

    frame.style.display = "none";
    apiBox.style.display = "none";

    if (mode === "iframe") {
        frame.style.display = "block";

        if (model === "claude") frame.src = "https://poe.com/Claude-3-Sonnet";
        if (model === "gemini") frame.src = "https://gemini.google.com/app";
        if (model === "deepseek") frame.src = "https://chat.deepseek.com/";
        if (model === "llama") frame.src = "https://huggingface.co/chat/";
        if (model === "qwen") frame.src = "https://chat.qwenlm.ai/";
        if (model === "custom") frame.src = prompt("Podaj URL:");
    }

    if (mode === "poe") {
        frame.style.display = "block";
        frame.src = "https://poe.com/Claude-3-Sonnet";
    }

    if (mode === "api") {
        apiBox.style.display = "block";
    }

    if (mode === "ww2") {
        log("Tryb WebView2 działa tylko w aplikacji C#");
    }
}

// =========================
// EVENTY SELECTÓW
// =========================
document.querySelectorAll(".modeSelect").forEach(sel => {
    sel.addEventListener("change", () => {
        const side = sel.dataset.side;
        const model = document.querySelector(`.modelSelect[data-side="${side}"]`).value;
        setPanelMode(side, sel.value, model);
    });
});

document.querySelectorAll(".modelSelect").forEach(sel => {
    sel.addEventListener("change", () => {
        const side = sel.dataset.side;
        const mode = document.querySelector(`.modeSelect[data-side="${side}"]`).value;
        setPanelMode(side, mode, sel.value);
    });
});

// =========================
// API: DEEPSEEK
// =========================
async function callDeepSeek(prompt) {
    const key = window.CONFIG.deepseek_key;
    if (!key) return "Brak klucza DeepSeek";

    try {
        const res = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!res.ok) return "Błąd DeepSeek: " + res.status;

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "Brak odpowiedzi";
    } catch {
        return "Błąd połączenia z DeepSeek";
    }
}

// =========================
// API: GEMINI
// =========================
async function callGemini(prompt) {
    const key = window.CONFIG.gemini_key;
    if (!key) return "Brak klucza Gemini";

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!res.ok) return "Błąd Gemini: " + res.status;

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Brak odpowiedzi";
    } catch {
        return "Błąd połączenia z Gemini";
    }
}

// =========================
// API: OPENROUTER (DeepSeek Chat)
// =========================
async function callOpenRouter(prompt) {
    const key = window.CONFIG.openrouter_key;
    if (!key) return "Brak klucza OpenRouter";

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost",
                "X-Title": "AI Router A/B"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!res.ok) return "Błąd OpenRouter: " + res.status;

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "Brak odpowiedzi";
    } catch {
        return "Błąd połączenia z OpenRouter";
    }
}

// =========================
// API: CLAUDE 3.7 SONNET (OpenRouter)
// =========================
async function callClaudeOR(prompt) {
    const key = window.CONFIG.openrouter_key;
    if (!key) return "Brak klucza OpenRouter";

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost",
                "X-Title": "AI Router A/B"
            },
            body: JSON.stringify({
                model: "anthropic/claude-3.7-sonnet:beta",
                max_tokens: 512,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!res.ok) return "Błąd Claude OR: " + res.status;

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "Brak odpowiedzi";
    } catch {
        return "Błąd połączenia z Claude OR";
    }
}

// =========================
// API: QWEN 2.5 72B (OpenRouter)
// =========================
async function callQwenOR(prompt) {
    const key = window.CONFIG.openrouter_key;
    if (!key) return "Brak klucza OpenRouter";

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost",
                "X-Title": "AI Router A/B"
            },
            body: JSON.stringify({
                model: "qwen/qwen-2.5-72b-instruct",
                max_tokens: 512,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!res.ok) return "Błąd Qwen OR: " + res.status;

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "Brak odpowiedzi";
    } catch {
        return "Błąd połączenia z Qwen OR";
    }
}

// =========================
// API: LLAMA 3.1 405B (OpenRouter)
// =========================
async function callLlamaOR(prompt) {
    const key = window.CONFIG.openrouter_key;
    if (!key) return "Brak klucza OpenRouter";

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost",
                "X-Title": "AI Router A/B"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-405b-instruct",
                max_tokens: 512,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!res.ok) return "Błąd LLaMA OR: " + res.status;

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "Brak odpowiedzi";
    } catch {
        return "Błąd połączenia z LLaMA OR";
    }
}

// =========================
// API ROUTER
// =========================
async function sendToAPI(side, prompt) {
    const model = document.querySelector(`.modelSelect[data-side="${side}"]`).value;

    if (model === "claude_or") return await callClaudeOR(prompt);
    if (model === "qwen_or") return await callQwenOR(prompt);
    if (model === "llama_or") return await callLlamaOR(prompt);

    if (model === "deepseek") return await callDeepSeek(prompt);
    if (model === "gemini") return await callGemini(prompt);
    if (model === "openrouter") return await callOpenRouter(prompt);

    return "Model API nieobsługiwany";
}

// =========================
// BUTTON: SEND TO A
// =========================
document.getElementById("sendA").onclick = async () => {
    const text = document.getElementById("sharedInput").value;
    log("→ Wysyłam do A: " + text);

    const mode = document.querySelector('.modeSelect[data-side="A"]').value;

    if (mode === "api") {
        const out = await sendToAPI("A", text);
        document.getElementById("apiA").value = out;
    }
};

// =========================
// BUTTON: SEND TO B
// =========================
document.getElementById("sendB").onclick = async () => {
    const text = document.getElementById("sharedInput").value;
    log("→ Wysyłam do B: " + text);

    const mode = document.querySelector('.modeSelect[data-side="B"]').value;

    if (mode === "api") {
        const out = await sendToAPI("B", text);
        document.getElementById("apiB").value = out;
    }
};

// =========================
// ROUTING A → B
// =========================
document.getElementById("routeAtoB").onclick = async () => {
    const outA = document.getElementById("apiA").value;
    log("Routing A → B");

    const mode = document.querySelector('.modeSelect[data-side="B"]').value;

    if (mode === "api") {
        const out = await sendToAPI("B", outA);
        document.getElementById("apiB").value = out;
    }
};

// =========================
// ROUTING B → A
// =========================
document.getElementById("routeBtoA").onclick = async () => {
    const outB = document.getElementById("apiB").value;
    log("Routing B → A");

    const mode = document.querySelector('.modeSelect[data-side="A"]').value;

    if (mode === "api") {
        const out = await sendToAPI("A", outB);
        document.getElementById("apiA").value = out;
    }
};

// =========================
// PING A
// =========================
document.getElementById("pingA").onclick = async () => {
    log("Ping A");

    const mode = document.querySelector('.modeSelect[data-side="A"]').value;

    if (mode !== "api") {
        log("Tryb A nie jest API");
        return;
    }

    const out = await sendToAPI("A", "ping");
    log("A → " + out);
};

// =========================
// PING B
// =========================
document.getElementById("pingB").onclick = async () => {
    log("Ping B");

    const mode = document.querySelector('.modeSelect[data-side="B"]').value;

    if (mode !== "api") {
        log("Tryb B nie jest API");
        return;
    }

    const out = await sendToAPI("B", "ping");
    log("B → " + out);
};

// =========================
// USTAWIENIA DOMYŚLNE
// =========================
document.querySelector('.modeSelect[data-side="A"]').value = "api";
document.querySelector('.modelSelect[data-side="A"]').value = "openrouter";
setPanelMode("A", "api", "openrouter");

document.querySelector('.modeSelect[data-side="B"]').value = "api";
document.querySelector('.modelSelect[data-side="B"]').value = "gemini";
setPanelMode("B", "api", "gemini");

log("Domyślne ustawienia: A = OpenRouter (DeepSeek Chat), B = Gemini API");
