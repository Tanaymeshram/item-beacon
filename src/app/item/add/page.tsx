"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";

export default function AddItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "electronics",
    imageUrl: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        // Redirect to QR code page for this item
        router.push(`/item/${data.item.id}/qr`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Register New Item</h1>
        <p className="text-muted-foreground mt-1">Add your item details to generate a secure QR code layer.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Image (Required)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-lg hover:bg-muted/50 transition cursor-pointer relative overflow-hidden group">
              {formData.imageUrl ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${formData.imageUrl})` }}
                />
              ) : (
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground justify-center">
                    <span className="relative rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Upload a file</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-input/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. MacBook Pro, Blue Backpack"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-input/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="electronics">Electronics</option>
                <option value="bags">Bags & Wallets</option>
                <option value="keys">Keys</option>
                <option value="documents">Documents</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description & Identifying features</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-input/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Has a scratch on the left corner and a sticker on the back..."
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 rounded-lg shadow-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none transition-all disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Registering...
                </>
              ) : (
                "Save & Generate QR Code"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
