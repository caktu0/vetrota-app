"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BlogPostItem } from "@/types";
import {
  BookOpen,
  Mail,
  Send,
  Calendar,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  Share2,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  PenTool,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BlogPage() {
  const { role, blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, subscribeNewsletter, showToast, currentUser } = useApp();
  const [emailInput, setEmailInput] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);

  // Vet Blog Management Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Aşı & Koruyucu Sağlık");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formReadTime, setFormReadTime] = useState("4 dk okuma");
  const [formAuthor, setFormAuthor] = useState(currentUser.name ? `Dr. ${currentUser.name} ${currentUser.surname || ""}` : "Dr. Selin Aydın");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes("@")) {
      showToast("Lütfen geçerli bir e-posta adresi giriniz.", "warning");
      return;
    }
    const success = subscribeNewsletter(emailInput);
    if (success) setEmailInput("");
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormCategory("Aşı & Koruyucu Sağlık");
    setFormSummary("");
    setFormContent("");
    setFormImageUrl("https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80");
    setFormReadTime("4 dk okuma");
    setFormAuthor(`Dr. ${currentUser.name} ${currentUser.surname || ""}`);
    setIsBlogModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, post: BlogPostItem) => {
    e.stopPropagation();
    setEditingPost(post);
    setFormTitle(post.title);
    setFormCategory(post.category);
    setFormSummary(post.summary);
    setFormContent(post.content);
    setFormImageUrl(post.imageUrl || "");
    setFormReadTime(post.readTime);
    setFormAuthor(post.author);
    setIsBlogModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) {
      deleteBlogPost(id);
    }
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      showToast("Lütfen başlık ve içerik alanlarını doldurunuz.", "warning");
      return;
    }

    if (editingPost) {
      updateBlogPost(editingPost.id, {
        title: formTitle,
        category: formCategory,
        summary: formSummary,
        content: formContent,
        imageUrl: formImageUrl || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
        readTime: formReadTime,
        author: formAuthor,
      });
    } else {
      addBlogPost({
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        category: formCategory,
        summary: formSummary,
        content: formContent,
        imageUrl: formImageUrl || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
        readTime: formReadTime,
        author: formAuthor,
      });
    }

    setIsBlogModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C67B5C] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            {role === "VET" ? "Hekim Blog & Makale Yönetimi" : "Haftalık Veterinerlik Bülteni & Blog"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2D241E]">
            {role === "VET" ? "Sağlık Makaleleri & İçerik Paneli" : "Patili Dostlar İçin Sağlık Rehberi"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C3D2E]/80">
            {role === "VET"
              ? "Hasta sahiplerini bilgilendirmek için yeni yazılar ekleyin veya mevcut makaleleri düzenleyin."
              : "Uzman veteriner hekimlerimiz tarafından hazırlanan güncel ve bilimsel bakım makaleleri."}
          </p>
        </div>

        {/* Vet-Only 'Add Post' CTA Button */}
        {role === "VET" && (
          <Button
            onClick={handleOpenAdd}
            className="bg-[#6B7B3C] hover:bg-[#586630] text-white font-bold rounded-xl h-11 px-5 gap-2 shadow-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Yeni Makale Yayınla
          </Button>
        )}
      </div>

      {/* 1. Weekly Newsletter Subscription Box (Only for user role) */}
      {role === "USER" && (
        <section className="rounded-[24px] bg-gradient-to-br from-[#FFF5EB] to-[#F5ECE1] border border-[#E8DFD3] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C67B5C]/15 text-[#C67B5C] text-xs font-bold">
              <Mail className="w-3.5 h-3.5" />
              Haftalık E-Bülten Aboneliği
            </div>
            <h2 className="text-2xl font-heading font-bold text-[#2D241E]">
              Her Cuma dostunuzun sağlığına özel ipuçları gelen kutunuzda!
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3D2E]">
              Mevsimsel parazit uyarıları, aşı hatırlatmaları, beslenme tavsiyeleri ve hekim önerilerini kaçırmayın.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-lg">
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="E-posta adresinizi giriniz..."
              className="rounded-xl border-[#E8DFD3] bg-white text-sm h-12"
              required
            />
            <Button
              type="submit"
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl h-12 px-6 shadow-sm gap-2"
            >
              <Send className="w-4 h-4" />
              Abone Ol
            </Button>
          </form>

          <div className="flex items-center gap-3 text-xs text-[#8B7355] pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7B3C]" /> Spam yok
            </span>
            <span>•</span>
            <span>İstediğiniz zaman tek tıkla ayrılabilirsiniz.</span>
          </div>
        </section>
      )}

      {/* 2. Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-[#E8DFD3] hover:border-[#C67B5C]/50 rounded-[22px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative"
            onClick={() => setSelectedPost(post)}
          >
            <div className="relative h-48 w-full overflow-hidden bg-[#F4EFE6]">
              <img
                src={post.imageUrl || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#FDFBF7]/95 backdrop-blur-sm text-[#C67B5C] font-bold text-[11px] px-3 py-1 rounded-full shadow-sm border border-[#E8DFD3]">
                {post.category}
              </span>

              {/* Vet Management Actions (Edit / Delete) */}
              {role === "VET" && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={(e) => handleOpenEdit(e, post)}
                    className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#2D241E] flex items-center justify-center shadow-md hover:scale-105 transition-all"
                    title="Yazıyı Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#6B7B3C]" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, post.id)}
                    className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#B91C1C] flex items-center justify-center shadow-md hover:scale-105 transition-all"
                    title="Yazıyı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#B91C1C]" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-[#8B7355]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.publishedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-[#2D241E] group-hover:text-[#C67B5C] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-[#5C3D2E]/80 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F4EFE6] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8B7355] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#C67B5C]" />
                  {post.author}
                </span>

                <span className="text-xs font-bold text-[#C67B5C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Yazıyı Oku
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal (Read-Only) */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="relative h-60 w-full overflow-hidden flex-shrink-0">
              <img
                src={selectedPost.imageUrl || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80"}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-[#2D241E] hover:bg-white flex items-center justify-center font-bold shadow-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center gap-3 text-xs text-[#8B7355]">
                <span className="bg-[#C67B5C]/10 text-[#C67B5C] font-bold px-2.5 py-0.5 rounded-full">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span>{selectedPost.publishedDate}</span>
                <span>•</span>
                <span>{selectedPost.author}</span>
              </div>

              <h2 className="text-2xl font-heading font-bold text-[#2D241E] leading-tight">
                {selectedPost.title}
              </h2>

              {selectedPost.summary && (
                <p className="text-sm font-semibold text-[#C67B5C] bg-[#FFF5EB] p-3.5 rounded-xl border border-[#C67B5C]/20">
                  {selectedPost.summary}
                </p>
              )}

              <div className="text-sm text-[#2D241E] leading-relaxed whitespace-pre-wrap font-normal space-y-3">
                {selectedPost.content}
              </div>

              <div className="pt-6 border-t border-[#E8DFD3] flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: selectedPost.title, url: window.location.href });
                    } else {
                      showToast("Bağlantı panoya kopyalandı.", "info");
                    }
                  }}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Paylaş
                </Button>

                <Button
                  onClick={() => setSelectedPost(null)}
                  className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vet Blog Create / Edit Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-xl font-heading font-bold text-[#2D241E] flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#6B7B3C]" />
                {editingPost ? "Makaleyi Düzenle" : "Yeni Blog Yazısı Ekle"}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EFE6] text-[#2D241E] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Makale Başlığı:
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Örn: Kedilerde Diş Sağlığı ve Ağız Bakımı"
                  className="bg-white rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
                  >
                    <option value="Aşı & Koruyucu Sağlık">Aşı & Koruyucu Sağlık</option>
                    <option value="Pati & Bakım">Pati & Bakım</option>
                    <option value="Paraziter Tedavi">Paraziter Tedavi</option>
                    <option value="Geriatrik Bakım">Geriatrik Bakım</option>
                    <option value="Beslenme & Diyet">Beslenme & Diyet</option>
                    <option value="Acil & İlk Yardım">Acil & İlk Yardım</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Okuma Süresi:
                  </label>
                  <Input
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="Örn: 4 dk okuma"
                    className="bg-white rounded-xl border-[#E8DFD3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Kısa Özet:
                </label>
                <Input
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Kart üzerinde görünecek kısa açıklama..."
                  className="bg-white rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Görsel URL:
                </label>
                <Input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-white rounded-xl border-[#E8DFD3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Makale İçeriği (Tam Metin):
                </label>
                <textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Yazınızın detaylarını, tavsiyelerinizi ve maddeleri buraya yazın..."
                  className="w-full p-3 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B7B3C]/30 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DFD3]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#6B7B3C] hover:bg-[#586630] text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  {editingPost ? "Değişiklikleri Kaydet" : "Makaleyi Yayınla"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
