'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Package,
  Inbox,
  Database,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Grid,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import {
  Blog,
  Product,
  ApplicationItem,
  Inquiry,
  SiteSettings,
  KeepAliveLog
} from '@/lib/types';
import {
  getSiteSettings,
  updateSiteSettings,
  getBlogs,
  saveBlog,
  deleteBlog,
  getProducts,
  saveProduct,
  deleteProduct,
  getApplications,
  saveApplication,
  deleteApplication,
  getInquiries,
  updateInquiryStatus,
  getKeepAliveStatus,
  recordKeepAlivePing,
  INITIAL_SITE_SETTINGS
} from '@/lib/data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'settings' | 'blogs' | 'products' | 'applications' | 'inquiries' | 'keepalive'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [keepAliveData, setKeepAliveData] = useState<{
    lastPing: string;
    status: 'active' | 'pending';
    hoursSinceLastPing: number;
    logs: KeepAliveLog[];
  }>({ lastPing: '', status: 'active', hoursSinceLastPing: 0, logs: [] });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Editing States
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingApplication, setEditingApplication] = useState<Partial<ApplicationItem> | null>(null);
  const [editingSettings, setEditingSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('frk_admin_auth');
      const email = localStorage.getItem('frk_admin_email') || 'admin@frklighting.com';
      setAdminEmail(email);
      if (!isAuth) {
        router.push('/admin/login');
        return;
      }
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [st, bl, pr, ap, inq, ka] = await Promise.all([
        getSiteSettings(),
        getBlogs(),
        getProducts(),
        getApplications(),
        getInquiries(),
        getKeepAliveStatus()
      ]);
      setSettings(st);
      setEditingSettings(st);
      setBlogs(bl);
      setProducts(pr);
      setApplications(ap);
      setInquiries(inq);
      setKeepAliveData(ka);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Helper for uploading image file directly to ImageKit CDN
  const handleFileUpload = async (file: File, onUploaded: (url: string) => void) => {
    setUploadingImage(true);
    showMsg('Uploading image file to ImageKit.io CDN...', 'success');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success && data.url) {
        onUploaded(data.url);
        showMsg('Image successfully uploaded to ImageKit CDN!', 'success');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          onUploaded(reader.result as string);
        };
        reader.readAsDataURL(file);
        showMsg(
          `ImageKit Note: ${data.message || 'Stored as preview. Add IMAGEKIT_PRIVATE_KEY in .env.local for CDN storage.'}`,
          'error'
        );
      }
    } catch (err: any) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploaded(reader.result as string);
      };
      reader.readAsDataURL(file);
      showMsg('Upload error. Saved as local preview.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('frk_admin_auth');
      localStorage.removeItem('frk_admin_email');
    }
    router.push('/admin/login');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSiteSettings(editingSettings);
      setSettings(editingSettings);
      showMsg('Website content and settings saved successfully!');
    } catch (e) {
      showMsg('Failed to update website settings', 'error');
    }
  };

  const handleSaveBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title) return;
    try {
      await saveBlog(editingBlog);
      setEditingBlog(null);
      await loadData();
      showMsg('Blog article saved successfully!');
    } catch (e) {
      showMsg('Failed to save blog article', 'error');
    }
  };

  const handleDeleteBlogClick = async (id: string) => {
    if (confirm('Delete this blog post?')) {
      await deleteBlog(id);
      await loadData();
      showMsg('Blog article deleted.');
    }
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) return;
    try {
      await saveProduct(editingProduct);
      setEditingProduct(null);
      await loadData();
      showMsg('Product saved successfully!');
    } catch (e) {
      showMsg('Failed to save product', 'error');
    }
  };

  const handleDeleteProductClick = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id);
      await loadData();
      showMsg('Product removed.');
    }
  };

  const handleSaveApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication?.title) return;
    try {
      await saveApplication(editingApplication);
      setEditingApplication(null);
      await loadData();
      showMsg('Application area saved successfully!');
    } catch (e) {
      showMsg('Failed to save application area', 'error');
    }
  };

  const handleDeleteApplicationClick = async (id: string) => {
    if (confirm('Delete this application area?')) {
      await deleteApplication(id);
      await loadData();
      showMsg('Application area removed.');
    }
  };

  const handleInquiryStatusChange = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    await updateInquiryStatus(id, status);
    await loadData();
    showMsg(`Inquiry status updated to ${status}`);
  };

  const handleManualKeepAlivePing = async () => {
    try {
      await recordKeepAlivePing('manual', 'Manual ping triggered from admin panel');
      const newStatus = await getKeepAliveStatus();
      setKeepAliveData(newStatus);
      showMsg('Database Keep-Alive Ping Executed Cleanly! Supabase project active.');
    } catch (e) {
      showMsg('Failed to ping database', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#9a6f0c] font-serif text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading Admin Control Panel...
      </div>
    );
  }

  return (
    <div className="py-10 max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#e4e2da] p-6 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#25a244]" />
            <h1 className="text-2xl font-bold font-serif text-[#1f2220]">FRK Admin Panel</h1>
          </div>
          <p className="text-xs text-[#5b605b] mt-1">
            Authenticated as: <strong className="text-[#1f2220] font-mono">{adminEmail}</strong> (.env.local protected)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualKeepAlivePing}
            className="bg-[#25a244] hover:bg-[#208f3b] text-white font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Ping DB Now</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-[#f6f4ee] hover:bg-[#e4e2da] text-[#1f2220] border border-[#c9c7bd] font-semibold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-4 rounded-md border text-xs flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#e4e2da] pb-3">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'settings', label: 'Site Content', icon: Settings },
          { id: 'blogs', label: 'Blogs & Guides', icon: FileText },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'applications', label: 'Applications', icon: Grid },
          { id: 'inquiries', label: `Quotes (${inquiries.filter((i) => i.status === 'new').length})`, icon: Inbox },
          { id: 'keepalive', label: 'DB & Security Check', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E4B241] text-[#1f2220] shadow-xs'
                  : 'bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Blog Articles</span>
              <span className="block text-2xl font-bold font-serif text-[#1f2220]">{blogs.length}</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Active Products</span>
              <span className="block text-2xl font-bold font-serif text-[#1f2220]">{products.length}</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Applications</span>
              <span className="block text-2xl font-bold font-serif text-[#1f2220]">{applications.length}</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">New Inquiries</span>
              <span className="block text-2xl font-bold font-serif text-[#9a6f0c]">
                {inquiries.filter((i) => i.status === 'new').length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">DB Status</span>
              <span className="block text-base font-bold text-emerald-600 font-mono">Active</span>
              <span className="text-[11px] text-[#5b605b] block">Last ping: {keepAliveData.hoursSinceLastPing}h ago</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
            <h2 className="text-xl font-bold font-serif text-[#1f2220]">Recent Inquiries</h2>
            <div className="divide-y divide-[#e4e2da]">
              {inquiries.slice(0, 5).map((inq) => (
                <div key={inq.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#1f2220]">{inq.name}</span>
                    <span className="text-[#5b605b] ml-2">({inq.contact})</span>
                    <p className="text-[#5b605b] mt-0.5">{inq.details}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#f6f4ee] font-semibold text-[#1f2220]">
                    {inq.project_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SITE CONTENT & SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-6">
          <div className="flex items-center justify-between border-b border-[#e4e2da] pb-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Overall Website Content & Hero Banner</h2>
              <p className="text-xs text-[#5b605b]">Edit homepage headers, contact information & hero image.</p>
            </div>
            <button
              type="submit"
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Content & Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Hero Section Title *</label>
              <input
                type="text"
                value={editingSettings.hero_title}
                onChange={(e) => setEditingSettings({ ...editingSettings, hero_title: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Hero Subtitle Paragraph *</label>
              <textarea
                rows={2}
                value={editingSettings.hero_subtitle}
                onChange={(e) => setEditingSettings({ ...editingSettings, hero_subtitle: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            {/* Hero Image Upload to ImageKit */}
            <div className="md:col-span-2 bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2">
              <span className="block text-xs font-bold text-[#1f2220] font-serif">Hero Section Cover Image</span>
              <div>
                <label className="block text-[11px] font-semibold text-[#5b605b] mb-1">
                  Upload Hero Image (Uploads to ImageKit.io CDN)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => {
                        setEditingSettings({ ...editingSettings, hero_image_url: url });
                      });
                    }
                  }}
                  className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer"
                />
              </div>
              {editingSettings.hero_image_url && (
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs text-[#5b605b] font-mono">Current Image:</span>
                  <img
                    src={editingSettings.hero_image_url}
                    alt="Hero Preview"
                    className="w-24 h-14 object-cover rounded border border-[#c9c7bd]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Announcement Top Banner Text</label>
              <input
                type="text"
                value={editingSettings.announcement_banner}
                onChange={(e) => setEditingSettings({ ...editingSettings, announcement_banner: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Phone Number</label>
              <input
                type="text"
                value={editingSettings.phone}
                onChange={(e) => setEditingSettings({ ...editingSettings, phone: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={editingSettings.whatsapp}
                onChange={(e) => setEditingSettings({ ...editingSettings, whatsapp: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Email Address</label>
              <input
                type="email"
                value={editingSettings.email}
                onChange={(e) => setEditingSettings({ ...editingSettings, email: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Instagram Handle</label>
              <input
                type="text"
                value={editingSettings.instagram_handle}
                onChange={(e) => setEditingSettings({ ...editingSettings, instagram_handle: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Service Area Description</label>
              <input
                type="text"
                value={editingSettings.service_area}
                onChange={(e) => setEditingSettings({ ...editingSettings, service_area: e.target.value })}
                className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
              />
            </div>
          </div>
        </form>
      )}

      {/* BLOGS MANAGER TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Blog Articles</h2>
            <button
              onClick={() => setEditingBlog({ title: '', content: '', excerpt: '', published: true })}
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blog Post</span>
            </button>
          </div>

          {editingBlog && (
            <form onSubmit={handleSaveBlogSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
              <h3 className="text-lg font-bold text-[#1f2220] font-serif">
                {editingBlog.id ? 'Edit Blog Article' : 'New Blog Article'}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to size solar street lights"
                  value={editingBlog.title || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Short Excerpt / Summary</label>
                <input
                  type="text"
                  placeholder="Short summary for blog listing"
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              {/* FEATURED BLOG IMAGE (File Upload to ImageKit CDN) */}
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-3">
                <span className="block text-xs font-bold text-[#1f2220] font-serif">Featured Blog Image</span>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5b605b] mb-1">
                    Choose Image File (Uploads directly to ImageKit.io CDN)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          setEditingBlog((prev: Partial<Blog> | null) => (prev ? { ...prev, image_url: url } : null));
                        });
                      }
                    }}
                    className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer disabled:opacity-50"
                  />
                </div>

                {editingBlog.image_url && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-xs text-[#5b605b] font-mono">Selected Image Preview:</span>
                    <img
                      src={editingBlog.image_url}
                      alt="Blog Preview"
                      className="w-20 h-14 object-cover rounded border border-[#c9c7bd]"
                    />
                  </div>
                )}
              </div>

              {/* PREVIOUS, NEXT & RELATED BLOGS OPTIONS */}
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-4">
                <span className="block text-xs font-bold text-[#1f2220] font-serif">Article Navigation & Related Links Options</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1f2220] mb-1">Choose Previous Blog Link</label>
                    <select
                      value={editingBlog.prev_blog_id || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, prev_blog_id: e.target.value || undefined })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                    >
                      <option value="">-- Automatic (Default) --</option>
                      {blogs
                        .filter((b) => b.id !== editingBlog.id)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1f2220] mb-1">Choose Next Blog Link</label>
                    <select
                      value={editingBlog.next_blog_id || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, next_blog_id: e.target.value || undefined })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                    >
                      <option value="">-- Automatic (Default) --</option>
                      {blogs
                        .filter((b) => b.id !== editingBlog.id)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1f2220] mb-1">Choose Related Articles (Select up to 3)</label>
                  <div className="bg-white border border-[#c9c7bd] rounded-md p-3 max-h-36 overflow-y-auto space-y-1.5">
                    {blogs
                      .filter((b) => b.id !== editingBlog.id)
                      .map((b) => {
                        const isSelected = (editingBlog.related_blog_ids || []).includes(b.id);
                        return (
                          <label key={b.id} className="flex items-center gap-2 text-xs text-[#1f2220] cursor-pointer hover:bg-[#f6f4ee] p-1 rounded">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const current = editingBlog.related_blog_ids || [];
                                if (e.target.checked) {
                                  setEditingBlog({ ...editingBlog, related_blog_ids: [...current, b.id] });
                                } else {
                                  setEditingBlog({ ...editingBlog, related_blog_ids: current.filter((id) => id !== b.id) });
                                }
                              }}
                              className="rounded text-[#E4B241] focus:ring-0 cursor-pointer"
                            />
                            <span className="truncate">{b.title}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Article Content (Markdown supported)</label>
                <textarea
                  rows={8}
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs cursor-pointer"
                >
                  Save Blog Article
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-lg border border-[#e4e2da] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {b.image_url && (
                    <img src={b.image_url} alt={b.title} className="w-12 h-12 object-cover rounded border border-[#e4e2da]" />
                  )}
                  <div>
                    <h3 className="font-bold text-[#1f2220] text-sm font-serif">{b.title}</h3>
                    <span className="text-[11px] text-[#5b605b]">
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingBlog(b)} className="text-[#9a6f0c] text-xs font-semibold hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteBlogClick(b.id)} className="text-red-600 text-xs font-semibold hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS MANAGER TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Products & Images</h2>
            <button
              onClick={() => setEditingProduct({ name: '', category: 'All-in-one' })}
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {editingProduct && (
            <form onSubmit={handleSaveProductSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
              <h3 className="text-lg font-bold text-[#1f2220] font-serif">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'All-in-one'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  >
                    <option>All-in-one</option>
                    <option>Split-type</option>
                    <option>Flood Light</option>
                    <option>Landscape</option>
                  </select>
                </div>
              </div>

              {/* Product Image Upload */}
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2">
                <span className="block text-xs font-bold text-[#1f2220] font-serif">Product Image</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => {
                        setEditingProduct((prev: Partial<Product> | null) => (prev ? { ...prev, image_url: url } : null));
                      });
                    }
                  }}
                  className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer"
                />
                {editingProduct.image_url && (
                  <div className="pt-2 flex items-center gap-3">
                    <img src={editingProduct.image_url} alt="Product Preview" className="w-16 h-12 object-cover rounded border" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#E4B241] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs">
                  Save Product
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded border" />}
                    <div>
                      <h3 className="font-bold text-[#1f2220] text-base font-serif">{p.name}</h3>
                      <span className="text-xs text-[#9a6f0c]">{p.category}</span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setEditingProduct(p)} className="text-[#9a6f0c] text-xs font-semibold hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProductClick(p.id)} className="text-red-600 text-xs font-semibold hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#5b605b]">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPLICATIONS MANAGER TAB */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Application Areas & Photos</h2>
            <button
              onClick={() => setEditingApplication({ title: '', description: '' })}
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application Area</span>
            </button>
          </div>

          {editingApplication && (
            <form onSubmit={handleSaveApplicationSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
              <h3 className="text-lg font-bold text-[#1f2220] font-serif">
                {editingApplication.id ? 'Edit Application Area' : 'Add Application Area'}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingApplication.title || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, title: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              {/* Application Photo Upload */}
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2">
                <span className="block text-xs font-bold text-[#1f2220] font-serif">Application Area Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => {
                        setEditingApplication((prev: Partial<ApplicationItem> | null) => (prev ? { ...prev, image_url: url } : null));
                      });
                    }
                  }}
                  className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer"
                />
                {editingApplication.image_url && (
                  <div className="pt-2 flex items-center gap-3">
                    <img src={editingApplication.image_url} alt="App Preview" className="w-16 h-12 object-cover rounded border" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingApplication.description || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, description: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingApplication(null)}
                  className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#E4B241] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs">
                  Save Application Area
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {app.image_url && <img src={app.image_url} alt={app.title} className="w-14 h-12 object-cover rounded border" />}
                    <h3 className="font-bold text-[#1f2220] text-base font-serif">{app.title}</h3>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setEditingApplication(app)} className="text-[#9a6f0c] text-xs font-semibold hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteApplicationClick(app.id)} className="text-red-600 text-xs font-semibold hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#5b605b]">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-serif text-[#1f2220]">Customer Inquiries</h2>
          <div className="bg-white rounded-lg border border-[#e4e2da] overflow-hidden">
            <table className="w-full text-left text-xs text-[#1f2220]">
              <thead className="bg-[#f6f4ee] font-serif font-bold border-b border-[#e4e2da]">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e2da]">
                {inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td className="p-3 font-bold">{inq.name}</td>
                    <td className="p-3">{inq.contact}</td>
                    <td className="p-3">{inq.project_type}</td>
                    <td className="p-3">{inq.details}</td>
                    <td className="p-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as any)}
                        className="bg-white border border-[#c9c7bd] rounded px-2 py-1 text-xs font-semibold text-[#1f2220]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KEEPALIVE & SECURITY DIAGNOSTIC TAB */}
      {activeTab === 'keepalive' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-6">
            <div className="flex items-center justify-between border-b border-[#e4e2da] pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#1f2220]">Database Keep-Alive & Supabase Security</h2>
                <p className="text-xs text-[#5b605b]">Pings Supabase every 2 days automatically to prevent free tier pausing.</p>
              </div>
              <button
                onClick={handleManualKeepAlivePing}
                className="bg-[#25a244] hover:bg-[#208f3b] text-white font-bold px-4 py-2 rounded-md text-xs cursor-pointer"
              >
                Run Ping Now
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da]">
                <span className="text-xs text-[#5b605b] block">Status</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">Active</span>
              </div>

              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da]">
                <span className="text-xs text-[#5b605b] block">Last Ping</span>
                <span className="text-base font-bold text-[#1f2220] font-mono">{keepAliveData.hoursSinceLastPing}h ago</span>
              </div>

              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da]">
                <span className="text-xs text-[#5b605b] block">Next Scheduled</span>
                <span className="text-base font-bold text-[#1f2220] font-mono">{Math.max(0, 48 - keepAliveData.hoursSinceLastPing)}h remaining</span>
              </div>
            </div>

            <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2 text-xs">
              <span className="font-bold text-[#1f2220] font-serif block">Supabase Connection Security Diagnostics</span>
              <p className="text-[#5b605b]">
                Supabase URL: <code className="font-mono text-[#9a6f0c]">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Configured'}</code>
              </p>
              <p className="text-[#5b605b]">
                Authenticated Admin: <code className="font-mono text-[#9a6f0c]">{adminEmail}</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
