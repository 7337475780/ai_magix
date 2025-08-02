// Input.tsx
"use client";

import React from "react";
import { LuSendHorizontal, LuSparkles } from "react-icons/lu";

type InputProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: (prompt: string, enhance: boolean) => void;
};

const Input = ({ prompt, setPrompt, onSubmit }: InputProps) => {
  const [enhance, setEnhance] = React.useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt.trim(), enhance);
    setPrompt(""); // Clear input after submitting
  };

  return (
    <div className="w-[90%] border flex items-center justify-between px-4 py-2 outline-none rounded-full">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Enter your prompt..."
        className="w-full text-sm border-none outline-none"
      />

      {/* Enhance toggle button */}
      <button
        type="button"
        onClick={() => setEnhance((prev) => !prev)}
        className={`self-start cursor-pointer hover:scale-110 text-[18px] hover:text-purple-900 px-2 rounded-full font-semibold transition ${
          enhance ? "text-purple-600" : "text-gray-700"
        }`}
        title="Toggle Prompt Enhancement"
      >
        <LuSparkles />
      </button>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="text-xl text-blue-600 hover:text-blue-800 transition-transform hover:scale-110 cursor-pointer"
        title="Generate"
      >
        <LuSendHorizontal />
      </button>
    </div>
  );
};

export default Input;
