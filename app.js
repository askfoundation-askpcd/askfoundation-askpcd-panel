const analyseBtn = document.getElementById("analyseBtn");
const issueInput = document.getElementById("issueInput");
const deviceType = document.getElementById("deviceType");
const urgency = document.getElementById("urgency");
const status = document.getElementById("status");

const responseTitle = document.getElementById("responseTitle");
const stepsList = document.getElementById("stepsList");
const notes = document.getElementById("notes");

analyseBtn.addEventListener("click", async () => {

    analyseBtn.disabled = true;
    status.textContent = "Analysing…";

    const payload = {
        issue_description: issueInput.value,
        device_type: deviceType.value,
        urgency: urgency.value,
        session_id: "demo-session"
    };

    try {
        const res = await fetch("https://YOUR_AZURE_FUNCTION_URL/api/pcdoctor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.error) {
            responseTitle.textContent = "Something interrupted the analysis.";
            stepsList.innerHTML = "";
            notes.textContent = data.message;
            status.textContent = "Try again shortly.";
        } else {
            responseTitle.textContent = data.title;

            stepsList.innerHTML = "";
            data.steps.forEach(step => {
                const li = document.createElement("li");
                li.textContent = step;
                stepsList.appendChild(li);
            });

            notes.textContent = data.notes;
            status.textContent = "Analysis complete.";
        }

    } catch (err) {
        responseTitle.textContent = "Service unavailable.";
        stepsList.innerHTML = "";
        notes.textContent = "Please try again later.";
        status.textContent = "Error occurred.";
    }

    analyseBtn.disabled = false;
});
