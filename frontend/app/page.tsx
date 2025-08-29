"use client";
import { useState } from "react";

export default function Home() {
    const [longURL, setLongURL] = useState<string>("");
    const [shortURL, setShortURL] = useState<string>("");
    const handleSubmitURL = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // check valid URL
            new URL(longURL);
        } catch {
            // not-valid, return from func
            return;
        }

        // call API to get shortURL
        try {
            const response = await fetch(
                `http://localhost:8000/urls/shorten/${encodeURIComponent(
                    longURL
                )}`,
                {
                    method: "GET",
                }
            );
            if (!response.ok) {
                console.error("HTTPS error", response.status);
                return;
            }
            const data = await response.json();
            setShortURL(data[0]);
        } catch {
            console.log("Unable to generate short URL");
        }
    };
    return (
        <div className="font-mono flex justify-center items-center w-full h-full text-black">
            <div className="flex flex-col flex-2 justify-center items-center h-screen bg-amber-300">
                <p className="font-sans my-4 text-3xl font-bold">Short-URL</p>
                <p className="m-1 text-lg tracking-wide text-gray-800">
                    {" "}
                    Squeeze your long URL or get a QR for easy access (maybe
                    both?)
                </p>
                <form onSubmit={handleSubmitURL}>
                    <input
                        onChange={(e) => setLongURL(e.target.value)}
                        value={longURL}
                        name="hello"
                        type="text"
                        placeholder="Paste or enter your URL"
                        className="font-sans text-xl bg-amber-50 text-gray-900 outline-2 outline-black my-6 m-1 px-5 py-2 rounded-full"
                    />
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="m-1 px-5 py-2 rounded-xl outline-2 outline-amber-200 bg-amber-500 cursor-pointer hover:scale-95 active:scale-80 transition-all duration-200 ease-in-out"
                        >
                            Squeeze URL
                        </button>
                        <button className="m-1 px-5 py-2 rounded-xl outline-2 outline-amber-200 bg-amber-500 cursor-pointer hover:scale-95 active:scale-80 transition-all duration-200 ease-in-out">
                            Get QR
                        </button>
                    </div>
                </form>
                {shortURL && (
                    <div className="flex flex-col justify-center my-10 min-w-lg border-2 border-amber-200 rounded-xl p-2 px-4">
                        <span className="text-xl font-extrabold text-amber-600">
                            Squeezed URL:
                        </span>
                        <a
                            href={shortURL}
                            target="_blank"
                            className="cursor-pointer hover:text-red-700 hover:translate-x-1 active:scale-95 transition-all duration-200 ease-in-out"
                        >
                            {shortURL}
                        </a>
                    </div>
                )}
            </div>
            <div className="flex flex-1 justify-center items-center h-screen bg-red-300">
                display fun stuff for VIBEEE ✨
            </div>
        </div>
    );
}
