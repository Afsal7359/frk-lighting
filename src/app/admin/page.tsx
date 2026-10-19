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
  Image as ImageIcon,
  Star,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Blog,
  Product,
  ApplicationItem,
  Inquiry,
  SiteSettings,
  KeepAliveLog,
  InstallationStory,
  CustomerTestimonial
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
  getInstallationStories,
  saveInstallationStory,
  deleteInstallationStory,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getInquiries,
  updateInquiryStatus,
  getKeepAliveStatus,
  recordKeepAlivePing,
  checkDatabaseSchema,
  DatabaseTableStatus,
  INITIAL_SITE_SETTINGS
} from '@/lib/data';

const MIGRATION_SQL = `-- FRK Lighting Solutions - Supabase Table Creation Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mrnzpihjceyzhorvwdjv/sql

-- 1. Create Installation Stories Table
CREATE TABLE IF NOT EXISTS installation_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    date TEXT,
    rating INT DEFAULT 5,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Customer Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    location TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INT DEFAULT 5,
    avatar_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add any missing columns to existing tables
ALTER TABLE products ADD COLUMN IF NOT EXISTS fixture_image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS lifestyle_image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS prev_blog_id TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS next_blog_id TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS related_blog_ids TEXT[];
ALTER TABLE installation_stories ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE installation_stories ADD COLUMN IF NOT EXISTS rating INT DEFAULT 5;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role TEXT;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE installation_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 5. Create Security Policies (clean recreation)
DROP POLICY IF EXISTS "Public read installation_stories" ON installation_stories;
DROP POLICY IF EXISTS "Public write installation_stories" ON installation_stories;
CREATE POLICY "Public read installation_stories" ON installation_stories FOR SELECT USING (true);
CREATE POLICY "Public write installation_stories" ON installation_stories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public write testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public write testimonials" ON testimonials FOR ALL USING (true);

-- 6. Insert Default Seed Data (Safe: ON CONFLICT DO NOTHING)
INSERT INTO installation_stories (slug, title, location, category, image_url, description, sort_order)
VALUES
('residential-street-lighting', 'Residential Street Lighting', 'Kozhikode, Kerala', 'Solar Street Lights', '/images/frk14.jpg', 'Complete dusk-to-dawn split-type solar street lighting project covering private colony access roads with high lumen efficiency.', 1),
('home-compound-lighting', 'Home Compound Lighting', 'Malappuram, Kerala', 'Residential', '/images/frk15.jpg', 'Villa perimeter solar street lights installed on 5m powder-coated poles ensuring security and zero electricity costs.', 2),
('industrial-area-lighting', 'Industrial Area Lighting', 'Thrissur, Kerala', 'Commercial', '/images/frk16.jpg', 'High-power solar flood lighting across factory dispatch bays, raw material yards, and perimeter security walls.', 3),
('resort-pathway-lighting', 'Resort Pathway Lighting', 'Wayanad, Kerala', 'Solar Street Lights', '/images/frk13.jpg', 'Warm solar path fixtures installed across hillside eco-resort walkways without disrupting landscape soil or roots.', 4),
('village-road-project', 'Village Road Project', 'Kannur, Kerala', 'Solar Street Lights', '/images/frk17.jpg', 'Panchayat road lighting initiative delivering uninterrupted 2-day monsoon backup for rural junctions and curves.', 5),
('commercial-property', 'Commercial Property', 'Kottayam, Kerala', 'Solar Flood Lights', '/images/frk10.jpg', 'Commercial plaza parking and facade lighting powered entirely by rooftop solar arrays and LiFePO4 battery banks.', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO testimonials (name, role, location, comment, rating, avatar_url, sort_order)
VALUES
('Shafeeq', 'Villa Owner', 'Kozhikode, Kerala', 'Very good product and professional installation. The brightness is excellent and working perfectly.', 5, '/images/avatars/user1.svg', 1),
('Ramesh', 'Business Owner', 'Malappuram, Kerala', 'FRK team guided us well from selection to installation. Highly recommended.', 5, '/images/avatars/user2.svg', 2),
('Aji Kumar', 'Estate Owner', 'Kannur, Kerala', 'Very satisfied with the service. Installation was neat and on time.', 5, '/images/avatars/user3.svg', 3),
('Fathima', 'Homeowner', 'Kottayam, Kerala', 'Good quality light and excellent customer support even after installation.', 5, '/images/avatars/user4.svg', 4)
ON CONFLICT DO NOTHING;`;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'settings' | 'blogs' | 'products' | 'applications' | 'stories' | 'testimonials' | 'inquiries' | 'keepalive'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [stories, setStories] = useState<InstallationStory[]>([]);
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [keepAliveData, setKeepAliveData] = useState<{
    lastPing: string;
    status: 'active' | 'pending';
    hoursSinceLastPing: number;
    logs: KeepAliveLog[];
  }>({ lastPing: '', status: 'active', hoursSinceLastPing: 0, logs: [] });

  const [schemaStatus, setSchemaStatus] = useState<{
    checked: boolean;
    isConfigured: boolean;
    allTablesOk: boolean;
    missingTables: string[];
    tables: DatabaseTableStatus[];
  }>({ checked: false, isConfigured: true, allTablesOk: true, missingTables: [], tables: [] });

  const [showMigrationSql, setShowMigrationSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Editing States
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingApplication, setEditingApplication] = useState<Partial<ApplicationItem> | null>(null);
  const [editingStory, setEditingStory] = useState<Partial<InstallationStory> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<CustomerTestimonial> | null>(null);
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
      const [st, bl, pr, ap, inq, ka, str, testm, schema] = await Promise.all([
        getSiteSettings(),
        getBlogs(),
        getProducts(),
        getApplications(),
        getInquiries(),
        getKeepAliveStatus(),
        getInstallationStories(),
        getTestimonials(),
        checkDatabaseSchema()
      ]);
      setSettings(st);
      setEditingSettings(st);
      setBlogs(bl);
      setProducts(pr);
      setApplications(ap);
      setInquiries(inq);
      setKeepAliveData(ka);
      setStories(str);
      setTestimonials(testm);
      setSchemaStatus({ ...schema, checked: true });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCopyMigrationSql = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(MIGRATION_SQL);
      setCopiedSql(true);
      showMsg('Supabase Migration SQL copied to clipboard! Paste in Supabase SQL Editor and click Run.', 'success');
      setTimeout(() => setCopiedSql(false), 3000);
    }
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
      showMsg('Website content and settings saved successfully to Supabase!');
    } catch (err: any) {
      showMsg(`Failed to save settings: ${err?.message || err}`, 'error');
    }
  };

  const handleSaveBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title) return;
    try {
      await saveBlog(editingBlog);
      setEditingBlog(null);
      await loadData();
      showMsg('Blog article saved successfully to Supabase!');
    } catch (err: any) {
      showMsg(`Failed to save blog article: ${err?.message || err}`, 'error');
    }
  };

  const handleDeleteBlogClick = async (id: string) => {
    if (confirm('Delete this blog post?')) {
      try {
        await deleteBlog(id);
        await loadData();
        showMsg('Blog article deleted.');
      } catch (err: any) {
        showMsg(`Failed to delete blog article: ${err?.message || err}`, 'error');
      }
    }
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) return;
    try {
      await saveProduct(editingProduct);
      setEditingProduct(null);
      await loadData();
      showMsg('Product saved successfully to Supabase!');
    } catch (err: any) {
      showMsg(`Failed to save product: ${err?.message || err}`, 'error');
    }
  };

  const handleDeleteProductClick = async (id: string) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteProduct(id);
        await loadData();
        showMsg('Product removed.');
      } catch (err: any) {
        showMsg(`Failed to delete product: ${err?.message || err}`, 'error');
      }
    }
  };

  const handleSaveApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication?.title) return;
    try {
      await saveApplication(editingApplication);
      setEditingApplication(null);
      await loadData();
      showMsg('Application area saved successfully to Supabase!');
    } catch (err: any) {
      showMsg(`Failed to save application area: ${err?.message || err}`, 'error');
    }
  };

  const handleDeleteApplicationClick = async (id: string) => {
    if (confirm('Delete this application area?')) {
      try {
        await deleteApplication(id);
        await loadData();
        showMsg('Application area removed.');
      } catch (err: any) {
        showMsg(`Failed to delete application area: ${err?.message || err}`, 'error');
      }
    }
  };

  const handleSaveStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory?.title) return;
    try {
      await saveInstallationStory(editingStory);
      setEditingStory(null);
      await loadData();
      showMsg('Customer installation story saved successfully to Supabase!');
    } catch (err: any) {
      showMsg(`Failed to save story in database: ${err?.message || err}`, 'error');
    }
  };

  const handleDeleteStoryClick = async (id: string) => {
    if (confirm('Delete this customer story?')) {
      try {
        await deleteInstallationStory(id);
        await loadData();
        showMsg('Story removed.');
      } catch (err: any) {
        showMsg(`Failed to delete story: ${err?.message || err}`, 'error');
      }
    }
  };

  const handleSaveTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name || !editingTestimonial?.comment) return;
    try {
      await saveTestimonial(editingTestimonial);
      setEditingTestimonial(null);
      await loadData();
      showMsg('Customer testimonial saved successfully to Supabase!');
    } catch (err: any) {
      showMsg(`Failed to save testimonial in database: ${err?.message || err}`, 'error');
    }
  };

  const handleDeleteTestimonialClick = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        await loadData();
        showMsg('Testimonial removed.');
      } catch (err: any) {
        showMsg(`Failed to delete testimonial: ${err?.message || err}`, 'error');
      }
    }
  };

  const handleInquiryStatusChange = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    try {
      await updateInquiryStatus(id, status);
      await loadData();
      showMsg(`Inquiry status updated to ${status}`);
    } catch (err: any) {
      showMsg(`Failed to update inquiry status: ${err?.message || err}`, 'error');
    }
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

      {/* Missing Database Schema Alert Banner */}
      {schemaStatus.checked && !schemaStatus.allTablesOk && schemaStatus.missingTables.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-[#1f2220] font-serif">
                    Supabase Database Setup Required
                  </h2>
                  <span className="bg-red-100 text-red-700 text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                    {schemaStatus.missingTables.length} Tables Missing (HTTP 404)
                  </span>
                </div>
                <p className="text-xs text-[#5b605b] leading-relaxed">
                  The following tables are not created in your Supabase project yet:
                  {schemaStatus.missingTables.map((t) => (
                    <span key={t} className="inline-block mx-1 px-1.5 py-0.5 bg-red-100 text-red-900 rounded font-mono font-bold text-[11px] border border-red-200">
                      {t}
                    </span>
                  ))}
                  . Until these tables are created, details saved in Stories and Testimonials cannot be saved to the database.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyMigrationSql}
                className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy Fix SQL'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/mrnzpihjceyzhorvwdjv/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-neutral-50 text-[#1f2220] border border-[#c9c7bd] font-semibold px-3 py-2 rounded-md text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Open Supabase SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setShowMigrationSql(!showMigrationSql)}
                className="bg-[#f6f4ee] hover:bg-[#e4e2da] text-[#1f2220] border border-[#c9c7bd] px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{showMigrationSql ? 'Hide SQL' : 'View SQL'}</span>
                {showMigrationSql ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={loadData}
                className="bg-[#25a244] hover:bg-[#208f3b] text-white font-bold px-3 py-2 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-check DB</span>
              </button>
            </div>
          </div>

          {showMigrationSql && (
            <div className="relative mt-2 bg-[#191c19] text-[#e4e2da] rounded-lg p-4 text-xs font-mono overflow-x-auto max-h-64 border border-neutral-700">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-neutral-700">
                <span className="text-[11px] text-[#E4B241] font-sans font-semibold">
                  Copy and paste this into Supabase SQL Editor, then click RUN:
                </span>
                <button
                  type="button"
                  onClick={handleCopyMigrationSql}
                  className="bg-[#E4B241] text-[#1f2220] text-[11px] font-bold px-2.5 py-1 rounded cursor-pointer"
                >
                  {copiedSql ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <pre>{MIGRATION_SQL}</pre>
            </div>
          )}
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
          { id: 'stories', label: `Customer Stories (${stories.length})`, icon: ImageIcon },
          { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Blog Articles</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{blogs.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Active Products</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{products.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Applications</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{applications.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Customer Stories</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{stories.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Testimonials</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{testimonials.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">New Inquiries</span>
              <span className="block text-xl font-bold font-serif text-[#9a6f0c]">
                {inquiries.filter((i) => i.status === 'new').length}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">DB Sync</span>
              <span className={`block text-sm font-bold font-mono ${schemaStatus.allTablesOk ? 'text-emerald-600' : 'text-amber-600'}`}>
                {schemaStatus.allTablesOk ? 'Healthy' : `${schemaStatus.missingTables.length} Missing`}
              </span>
              <span className="text-[10px] text-[#5b605b] block">Last ping: {keepAliveData.hoursSinceLastPing}h</span>
            </div>
          </div>

          {/* Database Tables Summary Widget in Overview */}
          <div className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#1f2220]">Supabase Tables Sync Status</h2>
                <p className="text-xs text-[#5b605b]">Live status of all required database tables in Supabase.</p>
              </div>
              <button
                type="button"
                onClick={loadData}
                className="text-xs font-semibold text-[#9a6f0c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Status</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {schemaStatus.tables.map((tbl) => (
                <div
                  key={tbl.name}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    tbl.exists
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <span className="font-mono font-semibold truncate text-[11px]">{tbl.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      tbl.exists ? 'bg-emerald-200/70 text-emerald-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {tbl.exists ? 'OK' : '404'}
                  </span>
                </div>
              ))}
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

      {/* CUSTOMER STORIES TAB */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1f2220]">Customer Installation Stories</h2>
              <p className="text-xs text-[#5b605b]">Showcase verified project photos, categories, and client locations.</p>
            </div>
            <button
              onClick={() =>
                setEditingStory({
                  title: '',
                  location: 'Kozhikode, Kerala',
                  category: 'Solar Street Lights',
                  rating: 5,
                  date: 'October 2025',
                  image_url: '/images/products/600w-s1-install.webp',
                  description: ''
                })
              }
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Installation Story</span>
            </button>
          </div>

          {editingStory && (
            <form onSubmit={handleSaveStorySubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
              <h3 className="text-lg font-bold text-[#1f2220] font-serif">
                {editingStory.id ? 'Edit Installation Story' : 'New Installation Story'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Project / Installation Title *</label>
                  <input
                    type="text"
                    required
                    value={editingStory.title || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                    placeholder="e.g. Kozhikode Residential Villa Project"
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Category *</label>
                  <select
                    value={editingStory.category || 'Solar Street Lights'}
                    onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value as any })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  >
                    <option value="Solar Street Lights">Solar Street Lights</option>
                    <option value="Solar Flood Lights">Solar Flood Lights</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={editingStory.location || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                    placeholder="e.g. Kozhikode, Kerala"
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Installation Date</label>
                  <input
                    type="text"
                    value={editingStory.date || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, date: e.target.value })}
                    placeholder="e.g. March 2025"
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Customer Rating</label>
                  <select
                    value={editingStory.rating || 5}
                    onChange={(e) => setEditingStory({ ...editingStory, rating: Number(e.target.value) })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              {/* Story Photo Upload */}
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2">
                <span className="block text-xs font-bold text-[#1f2220] font-serif">Project Site Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => {
                        setEditingStory((prev) => (prev ? { ...prev, image_url: url } : null));
                      });
                    }
                  }}
                  className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer"
                />
                <div className="pt-1 flex items-center gap-3">
                  <input
                    type="text"
                    value={editingStory.image_url || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, image_url: e.target.value })}
                    placeholder="Or paste image URL"
                    className="flex-1 bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                  />
                  {editingStory.image_url && (
                    <img src={editingStory.image_url} alt="Preview" className="w-14 h-10 object-cover rounded border" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Project Description / Summary</label>
                <textarea
                  rows={3}
                  value={editingStory.description || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, description: e.target.value })}
                  placeholder="Detail the installation requirements, lights used, and outcome..."
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#E4B241] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs cursor-pointer">
                  Save Story
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg border border-[#e4e2da] overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-[#1f2220] relative overflow-hidden">
                    <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-black/70 text-[#E4B241] text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {story.category.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-[#1f2220] text-sm font-serif line-clamp-1">{story.title}</h3>
                    <p className="text-[11px] text-[#868379] font-medium flex items-center gap-1">
                      <span>📍 {story.location}</span>
                      {story.date && <span>• {story.date}</span>}
                    </p>
                    <p className="text-xs text-[#5b605b] line-clamp-2">{story.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-[#f0ede6] flex items-center justify-between">
                  <div className="flex items-center text-[#E4B241] text-xs">
                    {'★'.repeat(story.rating || 5)}
                  </div>
                  <div className="space-x-3">
                    <button onClick={() => setEditingStory(story)} className="text-[#9a6f0c] text-xs font-semibold hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteStoryClick(story.id)} className="text-red-600 text-xs font-semibold hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1f2220]">Customer Testimonials</h2>
              <p className="text-xs text-[#5b605b]">Manage client feedback, ratings, and avatar profiles.</p>
            </div>
            <button
              onClick={() =>
                setEditingTestimonial({
                  name: '',
                  role: 'Property Owner',
                  location: 'Kozhikode, Kerala',
                  rating: 5,
                  comment: '',
                  avatar_url: '/images/avatars/user1.svg'
                })
              }
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          {editingTestimonial && (
            <form onSubmit={handleSaveTestimonialSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
              <h3 className="text-lg font-bold text-[#1f2220] font-serif">
                {editingTestimonial.id ? 'Edit Testimonial' : 'New Customer Testimonial'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="e.g. Abdul Rahman K."
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    placeholder="e.g. Villa Owner, Resort Manager"
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.location || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                    placeholder="e.g. Wayanad, Kerala"
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Rating</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-2">Customer Avatar</label>
                <div className="flex items-center gap-3">
                  {['/images/avatars/user1.svg', '/images/avatars/user2.svg', '/images/avatars/user3.svg', '/images/avatars/user4.svg'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditingTestimonial({ ...editingTestimonial, avatar_url: av })}
                      className={`p-1 rounded-full border-2 transition-all ${
                        editingTestimonial.avatar_url === av ? 'border-[#E4B241] scale-110' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={av} alt="Avatar" className="w-10 h-10 rounded-full" />
                    </button>
                  ))}
                  <input
                    type="text"
                    value={editingTestimonial.avatar_url || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar_url: e.target.value })}
                    placeholder="Or custom avatar URL"
                    className="flex-1 bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Customer Review / Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.comment || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                  placeholder="What did the customer say about the lights and service?"
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#E4B241] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs cursor-pointer">
                  Save Testimonial
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-lg border border-[#e4e2da] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar_url || '/images/avatars/user1.svg'} alt={t.name} className="w-10 h-10 rounded-full border" />
                    <div>
                      <h4 className="font-bold text-sm text-[#1f2220] font-serif">{t.name}</h4>
                      <p className="text-[11px] text-[#868379]">{t.role ? `${t.role} • ` : ''}{t.location}</p>
                    </div>
                  </div>
                  <div className="text-amber-500 text-xs">
                    {'★'.repeat(t.rating || 5)}
                  </div>
                  <p className="text-xs text-[#5b605b] italic leading-relaxed">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0ede6] flex items-center justify-end space-x-3">
                  <button onClick={() => setEditingTestimonial(t)} className="text-[#9a6f0c] text-xs font-semibold hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTestimonialClick(t.id)} className="text-red-600 text-xs font-semibold hover:underline">
                    Delete
                  </button>
                </div>
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

            {/* Complete Tables Health Audit */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1f2220] font-serif">Database Tables Schema Audit</h3>
                  <p className="text-xs text-[#5b605b]">Status of all 8 database tables in your Supabase project.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyMigrationSql}
                    className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied' : 'Copy Migration SQL'}</span>
                  </button>
                  <a
                    href="https://supabase.com/dashboard/project/mrnzpihjceyzhorvwdjv/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-[#c9c7bd] hover:bg-neutral-50 text-[#1f2220] font-semibold px-3 py-1.5 rounded text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Supabase SQL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="border border-[#e4e2da] rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs text-[#1f2220]">
                  <thead className="bg-[#f6f4ee] font-serif font-bold border-b border-[#e4e2da]">
                    <tr>
                      <th className="p-3">Table Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Details / Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e2da]">
                    {schemaStatus.tables.map((tbl) => (
                      <tr key={tbl.name} className={!tbl.exists ? 'bg-red-50/50' : ''}>
                        <td className="p-3 font-mono font-bold text-xs">{tbl.name}</td>
                        <td className="p-3">
                          {tbl.exists ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ready (200 OK)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 font-bold px-2 py-0.5 rounded text-[11px]">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Missing (404 Not Found)</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#5b605b]">
                          {tbl.exists
                            ? 'Synced with Supabase database schema.'
                            : 'Table missing in database. Run migration script to create.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
