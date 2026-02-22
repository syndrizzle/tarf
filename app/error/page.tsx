"use client";

import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="animate-in fade-in duration-700 px-6 sm:px-8 max-w-2xl mx-auto w-full py-12 sm:py-16 flex flex-col items-center text-center space-y-8">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-[family-name:var(--font-outfit)] font-bold bg-gradient-to-r from-error via-warning to-error bg-clip-text text-transparent pb-2">
          OOPS!
        </h1>

        <div className="space-y-4">
          <p className="text-xl sm:text-2xl font-bold text-base-content">
            We couldn&apos;t connect your call due to some error.
          </p>
          <p className="text-base-content/60 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Please make sure that you&apos;ve picked up the call. Possible
            reasons include the call getting declined or voicemail activation.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="btn btn-primary btn-lg mt-8 group"
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
  );
}
