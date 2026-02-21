"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CallProgress() {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<string>("registered");

  useEffect(() => {
    const fetchCallStatus = async () => {
      const callId = localStorage.getItem("callId");

      try {
        if (callId) {
          const res = await fetch(`/api/call-details/${callId}`);
          if (!res.ok) throw new Error("Failed to fetch call details");

          const data = await res.json();
          setCallStatus(data.call_status || "registered");

          if (data.call_status === "ended") {
            router.push("/call-results");
          } else if (data.call_status === "error") {
            setTimeout(() => router.push("/error"), 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching call status:", error);
        setTimeout(() => router.push("/error"), 2000);
      }
    };

    fetchCallStatus();
    const intervalId = setInterval(fetchCallStatus, 2000);
    return () => clearInterval(intervalId);
  }, [router]);

  const getStatusText = () => {
    switch (callStatus) {
      case "registered":
        return "Initiating your call...";
      case "ongoing":
        return "Your conversation is in progress...";
      case "error":
        return "There was an error with your call...";
      default:
        return "Processing your conversation...";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="animate-in fade-in duration-700 px-6 sm:px-8 max-w-2xl mx-auto w-full py-12 sm:py-16 flex flex-col items-center text-center space-y-8">
        {/* DaisyUI Loading Visual instead of the video */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {callStatus === "error" ? (
            <div className="text-error">
              <svg
                className="w-20 h-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ) : (
            <span className="loading loading-ring w-24 text-primary"></span>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[family-name:var(--font-outfit)] bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-2">
            {getStatusText()}
          </h2>
          <p className="text-base-content/60 text-lg sm:text-lg max-w-lg mx-auto leading-relaxed">
            Your call is currently in progress. The phone should ring anytime
            now. The analysis will appear once the call is completed.
          </p>
        </div>
      </div>
    </div>
  );
}
