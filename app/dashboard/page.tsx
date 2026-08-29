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

      if (!user) {
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (!error) {
        setCourses(data || []);
      }
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
      courses.filter(
        (course) => course.id !== id
      )
    );

    alert("✅ Course deleted!");
  }

  async function togglePublish(
    id: number,
    currentStatus: boolean
  ) {
    const { error } = await supabase
      .from("courses")
      .update({
        published: !currentStatus,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              published: !currentStatus,
            }
          : course
      )
    );
  }

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-5xl font-bold mb-4">
        Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Welcome to FlowOS Creator Dashboard
      </p>

      <div className="border p-4 rounded mb-6">
        <p>
          <strong>Logged in as:</strong> {email}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          My Courses
        </h2>

        <a
          href="/course"
          className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg mb-6"
        >
          + Create New Course
        </a>

        {courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border p-4 rounded-lg shadow"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}

                <h3 className="font-bold text-xl">
                  {course.title}
                </h3>

                <p className="mt-2">
                  {course.published ? (
                    <span className="text-green-600 font-bold">
                      ✅ Published
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-bold">
                      📝 Draft
                    </span>
                  )}
                </p>

                <p className="text-gray-600 mt-2">
                  {course.description}
                </p>

                <p className="mt-3 font-bold text-green-600">
                  ₹{course.price}
                </p>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`/course/${course.id}`}
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View
                  </a>

                  <a
                    href={`/course/edit/${course.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </a>

                  <button
                    onClick={() =>
                      togglePublish(
                        course.id,
                        course.published
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {course.published
                      ? "Unpublish"
                      : "Publish"}
                  </button>

                  <button
                    onClick={() =>
                      deleteCourse(course.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
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