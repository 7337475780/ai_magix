"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import Input from "@/components/inputs/Input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaDownload } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const Page = () => {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";
  const [prompt, setPrompt] = useState(""); // Input text
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(null); // Enhanced suggestion
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Generated image links
  const [history, setHistory] = useState<{ prompt: string; image: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const imageRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("aimagix-history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("aimagix-history", JSON.stringify(history));
  }, [history]);

  // Auto scroll to new image
  useEffect(() => {
    if (imageUrls.length > 0 && imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [imageUrls]);

  // Generate image from prompt
  const generateImage = async (prompt: string) => {
    if (!isAuthed) {
      toast.error("Please sign in to generate images");
      return;
    }

    if (!prompt.trim()) return;
    setLoading(true);
    setErr(null);
    setSuggestedPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.err || "Failed to generate image.");
        return;
      }

      if (data.imageUrls?.length > 0) {
        setImageUrls(data.imageUrls);
        setHistory((prev) => [
          ...prev,
          ...data.imageUrls.map((img: string) => ({ prompt, image: img })),
        ]);
      } else {
        setErr("No image returned.");
      }
    } catch (err) {
      setErr("An error occurred while generating the image.");
    } finally {
      setLoading(false);
    }
  };

  // Download image
  const downloadImage = async (url: string, filename: string) => {
    const proxyUrl = `api/download?url=${encodeURIComponent(url)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhance prompt via Gemini
  const enhancedPrompt = async (prompt: string) => {
    const res = await fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.err || "Failed to enhance prompt");

    const rawText = data.enhancedPrompt || "";

    const extractedPrompt = rawText.trim();

    if (!extractedPrompt || extractedPrompt.length < 10) {
      throw new Error("Could not extract a valid enhanced prompt.");
    }

    return extractedPrompt;
  };

  return (
    <main className="flex flex-col items-center justify-center p-6 max-w-5xl mx-auto">
      <h1 className="mb-1">
        <span className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          AIMagix
        </span>
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Turn words into stunning visuals with AI.
      </p>

      {/* Prompt Input Field */}
      <Input
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={async (rawPrompt, enhance) => {
          if (!isAuthed) {
            toast.error("Please sign in to generate images.");
            return;
          }
          if (enhance) {
            try {
              const suggestion = await enhancedPrompt(rawPrompt);
              setSuggestedPrompt(suggestion);
            } catch (err: any) {
              setErr(err.message);
            }
          } else {
            generateImage(rawPrompt);
          }
        }}
      />

      {/* Suggested Enhanced Prompt */}
      {suggestedPrompt && (
        <div className="mt-4 p-4 border rounded-xl shadow-xl  bg-gray-100 text-sm w-full max-w-md">
          <p className="mb-2 font-medium text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent ">
            Suggested Enhanced Prompt:
          </p>
          <p className="italic text-gray-700">"{suggestedPrompt}"</p>
          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="default"
              onClick={() => {
                setPrompt(suggestedPrompt!); // insert into input field
                setSuggestedPrompt(null); // hide suggestion
              }}
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:brightness-110 text-white font-semibold transition-all"
            >
              Insert into Input
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold transition-all"
              onClick={() => {
                generateImage(suggestedPrompt!); // directly generate image
                setSuggestedPrompt(null);
              }}
            >
              Generate Now
            </Button>
            <Button
              className="border border-gray-300 hover:border-gray-400 text-gray-600 bg-white"
              variant="ghost"
              onClick={() => setSuggestedPrompt(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-6 w-full max-w-md">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="flex justify-center mt-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          </div>
        </div>
      )}

      {err && <p className="text-red-500 mt-4 text-center max-w-md">{err}</p>}

      {/* Display Images */}
      {imageUrls.length > 0 && (
        <div
          ref={imageRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-2xl"
        >
          {imageUrls.map((url, i) => (
            <div
              key={i}
              className="relative group border rounded-xl overflow-hidden shadow transition"
            >
              <img
                src={url}
                alt={`Generated image ${i + 1}`}
                className="w-full rounded object-cover aspect-square"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => downloadImage(url, `aimagix-image-${i + 1}.png`)}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition"
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <section className="mt-12 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Image History
            </h2>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("aimagix-history");
              }}
            >
              Clear History
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="relative border rounded-xl overflow-hidden shadow hover:shadow-lg group transition"
              >
                <img
                  src={item.image}
                  alt={`Generated for: ${item.prompt}`}
                  className="rounded w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition flex items-end">
                  {item.prompt}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-xs"
                  onClick={() =>
                    downloadImage(item.image, `aimagix-${idx + 1}.png`)
                  }
                >
                  <FaDownload />
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Page;
