"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      setCourse(data);
      setLoading(false);
    }

    loadCourse();
  }, [id]);

  async function handlePayment() {
    try {
      const response = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: course.price * 100,
          }),
        }
      );

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "FlowOS",
        description: course.title,
        order_id: order.id,

        handler: async function (response: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await fetch("/api/save-purchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user?.id,
      course_id: course.id,
      amount: course.price,
      payment_id:
        response.razorpay_payment_id,
    }),
  });

  window.location.href = "/thank-you";
},

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new (window as any).Razorpay(
        options
      );

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto p-10">
        <h1 className="text-2xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  if (!course || !course.published) {
    return (
      <main className="max-w-3xl mx-auto p-10">
        <h1 className="text-3xl font-bold text-red-600">
          Course not available
        </h1>

        <p className="mt-4 text-gray-600">
          This course is not published yet.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-10">
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">
        {course.title}
      </h1>

      <p className="text-gray-600 mb-6">
        {course.description}
      </p>

      <p className="text-2xl font-bold mb-8">
        ₹{course.price}
      </p>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Buy Now
      </button>
    </main>
  );
}