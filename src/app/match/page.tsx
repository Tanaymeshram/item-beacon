"use client";

import { useState } from "react";
import { UploadCloud, Search, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function AIMatchPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResults(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = () => {
    if (!image) return;
    setIsAnalyzing(true);
    
    // Simulate AI network delay for demonstration (3 seconds)
    setTimeout(() => {
      setIsAnalyzing(false);
      // Dummy results mimicking AI similarity scoring
      setResults([
        { id: "mock-1", name: "Black Laptop Backpack", matchScore: 94, owner: "Alex", status: "lost" },
        { id: "mock-2", name: "Generic Travel Bag", matchScore: 62, owner: "Sarah", status: "lost" },
        { id: "mock-3", name: "Blue Duffel", matchScore: 18, owner: "Mike", status: "recovered" },
      ]);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-primary" /> AI Image Matcher
        </h1>
        <p className="text-muted-foreground mt-1">Upload a picture of an item you found, and our computer vision model will find registered matches.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden h-64 md:h-80 flex items-center justify-center border-dashed border-2 border-border hover:border-primary/50 transition bg-muted/20">
            {image ? (
              <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4" 
                style={{ backgroundImage: `url(${image})` }}
              >
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <span className="font-bold">Analyzing features...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">Tap to upload a photo</p>
                <p className="text-xs text-muted-foreground mt-2">JPEG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImageChange}
            />
          </div>

          <button 
            disabled={!image || isAnalyzing}
            onClick={runAnalysis}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold disabled:opacity-50 hover:bg-primary/90 flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Search size={20} />
            {isAnalyzing ? "Processing..." : "Find Matches"}
          </button>
        </div>

        {/* Results Column */}
        <div>
          {results ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-bold text-lg mb-4">Matches Found</h3>
              {results.map((res, i) => (
                <div key={res.id} className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4" style={{borderLeftColor: res.matchScore > 80 ? '#22c55e' : res.matchScore > 50 ? '#eab308' : '#ef4444'}}>
                  <div>
                    <h4 className="font-bold">{res.name}</h4>
                    <span className="text-xs text-muted-foreground">Owner: {res.owner}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold flex items-center gap-1 justify-end" style={{color: res.matchScore > 80 ? '#22c55e' : res.matchScore > 50 ? '#eab308' : '#ef4444'}}>
                       {res.matchScore}%
                    </div>
                    <button className="text-xs text-primary font-medium flex items-center mt-1">
                      View Profile <ArrowRight size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full border border-border border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-muted/10 opacity-60">
               <Sparkles size={40} className="text-muted-foreground mb-4" />
               <p className="font-medium text-muted-foreground">Upload an image to see neural network similarity scores</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
