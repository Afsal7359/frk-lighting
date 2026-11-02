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
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  Wrench,
  ListOrdered,
  MapPin,
  Compass,
  FileCheck,
  CalendarCheck,
  Headphones,
  Sparkles,
  Zap,
  Truck,
  Maximize2
} from 'lucide-react';
import OnSitePreviewModal from '@/components/OnSitePreviewModal';
import {
  Blog,
  Product,
  ApplicationItem,
  Inquiry,
  SiteSettings,
  KeepAliveLog,
  InstallationStory,
  CustomerTestimonial,
  InstallationServiceItem,
  InstallationProcessStep,
  InstallationPageSettings
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
  INITIAL_SITE_SETTINGS,
  INITIAL_INSTALLATION_PAGE_SETTINGS,
  getInstallationPageSettings,
  updateInstallationPageSettings,
  getInstallationServices,
  saveInstallationService,
  deleteInstallationService,
  getInstallationProcessSteps,
  saveInstallationProcessStep,
  deleteInstallationProcessStep
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
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS lifestyle_images TEXT[];
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
    'overview' | 'settings' | 'blogs' | 'products' | 'applications' | 'installation' | 'stories' | 'testimonials' | 'inquiries' | 'keepalive'
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
  const [installationSettings, setInstallationSettings] = useState<InstallationPageSettings>(INITIAL_INSTALLATION_PAGE_SETTINGS);
  const [editingInstallationSettings, setEditingInstallationSettings] = useState<InstallationPageSettings>(INITIAL_INSTALLATION_PAGE_SETTINGS);
  const [installationServices, setInstallationServices] = useState<InstallationServiceItem[]>([]);
  const [editingInstallationService, setEditingInstallationService] = useState<Partial<InstallationServiceItem> | null>(null);
  const [installationProcessSteps, setInstallationProcessSteps] = useState<InstallationProcessStep[]>([]);
  const [editingProcessStep, setEditingProcessStep] = useState<Partial<InstallationProcessStep> | null>(null);
  const [activeInstallationSubTab, setActiveInstallationSubTab] = useState<'cards' | 'steps' | 'settings'>('cards');
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
  const [productUrlInput, setProductUrlInput] = useState('');
  const [lifestyleUrlInput, setLifestyleUrlInput] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);
  const [editingApplication, setEditingApplication] = useState<Partial<ApplicationItem> | null>(null);
  const [editingStory, setEditingStory] = useState<Partial<InstallationStory> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<CustomerTestimonial> | null>(null);
  const [editingSettings, setEditingSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/admin/verify');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/admin/login');
          return;
        }
        if (isMounted) {
          setAdminEmail(data.email || 'admin@frklighting.com');
          loadData();
        }
      } catch {
        router.push('/admin/login');
      }
    };
    verifyAuth();
    return () => { isMounted = false; };
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [st, bl, pr, ap, inq, ka, str, testm, schema, instSet, instServ, instSteps] = await Promise.all([
        getSiteSettings(),
        getBlogs(),
        getProducts(),
        getApplications(),
        getInquiries(),
        getKeepAliveStatus(),
        getInstallationStories(),
        getTestimonials(),
        checkDatabaseSchema(),
        getInstallationPageSettings(),
        getInstallationServices(),
        getInstallationProcessSteps()
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
      setInstallationSettings(instSet);
      setEditingInstallationSettings(instSet);
      setInstallationServices(instServ);
      setInstallationProcessSteps(instSteps);
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('frk_admin_auth');
      localStorage.removeItem('frk_admin_email');
    }
    router.push('/admin/login');
    router.refresh();
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

  const handleStartEditProduct = (p: Product) => {
    const productImages =
      p.images && p.images.length > 0
        ? [...p.images]
        : (p.specs as any)?.images && (p.specs as any).images.length > 0
          ? [...(p.specs as any).images]
          : [p.fixture_image_url || p.image_url].filter(Boolean) as string[];

    const mainImg = p.fixture_image_url || p.image_url || productImages[0] || '';
    if (mainImg && !productImages.includes(mainImg)) {
      productImages.unshift(mainImg);
    }

    setEditingProduct({
      ...p,
      images: productImages,
      fixture_image_url: mainImg,
      image_url: mainImg,
      lifestyle_image_url: p.lifestyle_image_url || ''
    });
    setProductUrlInput('');
    setLifestyleUrlInput('');
  };

  const handleMultipleProductFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploadingImage(true);
    showMsg(`Uploading ${fileArray.length} product image(s) to ImageKit CDN...`, 'success');

    const newUrls: string[] = [];

    for (const file of fileArray) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
        } else {
          await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result) newUrls.push(reader.result as string);
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    setEditingProduct((prev) => {
      if (!prev) return null;
      const existing = prev.images || [];
      const combined = [...existing, ...newUrls];
      const main = prev.fixture_image_url || prev.image_url || combined[0] || '';
      return {
        ...prev,
        images: combined,
        fixture_image_url: main,
        image_url: main
      };
    });

    setUploadingImage(false);
    showMsg(`Uploaded ${newUrls.length} product image(s) successfully!`, 'success');
  };

  const handleAddProductImageUrl = () => {
    if (!productUrlInput.trim()) return;
    const url = productUrlInput.trim();
    setEditingProduct((prev) => {
      if (!prev) return null;
      const existing = prev.images || [];
      if (existing.includes(url)) return prev;
      const combined = [...existing, url];
      const main = prev.fixture_image_url || prev.image_url || combined[0] || '';
      return {
        ...prev,
        images: combined,
        fixture_image_url: main,
        image_url: main
      };
    });
    setProductUrlInput('');
    showMsg('Image URL added to product photos.');
  };

  const handleSetMainProductImage = (imgUrl: string) => {
    setEditingProduct((prev) => {
      if (!prev) return null;
      const currentImages = prev.images || [];
      const reordered = [imgUrl, ...currentImages.filter((u) => u !== imgUrl)];
      return {
        ...prev,
        fixture_image_url: imgUrl,
        image_url: imgUrl,
        images: reordered
      };
    });
    showMsg('Set as primary cover image!');
  };

  const handleRemoveProductImage = (imgUrl: string) => {
    setEditingProduct((prev) => {
      if (!prev) return null;
      const remaining = (prev.images || []).filter((u) => u !== imgUrl);
      const isMain = prev.fixture_image_url === imgUrl || prev.image_url === imgUrl;
      const nextMain = isMain ? (remaining[0] || '') : (prev.fixture_image_url || '');
      return {
        ...prev,
        images: remaining,
        fixture_image_url: nextMain,
        image_url: nextMain
      };
    });
  };

  const handleMoveProductImage = (index: number, direction: 'left' | 'right') => {
    setEditingProduct((prev) => {
      if (!prev || !prev.images) return prev;
      const images = [...prev.images];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= images.length) return prev;
      const temp = images[index];
      images[index] = images[targetIndex];
      images[targetIndex] = temp;
      return { ...prev, images };
    });
  };

  const handleUploadLifestyleFile = async (file: File) => {
    handleFileUpload(file, (url) => {
      setEditingProduct((prev) => (prev ? { ...prev, lifestyle_image_url: url } : null));
    });
  };

  const handleAddLifestyleUrl = () => {
    if (!lifestyleUrlInput.trim()) return;
    const url = lifestyleUrlInput.trim();
    setEditingProduct((prev) => (prev ? { ...prev, lifestyle_image_url: url } : null));
    setLifestyleUrlInput('');
    showMsg('On-site installation photo URL saved.');
  };

  const handleSaveApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication?.title) return;
    try {
      await saveApplication(editingApplication);
      setEditingApplication(null);
      await loadData();
      showMsg('Lighting solution saved successfully to Supabase!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showMsg(`Failed to save lighting solution: ${msg}`, 'error');
    }
  };

  const handleDeleteApplicationClick = async (id: string) => {
    if (confirm('Delete this lighting solution?')) {
      try {
        await deleteApplication(id);
        await loadData();
        showMsg('Lighting solution removed.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showMsg(`Failed to delete lighting solution: ${msg}`, 'error');
      }
    }
  };

  const handleSaveInstallationSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInstallationPageSettings(editingInstallationSettings);
      setInstallationSettings(editingInstallationSettings);
      showMsg('Installation page settings saved successfully to Supabase!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showMsg(`Failed to save installation settings: ${msg}`, 'error');
    }
  };

  const handleSaveInstallationServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstallationService?.title) return;
    try {
      await saveInstallationService(editingInstallationService);
      setEditingInstallationService(null);
      await loadData();
      showMsg('Installation service topic saved successfully to Supabase!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showMsg(`Failed to save installation service: ${msg}`, 'error');
    }
  };

  const handleDeleteInstallationServiceClick = async (id: string) => {
    if (confirm('Delete this installation service topic?')) {
      try {
        await deleteInstallationService(id);
        await loadData();
        showMsg('Installation service topic removed.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showMsg(`Failed to delete installation service: ${msg}`, 'error');
      }
    }
  };

  const handleSaveProcessStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProcessStep?.name) return;
    try {
      await saveInstallationProcessStep(editingProcessStep);
      setEditingProcessStep(null);
      await loadData();
      showMsg('Process workflow stage saved successfully to Supabase!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showMsg(`Failed to save process stage: ${msg}`, 'error');
    }
  };

  const handleDeleteProcessStepClick = async (id: string) => {
    if (confirm('Delete this process workflow stage?')) {
      try {
        await deleteInstallationProcessStep(id);
        await loadData();
        showMsg('Process workflow stage removed.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showMsg(`Failed to delete process stage: ${msg}`, 'error');
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
          { id: 'applications', label: 'Lighting Solutions', icon: Grid },
          { id: 'installation', label: `Installation Services (${installationServices.length})`, icon: Wrench },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Blog Articles</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{blogs.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Active Products</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{products.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Lighting Solutions</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{applications.length}</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e4e2da] space-y-1">
              <span className="text-xs text-[#5b605b]">Installation Services</span>
              <span className="block text-xl font-bold font-serif text-[#1f2220]">{installationServices.length}</span>
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

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#1f2220] mb-1">Office Location / Address</label>
              <input
                type="text"
                value={editingSettings.address || ''}
                onChange={(e) => setEditingSettings({ ...editingSettings, address: e.target.value })}
                placeholder="Ramanattukara, Kinfra Advanced Technology Park, Kerala"
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
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Products & Images</h2>
              <p className="text-xs text-[#7d827d] mt-0.5">
                Manage catalog specs, multiple product fixture photos, and real on-site installation photos.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  category: 'All-in-one',
                  wattage_range: '',
                  subtitle: '',
                  description: '',
                  best_for: '',
                  why_choose: '',
                  keep_in_mind: '',
                  images: [],
                  fixture_image_url: '',
                  image_url: '',
                  lifestyle_image_url: '',
                  is_active: true
                });
                setProductUrlInput('');
                setLifestyleUrlInput('');
              }}
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {editingProduct && (
            <form onSubmit={handleSaveProductSubmit} className="bg-white p-6 rounded-xl border border-[#e4e2da] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#e4e2da] pb-3">
                <h3 className="text-lg font-bold text-[#1f2220] font-serif flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#9a6f0c]" />
                  <span>{editingProduct.id ? `Edit: ${editingProduct.name || 'Product'}` : 'Add New Solar Product'}</span>
                </h3>
                <span className="text-xs font-semibold text-[#7d827d]">
                  {editingProduct.slug ? `Code: ${editingProduct.slug.toUpperCase()}` : 'New Entry'}
                </span>
              </div>

              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#1f2220] uppercase tracking-wider font-serif">
                  1. Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Solar Streetlight 600W-S1"
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] focus:ring-1 focus:ring-[#E4B241]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Category *</label>
                    <select
                      value={editingProduct.category || 'All-in-one'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] focus:ring-1 focus:ring-[#E4B241]"
                    >
                      <option>All-in-one</option>
                      <option>Split-type</option>
                      <option>Commercial</option>
                      <option>Architectural & Landscape</option>
                      <option>Heavy-Duty Commercial</option>
                      <option>Municipal & Highway Grade</option>
                      <option>Flood Light</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Wattage & Panel Rating</label>
                    <input
                      type="text"
                      value={editingProduct.wattage_range || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, wattage_range: e.target.value })}
                      placeholder="e.g. 600W (60W Solar Panel)"
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] focus:ring-1 focus:ring-[#E4B241]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Subtitle / Headline</label>
                  <input
                    type="text"
                    value={editingProduct.subtitle || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                    placeholder="e.g. Compact All-In-One Dusk-To-Dawn Solar Street Light"
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] focus:ring-1 focus:ring-[#E4B241]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Describe housing material, IP ingress rating, solar cell efficiency, battery chemistry, and suitability..."
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] focus:ring-1 focus:ring-[#E4B241]"
                  />
                </div>
              </div>

              {/* SECTION 2: SET 1 - PRODUCT FIXTURE IMAGES (MULTIPLE IMAGES + MAIN CHOOSE) */}
              <div className="bg-[#fbf9f4] p-5 rounded-xl border border-[#e4e2da] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e4e2da] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#9a6f0c]" />
                      <h4 className="text-sm font-bold text-[#1f2220] font-serif">
                        Set 1: Product Fixture Photos (Multiple Image Support)
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#5b605b] mt-0.5">
                      Upload multiple angles, close-ups, and catalog views. Click <strong className="text-[#9a6f0c]">Set as Main</strong> to select the primary cover photo for website product cards.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#1f2220] text-white shrink-0 self-start sm:self-center">
                    {editingProduct.images?.length || 0} Photos Added
                  </span>
                </div>

                {/* Upload & Add URL Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[#e4e2da] space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1f2220]">
                      Upload Multiple Image Files (to ImageKit CDN)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleMultipleProductFiles(e.target.files);
                        }
                      }}
                      className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer"
                    />
                    <span className="block text-[10px] text-[#7d827d]">
                      Tip: You can select multiple files at once.
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#e4e2da] space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1f2220]">
                      Or Add by Direct Image URL / Path
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={productUrlInput}
                        onChange={(e) => setProductUrlInput(e.target.value)}
                        placeholder="https://... or /images/products/..."
                        className="flex-1 bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                      />
                      <button
                        type="button"
                        onClick={handleAddProductImageUrl}
                        className="bg-[#1f2220] text-white font-semibold px-3 py-1.5 rounded-md text-xs hover:bg-black transition-colors shrink-0"
                      >
                        + Add Photo
                      </button>
                    </div>
                    <span className="block text-[10px] text-[#7d827d]">
                      Works with ImageKit URLs, Supabase Storage, or local public paths.
                    </span>
                  </div>
                </div>

                {/* Multi-Image Gallery Grid */}
                {editingProduct.images && editingProduct.images.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <span className="block text-xs font-bold text-[#1f2220]">
                      Current Product Photos & Main Cover Selection:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {editingProduct.images.map((imgUrl, index) => {
                        const isMain =
                          imgUrl === editingProduct.fixture_image_url ||
                          (!editingProduct.fixture_image_url && index === 0);

                        return (
                          <div
                            key={`edit-img-${imgUrl}-${index}`}
                            className={`relative rounded-xl overflow-hidden bg-white border-2 p-2 flex flex-col justify-between transition-all ${
                              isMain
                                ? 'border-[#E4B241] ring-2 ring-[#E4B241]/40 shadow-sm'
                                : 'border-[#e4e2da]'
                            }`}
                          >
                            {/* Thumbnail view */}
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#fcfbf7] border border-[#e8e6df] mb-2">
                              <img
                                src={imgUrl}
                                alt={`Product view ${index + 1}`}
                                className="w-full h-full object-contain p-1"
                              />
                              {isMain && (
                                <span className="absolute top-1 left-1 bg-[#E4B241] text-[#1f2220] text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-[#1f2220]" />
                                  MAIN
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-1.5">
                              {!isMain ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainProductImage(imgUrl)}
                                  className="w-full bg-[#f6f4ee] hover:bg-[#E4B241] hover:text-[#1f2220] text-[#5b605b] font-semibold text-[11px] py-1 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Star className="w-3 h-3 text-amber-500" />
                                  <span>Set as Main</span>
                                </button>
                              ) : (
                                <div className="w-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px] py-1 rounded text-center">
                                  ✓ Primary Cover
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-1 border-t border-[#e8e6df] text-xs">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => handleMoveProductImage(index, 'left')}
                                    className="p-1 text-[#5b605b] hover:text-[#1f2220] disabled:opacity-30 cursor-pointer"
                                    title="Move left"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={index === (editingProduct.images?.length || 0) - 1}
                                    onClick={() => handleMoveProductImage(index, 'right')}
                                    className="p-1 text-[#5b605b] hover:text-[#1f2220] disabled:opacity-30 cursor-pointer"
                                    title="Move right"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductImage(imgUrl)}
                                  className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg border border-dashed border-[#c9c7bd] text-center">
                    <ImageIcon className="w-8 h-8 text-[#a3a19b] mx-auto mb-2" />
                    <p className="text-xs text-[#5b605b] font-medium">
                      No product fixture photos added yet.
                    </p>
                    <p className="text-[11px] text-[#7d827d] mt-0.5">
                      Upload your first image above to set it as the primary cover photo.
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 3: SET 2 - PRODUCT ON SITE (REAL-WORLD KERALA INSTALLATION PHOTO) */}
              <div className="bg-[#f4f7f5] p-5 rounded-xl border border-[#d6e3da] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d6e3da] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-[#1f2220] font-serif">
                        Set 2: Product on Site (Real Kerala Installation Photo)
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#5b605b] mt-0.5">
                      Upload an actual photo of this light installed on a pole in Kerala. Displayed prominently in the product overview and detail page under &quot;Actual On-Site Kerala Installation Photo&quot;.
                    </p>
                  </div>
                  {editingProduct.lifestyle_image_url && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-600 text-white shrink-0 self-start sm:self-center">
                      On-Site Photo Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-[#d6e3da] space-y-1.5">
                      <label className="block text-xs font-semibold text-[#1f2220]">
                        Upload Installation Photo (to ImageKit CDN)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadLifestyleFile(file);
                        }}
                        className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white cursor-pointer"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#d6e3da] space-y-1.5">
                      <label className="block text-xs font-semibold text-[#1f2220]">
                        Or Paste On-Site Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={lifestyleUrlInput}
                          onChange={(e) => setLifestyleUrlInput(e.target.value)}
                          placeholder="https://... or /images/products/...-install.webp"
                          className="flex-1 bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                        />
                        <button
                          type="button"
                          onClick={handleAddLifestyleUrl}
                          className="bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-md text-xs hover:bg-emerald-800 transition-colors shrink-0"
                        >
                          Set URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div>
                    {editingProduct.lifestyle_image_url ? (
                      <div className="bg-white p-3 rounded-xl border border-[#d6e3da] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                            Current On-Site Installation Preview:
                          </span>
                          <span className="text-[10px] text-[#9a6f0c] font-semibold flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" /> Click to enlarge
                          </span>
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setPreviewModalImg({
                              url: editingProduct.lifestyle_image_url!,
                              title: editingProduct.name
                                ? `${editingProduct.name} - On-Site Installation`
                                : 'On-Site Installation Preview',
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setPreviewModalImg({
                                url: editingProduct.lifestyle_image_url!,
                                title: editingProduct.name
                                  ? `${editingProduct.name} - On-Site Installation`
                                  : 'On-Site Installation Preview',
                              });
                            }
                          }}
                          className="relative aspect-[16/8] rounded-lg overflow-hidden border border-[#d6e3da] bg-black cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#E4B241]"
                          title="Click to view big on-site installation preview"
                        >
                          <img
                            src={editingProduct.lifestyle_image_url}
                            alt="On-site installation preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            ✓ Real Installation View
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-[#E4B241] text-black font-bold text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-lg">
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Open Big Preview</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-[11px] text-[#7d827d] truncate max-w-[200px]">
                            {editingProduct.lifestyle_image_url}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, lifestyle_image_url: '' })}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold cursor-pointer"
                          >
                            Remove On-Site Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-xl border border-dashed border-[#c9c7bd] text-center h-full flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-neutral-300 mx-auto mb-1" />
                        <p className="text-xs text-[#5b605b] font-medium">
                          No On-Site Photo Configured
                        </p>
                        <p className="text-[11px] text-[#7d827d]">
                          Upload a photo of this fixture installed on a pole in Kerala to display real-world proof.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: PRODUCT HIGHLIGHTS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#1f2220] uppercase tracking-wider font-serif">
                  3. Key Highlights & Customer Guidance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Best Suited For</label>
                    <input
                      type="text"
                      value={editingProduct.best_for || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, best_for: e.target.value })}
                      placeholder="e.g. Compound roads, residential layouts, villas"
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Why Choose This Model</label>
                    <input
                      type="text"
                      value={editingProduct.why_choose || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, why_choose: e.target.value })}
                      placeholder="e.g. 60,000mAh battery delivers 2 full days of rainy backup"
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Installation Tip / Keep in Mind</label>
                    <input
                      type="text"
                      value={editingProduct.keep_in_mind || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, keep_in_mind: e.target.value })}
                      placeholder="e.g. Recommended mounting height is 5-6 meters"
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Bottom Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e2da]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductUrlInput('');
                    setLifestyleUrlInput('');
                  }}
                  className="px-5 py-2 rounded-md border border-[#c9c7bd] text-xs font-semibold text-[#5b605b] hover:bg-[#f6f4ee] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-2 rounded-md text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Product & Photos</span>
                </button>
              </div>
            </form>
          )}

          {/* PRODUCT CARDS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => {
              const displayImg = p.fixture_image_url || p.image_url || '/images/products/solar-streetlight-600w-s1-fixture.webp';
              const photoCount = p.images && p.images.length > 0 ? p.images.length : (p.fixture_image_url || p.image_url ? 1 : 0);

              return (
                <div key={p.id} className="bg-white p-5 rounded-xl border border-[#e4e2da] shadow-xs space-y-4 hover:shadow-sm transition-shadow">
                  {/* Top Bar with Title & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#1f2220] text-base font-serif">{p.name}</h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#9a6f0c] font-medium mt-0.5">
                        {p.wattage_range || p.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/products/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-[#f6f4ee] text-[#5b605b] hover:text-[#1f2220] transition-colors"
                        title="View on website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleStartEditProduct(p)}
                        className="bg-[#f6f4ee] hover:bg-[#E4B241] text-[#1f2220] text-xs font-bold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProductClick(p.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dual Image Previews (Product Fixture + On-Site Kerala Photo) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Fixture Image Preview */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-[#7d827d] uppercase tracking-wider">
                        Main Fixture Photo:
                      </span>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#fbf9f4] border border-[#e5e3db] flex items-center justify-center p-2">
                        <img src={displayImg} alt={p.name} className="w-full h-full object-contain" />
                        <div className="absolute bottom-1 right-1 bg-[#1f2220]/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <ImageIcon className="w-2.5 h-2.5 text-[#E4B241]" />
                          <span>{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
                        </div>
                      </div>
                    </div>

                    {/* On-Site Kerala Photo Preview */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-[10px] font-bold text-[#7d827d] uppercase tracking-wider">
                          On-Site Installation Photo:
                        </span>
                        {p.lifestyle_image_url && (
                          <span className="text-[9px] text-[#9a6f0c] font-semibold flex items-center gap-0.5">
                            <Maximize2 className="w-2.5 h-2.5" /> Enlarge
                          </span>
                        )}
                      </div>
                      {p.lifestyle_image_url ? (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setPreviewModalImg({
                              url: p.lifestyle_image_url!,
                              title: `${p.name} - Real On-Site Installation`,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setPreviewModalImg({
                                url: p.lifestyle_image_url!,
                                title: `${p.name} - Real On-Site Installation`,
                              });
                            }
                          }}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-[#d6e3da] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#E4B241]"
                          title="Click to view big on-site installation preview"
                        >
                          <img
                            src={p.lifestyle_image_url}
                            alt="On-site installation"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            ✓ On-Site
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-[#E4B241] text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                              <Maximize2 className="w-3 h-3" />
                              <span>Enlarge</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] rounded-lg border border-dashed border-[#c9c7bd] bg-[#fbf9f4] flex flex-col items-center justify-center p-2 text-center">
                          <CheckCircle2 className="w-5 h-5 text-neutral-300 mb-1" />
                          <span className="text-[10px] text-[#7d827d]">No on-site photo yet</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#5b605b] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* APPLICATIONS MANAGER TAB */}
      {/* LIGHTING SOLUTIONS TAB (FORMERLY APPLICATIONS) */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Lighting Solutions & Application Areas</h2>
              <p className="text-xs text-[#5b605b]">Showcase where FRK solar street lights and fixtures are deployed (Roads, Resorts, Villas, Industrial).</p>
            </div>
            <button
              onClick={() => setEditingApplication({ title: '', description: '' })}
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lighting Solution</span>
            </button>
          </div>

          {editingApplication && (
            <form onSubmit={handleSaveApplicationSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
              <h3 className="text-lg font-bold text-[#1f2220] font-serif">
                {editingApplication.id ? 'Edit Lighting Solution' : 'Add Lighting Solution'}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roads & Highways, Eco Resorts, Villa Compounds"
                  value={editingApplication.title || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, title: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                />
              </div>

              {/* Lighting Solution Photo Upload */}
              <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2">
                <span className="block text-xs font-bold text-[#1f2220] font-serif">Lighting Solution Photo</span>
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
                <div className="text-[11px] text-[#5b605b]">Or enter direct photo URL:</div>
                <input
                  type="text"
                  placeholder="https://... or /images/..."
                  value={editingApplication.image_url || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, image_url: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                />
                {editingApplication.image_url && (
                  <div className="pt-2 flex items-center gap-3">
                    <img src={editingApplication.image_url} alt="App Preview" className="w-20 h-14 object-cover rounded border" />
                    <span className="text-xs text-emerald-700 font-semibold">✓ Image Selected</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain the lighting setup, recommended pole heights, and typical lumens used..."
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
                  Save Lighting Solution
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

      {/* INSTALLATION SERVICES TAB */}
      {activeTab === 'installation' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1f2220]">Manage Installation Services & Process</h2>
              <p className="text-xs text-[#5b605b]">
                Edit installation service topics, 6-stage workflow process, hero banner, and district coverage texts.
              </p>
            </div>
            <a
              href="/installation-services"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#c9c7bd] hover:border-[#1f2220] text-[#1f2220] font-semibold px-3 py-1.5 rounded-md text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Page</span>
            </a>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-[#e4e2da] pb-2">
            {[
              { id: 'cards', label: `Service Cards (${installationServices.length})`, icon: Wrench },
              { id: 'steps', label: `Process Stages (${installationProcessSteps.length})`, icon: ListOrdered },
              { id: 'settings', label: 'Page Headers & District Coverage', icon: Settings },
            ].map((subTab) => {
              const Icon = subTab.icon;
              const isSubActive = activeInstallationSubTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setActiveInstallationSubTab(subTab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-[#1f2220] text-white shadow-xs'
                      : 'bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{subTab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. SERVICE CARDS SUB-TAB */}
          {activeInstallationSubTab === 'cards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1f2220] font-serif">Comprehensive Installation Offerings</h3>
                  <p className="text-xs text-[#5b605b]">Cards displayed in &quot;Our Complete Installation Services&quot; grid.</p>
                </div>
                <button
                  onClick={() =>
                    setEditingInstallationService({
                      num: String(installationServices.length + 1).padStart(2, '0'),
                      title: '',
                      badge: `Step ${installationServices.length + 1} • Technical`,
                      summary: '',
                      points: [],
                      image: '/images/frk14.jpg',
                      icon_name: 'Wrench',
                      sort_order: installationServices.length + 1,
                    })
                  }
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service Card</span>
                </button>
              </div>

              {editingInstallationService && (
                <form onSubmit={handleSaveInstallationServiceSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
                  <h4 className="text-lg font-bold text-[#1f2220] font-serif">
                    {editingInstallationService.id ? 'Edit Installation Service Card' : 'Add Installation Service Card'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Step Number (e.g. 01, 02) *</label>
                      <input
                        type="text"
                        required
                        value={editingInstallationService.num || ''}
                        onChange={(e) => setEditingInstallationService({ ...editingInstallationService, num: e.target.value })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Service Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Site Assessment, Product Sizing"
                        value={editingInstallationService.title || ''}
                        onChange={(e) => setEditingInstallationService({ ...editingInstallationService, title: e.target.value })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Badge Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Step 1 • On-Site Survey"
                        value={editingInstallationService.badge || ''}
                        onChange={(e) => setEditingInstallationService({ ...editingInstallationService, badge: e.target.value })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Card Icon</label>
                      <select
                        value={editingInstallationService.icon_name || 'Wrench'}
                        onChange={(e) => setEditingInstallationService({ ...editingInstallationService, icon_name: e.target.value })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      >
                        <option value="MapPin">MapPin (Location / Site Survey)</option>
                        <option value="Compass">Compass (Orientation & Engineering)</option>
                        <option value="FileCheck">FileCheck (Quotation & Transparent Pricing)</option>
                        <option value="CalendarCheck">CalendarCheck (Planning & Schedules)</option>
                        <option value="Wrench">Wrench (Tools & Professional Mounting)</option>
                        <option value="Headphones">Headphones (After-Sales Support)</option>
                        <option value="Sparkles">Sparkles (Turnkey Guarantee)</option>
                        <option value="ShieldCheck">ShieldCheck (Warranty Protection)</option>
                        <option value="Sun">Sun (Solar Radiation & Power)</option>
                        <option value="Truck">Truck (Delivery & Logistics)</option>
                        <option value="Zap">Zap (Electrical Lighting)</option>
                        <option value="Settings">Settings (Maintenance & Calibrations)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={editingInstallationService.sort_order ?? 1}
                        onChange={(e) => setEditingInstallationService({ ...editingInstallationService, sort_order: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="bg-[#f6f4ee] p-4 rounded-md border border-[#e4e2da] space-y-2">
                    <span className="block text-xs font-bold text-[#1f2220] font-serif">Service Photo (ImageKit CDN or URL)</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url) => {
                            setEditingInstallationService((prev) => (prev ? { ...prev, image: url } : null));
                          });
                        }
                      }}
                      className="w-full text-xs text-[#1f2220] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E4B241] file:text-[#1f2220] cursor-pointer"
                    />
                    <div className="text-[11px] text-[#5b605b]">Or direct image URL:</div>
                    <input
                      type="text"
                      placeholder="https://... or /images/frk14.jpg"
                      value={editingInstallationService.image || ''}
                      onChange={(e) => setEditingInstallationService({ ...editingInstallationService, image: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-1.5 text-xs text-[#1f2220]"
                    />
                    {editingInstallationService.image && (
                      <div className="pt-2 flex items-center gap-3">
                        <img src={editingInstallationService.image} alt="Service Preview" className="w-24 h-16 object-cover rounded border" />
                        <span className="text-xs text-emerald-700 font-semibold">✓ Image Loaded</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Summary Description *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief description of what this service covers..."
                      value={editingInstallationService.summary || ''}
                      onChange={(e) => setEditingInstallationService({ ...editingInstallationService, summary: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">
                      Key Technical Checklist Points (Enter each bullet on a new line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Sunlight hours & shadow analysis&#10;Road width and pole spacing calculation&#10;Ground & soil foundation depth"
                      value={(editingInstallationService.points || []).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                        setEditingInstallationService({ ...editingInstallationService, points: lines });
                      }}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220] font-mono"
                    />
                    <span className="text-[11px] text-[#5b605b]">
                      Current points count: {(editingInstallationService.points || []).length}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingInstallationService(null)}
                      className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#E4B241] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs cursor-pointer">
                      Save Installation Service Card
                    </button>
                  </div>
                </form>
              )}

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {installationServices.map((item) => (
                  <div key={item.id} className="bg-white border border-[#e4e2da] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#E4B241] transition-colors shadow-xs">
                    <div className="space-y-3">
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#f6f4ee] border border-[#e4e2da]">
                        <img src={item.image || '/images/frk14.jpg'} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#1f2220] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.num}
                        </span>
                        <span className="absolute top-2 right-2 bg-white/90 text-[#9a6f0c] text-[10px] font-bold px-2 py-0.5 rounded">
                          Order: {item.sort_order}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#9a6f0c] uppercase tracking-wider block">{item.badge}</span>
                        <h4 className="font-bold text-base text-[#1f2220] font-serif mt-0.5">{item.title}</h4>
                        <p className="text-xs text-[#5b605b] mt-1 line-clamp-2">{item.summary}</p>
                      </div>

                      {item.points && item.points.length > 0 && (
                        <div className="pt-2 border-t border-[#f0eee6]">
                          <span className="text-[11px] font-semibold text-[#1f2220] block mb-1">Key Deliverables:</span>
                          <ul className="text-[11px] text-[#5b605b] space-y-1">
                            {item.points.slice(0, 3).map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span className="line-clamp-1">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#f0eee6]">
                      <span className="text-[10px] text-[#5b605b] font-mono">Icon: {item.icon_name || 'Wrench'}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditingInstallationService(item)}
                          className="text-xs font-semibold text-[#9a6f0c] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInstallationServiceClick(item.id)}
                          className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PROCESS STEPS SUB-TAB */}
          {activeInstallationSubTab === 'steps' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1f2220] font-serif">Structured Workflow Stages</h3>
                  <p className="text-xs text-[#5b605b]">Displayed in the 6-stage workflow timeline on the installation services page.</p>
                </div>
                <button
                  onClick={() =>
                    setEditingProcessStep({
                      step: installationProcessSteps.length + 1,
                      name: '',
                      desc: '',
                      sort_order: installationProcessSteps.length + 1,
                    })
                  }
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-md text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Process Stage</span>
                </button>
              </div>

              {editingProcessStep && (
                <form onSubmit={handleSaveProcessStepSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-4">
                  <h4 className="text-lg font-bold text-[#1f2220] font-serif">
                    {editingProcessStep.id ? 'Edit Process Stage' : 'New Process Stage'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Stage Number (e.g. 1, 2, 3) *</label>
                      <input
                        type="number"
                        required
                        value={editingProcessStep.step ?? 1}
                        onChange={(e) => setEditingProcessStep({ ...editingProcessStep, step: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Stage Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Enquiry, Site Assessment, Quotation"
                        value={editingProcessStep.name || ''}
                        onChange={(e) => setEditingProcessStep({ ...editingProcessStep, name: e.target.value })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1f2220] mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={editingProcessStep.sort_order ?? 1}
                        onChange={(e) => setEditingProcessStep({ ...editingProcessStep, sort_order: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Stage Description *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="What happens during this stage..."
                      value={editingProcessStep.desc || ''}
                      onChange={(e) => setEditingProcessStep({ ...editingProcessStep, desc: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProcessStep(null)}
                      className="px-4 py-2 rounded-md border border-[#c9c7bd] text-xs text-[#5b605b]"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#E4B241] text-[#1f2220] font-bold px-5 py-2 rounded-md text-xs cursor-pointer">
                      Save Process Stage
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {installationProcessSteps.map((step) => (
                  <div key={step.id} className="bg-white p-5 rounded-lg border border-[#e4e2da] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#E4B241]/20 text-[#9a6f0c] font-bold text-xs flex items-center justify-center font-serif">
                            {step.step}
                          </span>
                          <h4 className="font-bold text-sm font-serif text-[#1f2220]">{step.name}</h4>
                        </div>
                        <span className="text-[10px] text-[#9a6f0c] font-mono">Stage 0{step.step}</span>
                      </div>
                      <p className="text-xs text-[#5b605b] mt-2 leading-relaxed">{step.desc}</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f0eee6]">
                      <button onClick={() => setEditingProcessStep(step)} className="text-xs font-semibold text-[#9a6f0c] hover:underline cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProcessStepClick(step.id)} className="text-xs font-semibold text-red-600 hover:underline cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PAGE HEADERS & COVERAGE SETTINGS SUB-TAB */}
          {activeInstallationSubTab === 'settings' && (
            <form onSubmit={handleSaveInstallationSettingsSubmit} className="bg-white p-6 rounded-lg border border-[#e4e2da] space-y-6">
              <div>
                <h3 className="font-bold text-base text-[#1f2220] font-serif">Installation Page Headings & District Coverage</h3>
                <p className="text-xs text-[#5b605b]">Customize hero texts, section badges, and district coverage callout box.</p>
              </div>

              {/* Hero Section Texts */}
              <div className="p-4 rounded-md bg-[#fcfbf7] border border-[#e5e3db] space-y-3">
                <span className="block text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">1. Hero Section</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Hero Pill Badge</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.hero_badge || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, hero_badge: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Hero Title *</label>
                    <input
                      type="text"
                      required
                      value={editingInstallationSettings.hero_title || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, hero_title: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={editingInstallationSettings.hero_subtitle || ''}
                    onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, hero_subtitle: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.hero_cta_text || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, hero_cta_text: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">WhatsApp Button Text</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.hero_whatsapp_text || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, hero_whatsapp_text: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                </div>
              </div>

              {/* Services Section Headers */}
              <div className="p-4 rounded-md bg-[#fcfbf7] border border-[#e5e3db] space-y-3">
                <span className="block text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">2. Services Grid Section</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Section Badge</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.services_section_badge || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, services_section_badge: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Section Title</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.services_section_title || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, services_section_title: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Section Description</label>
                  <input
                    type="text"
                    value={editingInstallationSettings.services_section_desc || ''}
                    onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, services_section_desc: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>
              </div>

              {/* District Coverage Callout Box */}
              <div className="p-4 rounded-md bg-[#fcfbf7] border border-[#e5e3db] space-y-3">
                <span className="block text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">3. District Coverage Banner</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Coverage Badge</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.coverage_badge || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, coverage_badge: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Coverage Heading</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.coverage_title || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, coverage_title: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Coverage Description</label>
                  <textarea
                    rows={2}
                    value={editingInstallationSettings.coverage_desc || ''}
                    onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, coverage_desc: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Coverage CTA Button Text</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.coverage_cta_text || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, coverage_cta_text: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1f2220] mb-1">Pre-filled WhatsApp Message</label>
                    <input
                      type="text"
                      value={editingInstallationSettings.coverage_whatsapp_text || ''}
                      onChange={(e) => setEditingInstallationSettings({ ...editingInstallationSettings, coverage_whatsapp_text: e.target.value })}
                      className="w-full bg-white border border-[#c9c7bd] rounded-md px-3 py-2 text-xs text-[#1f2220]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-2.5 rounded-md text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Save Installation Page Settings
                </button>
              </div>
            </form>
          )}
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
      {/* On-Site Installation Preview Modal */}
      <OnSitePreviewModal
        isOpen={Boolean(previewModalImg)}
        onClose={() => setPreviewModalImg(null)}
        imageUrl={previewModalImg?.url}
        productName={previewModalImg?.title}
      />
    </div>
  );
}
