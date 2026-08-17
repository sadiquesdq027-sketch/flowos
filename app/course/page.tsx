"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  async function saveCourse() {
    let thumbnailUrl = "";

    if (thumbnail) {
      const fileName = `${Date.now()}-${thumbnail.name}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, thumbnail);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(fileName);

      thumbnailUrl = data.publicUrl;
    }

    const { error } = await supabase.from("courses").insert([
      {
        title,
        description,
        price: Number(price),
        thumbnail: thumbnailUrl,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Course Saved Successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail(null);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">
        💰 Create Course
      </h1>

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
        className="w-full border p-3 rounded mb-4"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setThumbnail(e.target.files?.[0] || null)
        }
        className="w-full border p-3 rounded mb-6"
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