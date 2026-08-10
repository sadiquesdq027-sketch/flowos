"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function saveCourse() {
    const { error } = await supabase.from("courses").insert([
      {
        title,
        description,
        price: Number(price),
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Course Saved Successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
    }
  }

  return (
    <main className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">💰 Create Course</h1>

      <input
        className="w-full border p-3 rounded mb-4"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-3 rounded mb-4"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        className="w-full border p-3 rounded mb-6"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={saveCourse}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Publish Course
      </button>
    </main>
  );
}