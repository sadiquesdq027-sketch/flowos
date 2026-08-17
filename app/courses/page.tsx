"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadCourses() {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("published", true)
        .order("created_at", {
          ascending: false,
        });

      setCourses(data || []);
    }

    loadCourses();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-5xl font-bold mb-8">
        All Courses
      </h1>

      {courses.length === 0 ? (
        <p>No published courses.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg overflow-hidden shadow"
            >
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {course.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {course.description}
                </p>

                <p className="font-bold text-green-600 mt-3">
                  ₹{course.price}
                </p>

                <a
                  href={`/course/${course.id}`}
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Course
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}