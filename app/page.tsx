"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRY_OPTIONS = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
];

export default function Home() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCountry = COUNTRY_OPTIONS.find((c) => c.code === countryCode)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: countryCode + phone }),
      });
      const callId = await res.json();
      localStorage.setItem("callId", callId);
      router.push("/call-progress");
    } catch (error) {
      console.error("Error:", error);
      router.push("/error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="animate-in fade-in duration-700 px-6 sm:px-8 max-w-2xl mx-auto w-full py-12 sm:py-16">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-y-6">
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-[family-name:var(--font-outfit)] font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-2">
              Tarf
            </h1>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                Your Trusted Mental Health Companion
              </h2>
              <p className="text-base-content/60 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                Connect with our empathetic AI assistant for a supportive
                conversation about your feelings. We&apos;re here 24/7, ready to
                listen without judgement.
              </p>
            </div>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div>
            <label className="label mb-1">
              <span className="label-text text-sm font-medium">
                Enter your phone number to begin your journey
              </span>
            </label>

            <div className="join w-full">
              {/* Country dropdown */}
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn join-item btn-outline border-base-content/20 hover:bg-base-300 gap-2 min-w-[7rem]"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span>{countryCode}</span>
                  <svg
                    className="w-3 h-3 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {dropdownOpen && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-200 rounded-box z-50 w-56 p-2 shadow-xl border border-base-content/10 mt-2"
                  >
                    {COUNTRY_OPTIONS.map((option) => (
                      <li key={option.code}>
                        <button
                          type="button"
                          className="flex items-center gap-3"
                          onClick={() => {
                            setCountryCode(option.code);
                            setDropdownOpen(false);
                          }}
                        >
                          <span className="text-lg">{option.flag}</span>
                          <span>{option.country}</span>
                          <span className="ml-auto opacity-50">
                            {option.code}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Phone input */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input join-item input-bordered border-base-content/20 flex-1 focus:outline-none focus:border-primary"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !phone}
            className="btn btn-primary btn-block btn-lg"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Connecting...
              </>
            ) : (
              "Begin Your Journey"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
