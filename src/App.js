import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [apiKey, setApiKey] = useState("");
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedService, setSelectedService] = useState("flux"); // Default to Flux1 Pro

    const generateImage = async () => {
        if (!apiKey) {
            alert("Please enter your API key");
            return;
        }

        if (!prompt) {
            alert("Please enter a prompt");
            return;
        }

        setLoading(true);
        setImageUrl("");

        try {
            if (selectedService === "dalle") {
                // DALL-E API Logic
                const response = await axios.post(
                    "https://api.openai.com/v1/images/generations",
                    {
                        model: "dall-e-3",
                        prompt,
                        size: "1024x1024",
                        quality: "hd",
                        n: 1,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setImageUrl(response.data.data[0].url);
            } else {
                // Flux API Logic
                const fluxResponse = await axios.post(
                    "https://api.bfl.ml/v1/flux-pro-1.1",
                    {
                        prompt,
                        width: 1024,
                        height: 1024,
                    },
                    {
                        headers: {
                            accept: "application/json",
                            "x-key": apiKey,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const requestId = fluxResponse.data.id;
                if (!requestId) throw new Error("No image ID returned");

                let pollResponse;
                do {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    pollResponse = await axios.get(
                        `https://api.bfl.ml/v1/get_result?id=${requestId}`,
                        {
                            headers: {
                                accept: "application/json",
                                "x-key": apiKey,
                            },
                        }
                    );
                } while (pollResponse.data.status !== "Ready");

                setImageUrl(pollResponse.data.result.sample);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Image Generator</h1>

            <input
                type="text"
                placeholder="Enter API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ width: "300px", padding: "10px", marginBottom: "20px" }}
            />
            <br />

            <textarea
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ width: "300px", height: "100px", padding: "10px", resize: "none", overflowY: "scroll" }}
            ></textarea>
            <br />

            <div
                style={{
                    margin: "10px auto",
                    width: "300px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <label>
                    <input
                        type="radio"
                        value="flux"
                        checked={selectedService === "flux"}
                        onChange={() => setSelectedService("flux")}
                        style={{ marginRight: "5px" }}
                    />
                    Flux1 Pro
                </label>
                <label>
                    <input
                        type="radio"
                        value="dalle"
                        checked={selectedService === "dalle"}
                        onChange={() => setSelectedService("dalle")}
                        style={{ marginRight: "5px" }}
                    />
                    DALL-E 3
                </label>
            </div>

            <button onClick={generateImage} disabled={loading} style={{ padding: "10px 20px", marginTop: "20px" }}>
                {loading ? "Generating..." : "Generate"}
            </button>

            {loading && <div className="loader"></div>}
            {!loading && !imageUrl && <div className="simmer"></div>}

            {imageUrl && (
                <div className="image-container">
                    <img
                        src={imageUrl}
                        alt="Generated"
                        style={{ maxWidth: "300px", height: "auto", cursor: "pointer" }}
                        onClick={() => window.open(imageUrl, "_blank")}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
