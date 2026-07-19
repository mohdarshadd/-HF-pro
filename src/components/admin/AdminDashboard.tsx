"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import OrdersList from "./OrdersList";

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  hasSizes: boolean;
  sizes: { label: string; price: number }[];
  price: number;
  isAvailable: boolean;
  isVeg: boolean;
}

const categoryOptions = [
  "Classic", "Simple Veg", "Veg Favorite", "Supreme", "Ultimate",
  "Pizza Mania - Single Topping", "Pizza Mania - Double Topping", "Yummy Pizza",
  "Burgers", "Sandwich", "Pasta", "Garlic Bread", "Fries", "Wraps",
  "Salad", "Sides", "Shakes", "Coffee", "Mocktails", "Drinks", "Rolls", "Combos",
];

export default function AdminDashboard() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("orders");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    category: "Classic",
    hasSizes: false,
    sizes: [{ label: "Small", price: 0 }, { label: "Medium", price: 0 }, { label: "Large", price: 0 }],
    price: 0,
    isAvailable: true,
    isVeg: true,
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setItems(data);
    } catch {
      console.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: "Classic",
      hasSizes: false,
      sizes: [{ label: "Small", price: 0 }, { label: "Medium", price: 0 }, { label: "Large", price: 0 }],
      price: 0,
      isAvailable: true,
      isVeg: true,
    });
    setEditingItem(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (item: FoodItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      hasSizes: item.hasSizes,
      sizes: item.sizes.length > 0 ? item.sizes : [{ label: "Small", price: 0 }, { label: "Medium", price: 0 }, { label: "Large", price: 0 }],
      price: item.price,
      isAvailable: item.isAvailable,
      isVeg: item.isVeg,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = editingItem
        ? { id: editingItem._id, ...form }
        : form;

      const res = await fetch("/api/admin/menu", {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchItems();
      }
    } catch {
      console.error("Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch {
      console.error("Failed to delete item");
    }
  };

  const toggleAvailability = async (item: FoodItem) => {
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id, isAvailable: !item.isAvailable }),
      });
      if (res.ok) fetchItems();
    } catch {
      console.error("Failed to update item");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = filter ? item.category === filter : true;
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const uniqueCategories = [...new Set(items.map((i) => i.category))];
  const availableCount = items.filter((i) => i.isAvailable).length;
  const outOfStockCount = items.filter((i) => !i.isAvailable).length;

  return (
    <div className="min-h-screen bg-cream/30">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        menuCount={items.length}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === "orders" ? (
          <OrdersList />
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-2xl border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{items.length}</p>
                    <p className="text-xs text-muted">Total Items</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-veg/5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-veg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{availableCount}</p>
                    <p className="text-xs text-muted">In Stock</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{outOfStockCount}</p>
                    <p className="text-xs text-muted">Out of Stock</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{uniqueCategories.length}</p>
                    <p className="text-xs text-muted">Categories</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 w-full">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search items..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted/50"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shrink-0"
                >
                  <option value="">All</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={openAdd}
                className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-hover transition-all active:scale-[0.98] flex items-center justify-center gap-2 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Item
              </button>
            </div>

            {/* Menu Table */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-border/50 p-16 text-center">
                <div className="inline-flex items-center gap-2 text-muted">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading menu items...
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border/50 p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {search || filter ? "No matching items" : "No items yet"}
                </h3>
                <p className="text-sm text-muted mb-4">
                  {search || filter ? "Try a different search or filter" : "Add your first menu item to get started"}
                </p>
                {!search && !filter && (
                  <button
                    onClick={openAdd}
                    className="text-sm font-semibold text-brand hover:underline"
                  >
                    + Add your first item
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider">Name</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider">Category</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider">Price</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider">Status</th>
                        <th className="text-right px-5 py-3.5 font-semibold text-muted text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, idx) => (
                        <tr
                          key={item._id}
                          className={`border-b border-border/30 last:border-b-0 transition-colors hover:bg-cream/20 ${
                            idx % 2 === 0 ? "bg-white" : "bg-cream/5"
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? "bg-veg" : "bg-nonveg"}`} />
                              <span className="font-medium text-foreground truncate max-w-[200px]">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-muted">
                            <span className="inline-flex px-2 py-0.5 rounded-md bg-cream/50 text-xs font-medium">{item.category}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            {item.hasSizes ? (
                              <div className="space-y-0.5">
                                {item.sizes.map((s) => (
                                  <div key={s.label} className="text-xs text-muted">
                                    {s.label}: <span className="font-medium text-foreground">₹{s.price}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="font-semibold text-foreground">₹{item.price}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                              item.isVeg ? "bg-veg/5 text-veg" : "bg-nonveg/5 text-nonveg"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-veg" : "bg-nonveg"}`} />
                              {item.isVeg ? "Veg" : "Non-veg"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => toggleAvailability(item)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                item.isAvailable
                                  ? "bg-veg/5 text-veg hover:bg-veg/10"
                                  : "bg-muted/5 text-muted hover:bg-muted/10"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? "bg-veg" : "bg-muted/40"}`} />
                              {item.isAvailable ? "In Stock" : "Out of Stock"}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEdit(item)}
                                className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/5 transition-all"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden divide-y divide-border/30">
                  {filteredItems.map((item) => (
                    <div key={item._id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? "bg-veg" : "bg-nonveg"}`} />
                            <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                          </div>
                          <p className="text-xs text-muted mb-1.5">{item.category}</p>
                          {item.hasSizes ? (
                            <div className="flex flex-wrap gap-2">
                              {item.sizes.map((s) => (
                                <span key={s.label} className="text-xs text-muted">
                                  {s.label}: <span className="font-medium text-foreground">₹{s.price}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-foreground">₹{item.price}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleAvailability(item)}
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                              item.isAvailable ? "bg-veg/10 text-veg" : "bg-muted/10 text-muted"
                            }`}
                          >
                            {item.isAvailable ? "In Stock" : "Out"}
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand/5 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => { setShowForm(false); resetForm(); }}
          />
          <div className="fixed inset-4 sm:inset-auto sm:top-[5vh] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl z-50 overflow-y-auto max-h-[90vh] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editingItem ? "Edit Item" : "Add New Item"}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {editingItem ? "Update the item details below" : "Fill in the details for the new item"}
                </p>
              </div>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="p-2 rounded-lg hover:bg-cream transition-colors text-muted hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Item Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-cream/10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted/50"
                  placeholder="e.g. Margherita Pizza"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-cream/10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 bg-cream/30 border border-border/50 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-cream/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.isVeg}
                    onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-brand focus:ring-brand/30"
                  />
                  <span className="text-sm">Veg</span>
                </label>
                <label className="flex items-center gap-2.5 bg-cream/30 border border-border/50 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-cream/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.hasSizes}
                    onChange={(e) => setForm({ ...form, hasSizes: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-brand focus:ring-brand/30"
                  />
                  <span className="text-sm">Sizes</span>
                </label>
                <label className="flex items-center gap-2.5 bg-cream/30 border border-border/50 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-cream/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-brand focus:ring-brand/30"
                  />
                  <span className="text-sm">Available</span>
                </label>
              </div>

              {/* Price / Sizes */}
              {form.hasSizes ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Sizes & Prices</label>
                  <div className="space-y-2">
                    {form.sizes.map((size, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={size.label}
                          onChange={(e) => {
                            const newSizes = [...form.sizes];
                            newSizes[idx].label = e.target.value;
                            setForm({ ...form, sizes: newSizes });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-border text-sm bg-cream/10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                          placeholder="Size name"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">₹</span>
                          <input
                            type="number"
                            value={size.price || ""}
                            onChange={(e) => {
                              const newSizes = [...form.sizes];
                              newSizes[idx].price = Number(e.target.value);
                              setForm({ ...form, sizes: newSizes });
                            }}
                            className="w-24 pl-7 pr-3 py-2 rounded-xl border border-border text-sm bg-cream/10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = form.sizes.filter((_, i) => i !== idx);
                            setForm({ ...form, sizes: newSizes });
                          }}
                          className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, sizes: [...form.sizes, { label: "", price: 0 }] })}
                      className="text-xs font-medium text-brand hover:underline flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add size
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">₹</span>
                    <input
                      type="number"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      required
                      min="0"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border text-sm bg-cream/10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted/50"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:bg-cream transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-all active:scale-[0.98]"
                >
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
