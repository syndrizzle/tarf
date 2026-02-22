"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CallData {
  summary?: string;
  user_sentiment?: string;
  transcript?: string;
}

interface Message {
  role: "Agent" | "User";
  content: string;
}

export default function CallResults() {
  const router = useRouter();
  const [results, setResults] = useState<CallData | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const callId = localStorage.getItem("callId");

      try {
        if (callId) {
          const response = await fetch(`/api/call-details/${callId}`);
          if (!response.ok) throw new Error("Failed to fetch results");

          const data = await response.json();
          setResults(data);
          localStorage.removeItem("callId");
        }
      } catch (error) {
        console.error("Error fetching call results:", error);
        router.push("/error");
      }
    };

    fetchResults();
  }, [router]);

  const parseTranscript = (transcript: string): Message[] => {
    if (!transcript) return [];

    return transcript
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [role, ...contentParts] = line.split(":");
        return {
          role: role.trim() as "Agent" | "User",
          content: contentParts.join(":").trim().replace(/"/g, ""),
        };
      });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-20 flex flex-col pb-32">
        <div className="text-center space-y-4 mb-12 animate-in fade-in duration-700">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-[family-name:var(--font-outfit)] font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-2">
            Call Analysis
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-base-content">
            Here&apos;s what we found from your conversation
          </p>
        </div>

        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Summary Card */}
          <div className="card bg-base-100 shadow-xl border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-1">
                <span className="text-2xl not-italic mr-2">📝</span> Summary
              </h2>
              <p className="text-base-content/80 mt-2 text-lg">
                {results?.summary || "No summary available"}
              </p>
            </div>
          </div>

          {/* Sentiment Card */}
          <div className="card bg-base-100 shadow-xl border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent pb-1">
                <span className="text-2xl not-italic mr-2">💭</span> User
                Sentiment
              </h2>
              <p className="text-base-content/80 mt-2 text-lg">
                {results?.user_sentiment || "No sentiment data available"}
              </p>
            </div>
          </div>

          {/* Transcript Card */}
          <div className="card bg-base-100 shadow-xl border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1 mb-4">
                <span className="text-2xl not-italic mr-2">💬</span> Transcript
              </h2>

              <div className="space-y-4">
                {results?.transcript ? (
                  parseTranscript(results.transcript).map((message, index) => (
                    <div
                      key={index}
                      className={`chat ${
                        message.role === "User" ? "chat-end" : "chat-start"
                      }`}
                    >
                      <div className="chat-header text-sm opacity-70 mb-1">
                        {message.role}
                      </div>
                      <div
                        className={`chat-bubble ${
                          message.role === "User"
                            ? "chat-bubble-primary"
                            : "chat-bubble-base-200 text-base-content"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/40 text-center italic">
                    No transcript available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-base-200 via-base-200 to-transparent flex justify-center z-50 animate-in fade-in duration-700 delay-300">
          <button
            onClick={() => router.push("/")}
            className="btn btn-primary btn-lg shadow-xl group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
