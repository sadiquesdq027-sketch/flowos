"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setCourses(data || []);
    }
  }

  async function deleteCourse(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setCourses(
      courses.filter(
        (course) => course.id !== id
      )
    );

    alert("✅ Product deleted successfully!");
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        📦 My Products
      </h1>

      <div className="grid gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-xl p-5 shadow"
          >
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-52 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-2xl font-semibold">
              {course.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {course.description}
            </p>

            <p className="mt-3 font-bold text-green-600">
              ₹{course.price}
            </p>

            <div className="flex gap-3 mt-4">
              <a
                href={`/course/edit/${course.id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                ✏️ Edit Product
              </a>

              <button
                onClick={() =>
                  deleteCourse(course.id)
                }
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                🗑️ Delete Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}