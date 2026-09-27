import React, { useState, useEffect, useRef } from "react";
import "../styles/askpcdoctor.css";
import logo from "../assets/logo.png";
import avatarImage from "../assets/nick-earth.png"; // your avatar

function AskPCDoctorPanel() {
    const [issue, setIssue] = useState("");
    const [deviceType, setDeviceType] = useState("Windows PC");
    const [urgency, setUrgency] = useState("normal");
    const [status, setStatus] = useState("Ready to analyse");
    const [title, setTitle] = useState("Your diagnostic will appear here");
    const [steps, setSteps] = useState([
        "Step 1 will appear here...",
        "Step 2 will appear here...",
        "Step 3 will appear here..."
    ]);
    const [notes, setNotes] = useState("Additional notes will appear here...");
    const [loading, setLoading] = useState(false);

    const avatarRef = useRef(null);

    // Avatar breathing + blinking
    useEffect(() => {
        const avatar = avatarRef.current;
        if (!avatar) return;

        avatar.classList.add("breathing");

        const blinkTimer = setInterval(() => {
            avatar.classList.add("blink");
            setTimeout(() => avatar.classList.remove("blink"), 150);
        }, 4000);

        return () => clearInterval(blinkTimer);
    }, []);

    const handleAnalyse = async () => {
        setLoading(true);
        setStatus("Analysing…");

        const payload = {
            issue_description: issue,
            device_type: deviceType,
            urgency,
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
                setTitle("Something interrupted the analysis.");
                setSteps([]);
                setNotes(data.message || "Please try again shortly.");
                setStatus("Try again shortly.");
            } else {
                setTitle(data.title || "Diagnostic ready");
                setSteps(data.steps || []);
                setNotes(data.notes || "");
                setStatus("Analysis complete.");
            }
        } catch (err) {
            setTitle("Service unavailable.");
            setSteps([]);
            setNotes("Please try again later.");
            setStatus("Error occurred.");
        }

        setLoading(false);
    };

    return (
        <div className="apcd-root">
            <header className="header">
                <div className="brand">
                    <img src={logo} className="logo" alt="AskPCDoctor Logo" />
                    <div className="title">AskPCDoctor</div>
                </div>

                <img
                    ref={avatarRef}
                    src={avatarImage}
                    className="apcd-avatar"
                    alt="AskPCDoctor Avatar"
                />

                <div className="strapline">Powered by AskFoundation’s FocusedAI</div>
            </header>

            <main className="container">
                <section className="input-panel">
                    <h2>Describe your PC issue</h2>

                    <textarea
                        value={issue}
                        onChange={e => setIssue(e.target.value)}
                        placeholder="Tell me what's happening with your PC..."
                    />

                    <select
                        value={deviceType}
                        onChange={e => setDeviceType(e.target.value)}
                    >
                        <option value="Windows PC">Windows PC</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Mac">Mac</option>
                    </select>

                    <select
                        value={urgency}
