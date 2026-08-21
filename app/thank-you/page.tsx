export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-bold text-green-600 mb-6">
        🎉 Payment Successful
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Thank you for your purchase.
      </p>

      <a
        href="/courses"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        <a
  href="/my-purchases"
  className="bg-green-600 text-white px-6 py-3 rounded"
>
  View My Purchases
</a>
      </a>
    </main>
  );
}