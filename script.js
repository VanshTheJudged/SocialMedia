const API_URL = "http://localhost:5000";

async function submitConfession() {
    const text = document.getElementById("confessionText").value;
    if (!text) {
        alert("Please write something!");
        return;
    }

    const response = await fetch(`${API_URL}/confess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const result = await response.json();
    alert(result.message);
    document.getElementById("confessionText").value = "";
    loadConfessions();
}

async function loadConfessions() {
    const response = await fetch(`${API_URL}/confessions`);
    const confessions = await response.json();

    const confessionsList = document.getElementById("confessionsList");
    confessionsList.innerHTML = "";

    confessions.forEach(confession => {
        const div = document.createElement("div");
        div.textContent = confession.text;
        confessionsList.appendChild(div);
    });
}

window.onload = loadConfessions;
