"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchases() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        setPurchases(data);
      }

      setLoading(false);
    }

    loadPurchases();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        My Purchases
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : purchases.length === 0 ? (
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Purchased Courses
          </h2>

          <p className="text-gray-600 mb-4">
            No purchases found.
          </p>

          <Link
            href="/courses"
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="border rounded-lg p-5"
            >
              <h2 className="text-xl font-bold">
                Course ID: {purchase.course_id}
              </h2>

              <p>
                Amount: ₹{purchase.amount}
              </p>

              <p>
                Payment ID: {purchase.payment_id}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
const {
  data: { user },
} = await supabase.auth.getUser();

console.log("USER:", user);

const { data, error } = await supabase
  .from("purchases")
  .select("*")
  .eq("user_id", user?.id);

console.log("PURCHASES:", data);
console.log("ERROR:", error);