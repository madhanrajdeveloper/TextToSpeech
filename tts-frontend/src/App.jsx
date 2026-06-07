import { useState } from 'react';

export default function App() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // This will pull from your .env file or your Netlify Environment settings
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg"
        rows="6"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your paragraph here..."
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !text}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate Voiceover"}
      </button>
      {audioUrl && <audio src={audioUrl} controls className="mt-4 w-full" />}
    </div>
  );
}