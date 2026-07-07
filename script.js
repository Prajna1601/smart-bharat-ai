const API_KEY = "YOUR_GOOGLE_API";
const portalButtons = document.getElementById("portalButtons");
const portalLink = document.getElementById("portalLink");
const language = document.getElementById("language");
const downloadBtn = document.getElementById("download");
// ========================
// ELEMENTS
// ========================

const response = document.getElementById("response");
const prompt = document.getElementById("prompt");

const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");
const copyBtn = document.getElementById("copy");

const navButtons = document.querySelectorAll(".nav");

const assistantPage = document.getElementById("assistantPage");
const documentPage = document.getElementById("documentPage");
const schemePage = document.getElementById("schemePage");
const complaintPage = document.getElementById("complaintPage");

// ========================
// PAGE SWITCHING
// ========================

function hideAllPages() {

    assistantPage.classList.add("hidden");
    documentPage.classList.add("hidden");
    schemePage.classList.add("hidden");
    complaintPage.classList.add("hidden");

}

navButtons.forEach((btn, index) => {

    btn.addEventListener("click", () => {

        navButtons.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        hideAllPages();

        switch (index) {

            case 0:

                assistantPage.classList.remove("hidden");

                break;

            case 1:

                documentPage.classList.remove("hidden");

                break;

            case 2:

                schemePage.classList.remove("hidden");

                break;

            case 3:

                complaintPage.classList.remove("hidden");

                break;

        }

    });

});

// ========================
// CHATBOT
// ========================

sendBtn.onclick = askAI;

prompt.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        askAI();

    }

});

async function askAI() {

    const question = prompt.value.trim();

    if (question === "") return;

    response.innerHTML = "🤖 Thinking...";
    portalButtons.style.display = "none";

    const q = question.toLowerCase();

    if (q.includes("passport")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://www.passportindia.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "🛂 Apply on Passport Seva";

    }

    else if (q.includes("aadhaar") || q.includes("aadhar")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://uidai.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "🪪 Visit UIDAI";

    }

    else if (q.includes("driving") || q.includes("licence") || q.includes("license")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://parivahan.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "🚗 Open Parivahan";

    }

    else if (q.includes("digilocker")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://www.digilocker.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "📂 Open DigiLocker";

    }

    else if (q.includes("umang")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://web.umang.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "📱 Open UMANG";

    }
    else if (q.includes("pan")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://www.incometax.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "💳 Apply for PAN";

    }
    else if (q.includes("voter") || q.includes("epic")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://voters.eci.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "🗳️ Open Voter Services";

    }
    else if (q.includes("ration")) {

        portalButtons.style.display = "flex";

        portalLink.href = "https://nfsa.gov.in";

        document.getElementById("portalBtn").innerHTML =
            "🍚 Open NFSA Portal";

    }




    try {

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    contents: [{

                        parts: [{

                            text: chatPrompt(question, language.value)

                        }]

                    }]

                })

            });

        const data = await res.json();

        const text = data.candidates[0].content.parts[0].text;

        response.innerHTML = format(text);

    }

    catch (e) {

        response.innerHTML = "<h2>❌ Error</h2>" + e.message;

    }

}

// ========================
// DOCUMENT CHECKER
// ========================

document.getElementById("documentBtn").onclick = async () => {

    const service = document.getElementById("documentInput").value;

    const output = document.getElementById("documentOutput");

    output.innerHTML = "Generating...";

    const res = await gemini(documentPrompt(service));

    output.innerHTML = format(res);

};

// ========================
// SCHEME FINDER
// ========================

document.getElementById("schemeBtn").onclick = async () => {

    const age = document.getElementById("age").value;

    const state = document.getElementById("state").value;

    const occupation = document.getElementById("occupation").value;

    const output = document.getElementById("schemeOutput");

    output.innerHTML = "Finding schemes...";

    const res = await gemini(

        schemePrompt(age, state, occupation)

    );

    output.innerHTML = format(res);

};

// ========================
// COMPLAINT
// ========================

document.getElementById("complaintBtn").onclick = async () => {

    const issue = document.getElementById("issue").value;

    const location = document.getElementById("location").value;

    const output = document.getElementById("complaintOutput");

    output.innerHTML = "Generating complaint...";

    const res = await gemini(

        complaintPrompt(issue, location)

    );

    output.innerHTML = format(res);

};

// ========================
// GEMINI FUNCTION
// ========================

async function gemini(promptText) {

    const res = await fetch(

        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                contents: [{

                    parts: [{

                        text: promptText

                    }]

                }]

            })

        });

    const data = await res.json();

    return data.candidates[0].content.parts[0].text;

}

// ========================
// COPY
// ========================

copyBtn.onclick = () => {

    navigator.clipboard.writeText(

        response.innerText

    );

    copyBtn.innerHTML = "Copied!";

    setTimeout(() => {

        copyBtn.innerHTML = "Copy";

    }, 1500);

};
downloadBtn.onclick = () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const text = response.innerText;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text("Smart Bharat AI", 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(text, 170);

    doc.text(lines, 20, 35);

    doc.save("SmartBharatAI.pdf");

};
// ========================
// CLEAR
// ========================

clearBtn.onclick = () => {

    prompt.value = "";

    response.innerHTML = `
        <h2>👋 Welcome</h2>
        <p>Ask me anything about Government Services.</p>
    `;

    // Hide official portal button
    portalButtons.style.display = "none";

};

// ========================
// FORMAT
// ========================

function format(text) {

    return text

        .replace(/^### (.*$)/gim, "<h3>$1</h3>")

        .replace(/^## (.*$)/gim, "<h2>$1</h2>")

        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")

        .replace(/\n/g, "<br>");

}
// ===============================
// Voice Input
// ===============================

const micBtn = document.getElementById("mic");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    micBtn.addEventListener("click", () => {

        recognition.start();

        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Listening...';

    });

    recognition.onresult = (event) => {

        prompt.value = event.results[0][0].transcript;

        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Speak';

    };

    recognition.onerror = () => {

        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Speak';

        alert("Voice recognition failed.");

    };

    recognition.onend = () => {

        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Speak';

    };

} else {

    micBtn.style.display = "none";

}
const quickCards = document.querySelectorAll(".quick-card");

quickCards.forEach(card => {

    card.addEventListener("click", () => {

        const title = card.querySelector("h3").innerText;

        switch (title) {

            case "Passport":
                prompt.value = "How do I apply for an Indian Passport?";
                break;

            case "Scholarships":
                prompt.value = "Suggest government scholarships for engineering students in Karnataka.";
                break;

            case "Driving Licence":
                prompt.value = "How do I apply for a Driving Licence in India?";
                break;

            case "Complaint":
                prompt.value = "Generate a complaint letter for garbage not collected in my locality.";
                break;

        }

        askAI();   // Automatically ask Gemini

    });

});