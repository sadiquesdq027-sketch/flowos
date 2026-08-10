"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
      }

      const { data } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      setCourses(data || []);
    }

    loadData();
  }, []);

  async function deleteCourse(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this course?"
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
      courses.filter((course) => course.id !== id)
    );

    alert("✅ Course deleted!");
  }

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-5xl font-bold mb-4">Dashboard</h1>

      <p className="text-gray-500 mb-6">
        Welcome to FlowOS Creator Dashboard
      </p>

      <div className="border p-4 rounded mb-6">
        <p>
          <strong>Logged in as:</strong> {email}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>

        {courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border p-4 rounded"
              >
                <h3 className="font-bold text-lg">
                  {course.title}
                </h3>

                <p>{course.description}</p>

                <p className="mt-2">
                  ₹{course.price}
                </p>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="mt-3 bg-red-600 text-white px-3 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </main>
  );
}