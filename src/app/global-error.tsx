"use client";

import { useEffect } from "react";

export default function GlobalErrorPage({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string };
  retry: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main
          className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        >
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={retry}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}