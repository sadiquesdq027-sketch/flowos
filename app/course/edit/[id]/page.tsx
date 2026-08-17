"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(String(data.price || ""));
      }

      setLoading(false);
    }

    loadCourse();
  }, [id]);

  async function updateCourse() {
    const { error } = await supabase
      .from("courses")
      .update({
        title,
        description,
        price: Number(price),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Course Updated!");
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

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        ✏️ Edit Course
      </h1>

      <input
        className="w-full border p-3 rounded mb-4"
        placeholder="Course Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        className="w-full border p-3 rounded mb-4"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        type="number"
        className="w-full border p-3 rounded mb-6"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <button
        onClick={updateCourse}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Save Changes
      </button>
    </main>
  );
}