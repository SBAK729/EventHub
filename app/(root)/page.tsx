// /app/page.tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-indigo-600">
        🎉 Welcome to EventHub
      </h1>
      <p className="mt-4 text-gray-700">
        You are signed in successfully with Clerk.
      </p>
    </main>
  );
}
