import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [apiKey, setApiKey] = useState("");
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

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
            // Send the initial request to generate the image
            const response = await axios.post(
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

            const requestId = response.data.id;
            if (!requestId) throw new Error("No image ID returned");

            // Poll for the result
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
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Flux1 Pro Image Generator</h1>

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

            <button onClick={generateImage} disabled={loading} style={{ padding: "10px 20px", marginTop: "10px" }}>
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
