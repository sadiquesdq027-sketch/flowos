"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  async function saveCourse() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    let thumbnailUrl = "";
    let fileUrl = "";

    // Upload Thumbnail
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

    // Upload PDF / Ebook
    if (productFile) {
      const fileName = `${Date.now()}-${productFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, productFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      fileUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("courses")
      .insert([
        {
          creator_id: user.id,
          title,
          description,
          price: Number(price),
          thumbnail: thumbnailUrl,
          file_url: fileUrl,
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Product Saved Successfully!");

      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail(null);
      setProductFile(null);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">
        🚀 Create Product
      </h1>

      <input
        className="w-full border p-3 rounded mb-4"
        placeholder="Product Title"
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

      <label className="block mb-2 font-medium">
        Thumbnail Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setThumbnail(e.target.files?.[0] || null)
        }
        className="w-full border p-3 rounded mb-6"
      />

      <label className="block mb-2 font-medium">
        Upload PDF / Ebook
      </label>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setProductFile(e.target.files?.[0] || null)
        }
        className="w-full border p-3 rounded mb-6"
      />

      <button
        onClick={saveCourse}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Publish Product
      </button>
    </main>
  );
} 