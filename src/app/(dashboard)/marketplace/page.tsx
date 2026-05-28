"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Plus, Tag, X, Package } from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string;
  condition: string;
  status: string;
  contactPhone: string | null;
  flatNumber: string | null;
  createdAt: string;
  userId: string;
}

const CATEGORIES = [
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "appliances", label: "Appliances" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "vehicles", label: "Vehicles" },
  { value: "services", label: "Services" },
  { value: "general", label: "General" },
];

const CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Needs Repair" },
];

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "general",
    condition: "good", contactPhone: "", flatNumber: "",
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marketplace");
      const d = await res.json();
      if (Array.isArray(d)) setListings(d);
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handlePost = async () => {
    if (!form.title) return toast.error("Title is required");
    const load = toast.loading("Posting listing...");
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Listed successfully!", { id: load });
        setShowForm(false);
        setForm({ title: "", description: "", price: "", category: "general", condition: "good", contactPhone: "", flatNumber: "" });
        fetchListings();
      } else {
        toast.error("Failed to post", { id: load });
      }
    } catch {
      toast.error("Error", { id: load });
    }
  };

  const handleMarkSold = async (id: string) => {
    try {
      await fetch(`/api/marketplace/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sold" }),
      });
      toast.success("Marked as sold");
      fetchListings();
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = filter === "all" ? listings : listings.filter(l => l.category === filter);

  return (
    <div className="space-y-6">
      <div className="page-header flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <div>
            <h1 className="page-title">Buy & Sell</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Community marketplace — buy, sell, or exchange items with neighbours
            </p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm flex items-center gap-2">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Post Listing</>}
        </button>
      </div>

      {showForm && (
        <div className="card animate-in fade-in zoom-in-95 duration-200">
          <h3 className="font-semibold text-sm mb-4">Post an Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Title *</label>
              <input className="input" placeholder="e.g. L-shaped Sofa Set" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input min-h-[80px]" placeholder="Describe the item, its condition, and why you're selling..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" className="input" placeholder="Leave empty for Free / Exchange" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Condition</label>
              <select className="select" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input className="input" placeholder="Optional" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
            </div>
            <div>
              <label className="label">Flat Number</label>
              <input className="input" placeholder="e.g. A-101" value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handlePost} className="btn btn-primary">Post Listing</button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === "all" ? "bg-primary text-white" : "bg-surface border border-border text-text-secondary hover:bg-primary/10"}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilter(c.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === c.value ? "bg-primary text-white" : "bg-surface border border-border text-text-secondary hover:bg-primary/10"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-text-secondary">
          <Package className="w-12 h-12 mx-auto mb-3 text-border" />
          <p>No listings found. Post something to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(l => (
            <div key={l.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-base">{l.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs uppercase font-medium bg-surface px-2 py-0.5 rounded-md border border-border">{l.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${l.condition === "new" ? "bg-success/10 text-success" : l.condition === "like_new" ? "bg-primary/10 text-primary" : "bg-surface border border-border text-text-secondary"}`}>
                      {CONDITIONS.find(c => c.value === l.condition)?.label || l.condition}
                    </span>
                  </div>
                </div>
                <Tag className="w-4 h-4 text-text-secondary" />
              </div>
              {l.description && <p className="text-sm text-text-secondary mb-3 line-clamp-2">{l.description}</p>}
              <div className="flex justify-between items-end mt-auto pt-3 border-t border-border">
                <div>
                  <p className="text-lg font-bold text-primary">{l.price ? formatCurrency(l.price) : "Free"}</p>
                  {l.flatNumber && <p className="text-xs text-text-secondary">Flat: {l.flatNumber}</p>}
                </div>
                <button onClick={() => handleMarkSold(l.id)} className="text-xs text-success hover:underline font-medium">Mark Sold</button>
              </div>
              <p className="text-[10px] text-text-tertiary mt-2">{new Date(l.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
