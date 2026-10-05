import { Blog, Product, ApplicationItem, Inquiry, SiteSettings, KeepAliveLog } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  hero_title: "Solar street lights for Kerala's roads, estates and businesses",
  hero_subtitle: "FRK Lighting supplies and installs solar-powered street lights that turn on at dusk and off at dawn. No trenching, no cable runs and no electricity bill.",
  hero_image_url: "/images/frk1.webp",
  phone: "+91 70258 88461",
  whatsapp: "+91 70258 88461",
  email: "frklighting@gmail.com",
  instagram: "https://www.instagram.com/frk.lighting/",
  instagram_handle: "@frk.lighting",
  address: "FRK Lighting Solutions, Kerala, India",
  service_area: "Kerala & South India. Custom sizing, site survey & installation services available.",
  announcement_banner: "⚡ Free site assessment & custom quote for solar lighting projects across Kerala!",
  footer_text: "Solar street lights, flood lights and pathway lights for roads, estates, campuses, car parks and businesses across Kerala."
};

export const INITIAL_BLOGS: Blog[] = [
  {
    id: "blog-1",
    slug: "sizing-solar-street-light-kerala",
    title: "How to size a solar street light for your road",
    read_time: "4 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk10.jpg",
    excerpt: "The four key measurements that decide whether a solar light lasts all night through monsoon conditions.",
    content: `Most complaints about solar lights come down to one thing: the system was too small for the job. Here is how to avoid that.

### Start with the road, not the lamp
Measure the road width, the distance between poles and the pole height. A narrow lane with poles every 25 metres needs far less light than a two-lane road with poles every 40 metres.

### Decide how long the lights must stay on
A light at full brightness for twelve hours needs a much bigger battery than one that dims to 30% after midnight. Ask whether the site really needs full output all night.

### Plan for the worst weeks
Size the battery and panel for your cloudiest weeks in Kerala, with several days of continuous rain in a row, not for a sunny summer week.

### Leave a margin
Batteries gradually lose capacity over the years and solar panels collect dust. A 20-25% margin today keeps the light working reliably in year five and beyond.`,
    published: true,
    created_at: new Date('2026-10-04T12:00:00').toISOString()
  },
  {
    id: "blog-2",
    slug: "solar-street-lights-monsoon-performance",
    title: "Do solar street lights work in the monsoon?",
    read_time: "5 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk14.jpg",
    excerpt: "What happens in a week of heavy rain, and how to plan battery backup for Kerala rainy season.",
    content: `Yes, solar lights do work during the monsoon, but only if the system is properly designed and sized for high rainfall zones like Kerala.

### How solar panels charge under clouds
Solar panels still generate electricity on cloudy or overcast days, though at a lower efficiency rate (typically 20% to 50% of full sunlight power). Therefore, the battery storage must carry the load across multiple dull days.

### What to ask your supplier
1. How many days of autonomy (backup) does the battery provide with zero sunlight?
2. Does the fixture support automatic midnight dimming or smart PIR motion sensor regulation to conserve energy?

### Keep panels clean and unshaded
Dust, bird droppings, fallen leaves, and shade from growing coconut palms can reduce charging efficiency more than rain does. Periodically check surrounding foliage around pole locations.

### Verify waterproofing & IP rating
Ensure your fixtures carry at least IP65 or IP67 ingress protection rating to withstand intense tropical downpours and humid sea winds.`,
    published: true,
    created_at: new Date('2026-10-03T10:00:00').toISOString()
  },
  {
    id: "blog-3",
    slug: "all-in-one-vs-split-solar-lights",
    title: "All-in-one vs Split-type solar lights: Which to choose?",
    read_time: "6 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk6.webp",
    excerpt: "Both convert sunlight into light, but differ in installation simplicity, autonomy, and panel capacity.",
    content: `Both all-in-one and split-type solar lights convert sunlight into bright LED lighting. They differ in how easy they are to install and how flexible they are for high-wattage requirements.

### All-in-one Solar Street Lights
The solar panel, LiFePO4 battery, MPPT controller, and LED module are integrated into a single unified casing.
* **Best for:** Estate roads, residential lanes, resort pathways, and private compounds.
* **Pros:** Extremely fast installation, compact aesthetic, no exposed wires.

### Split-type Solar Street Lights
The solar panel is mounted separately at the top of the pole, while the LED head and battery enclosure are mounted independently.
* **Best for:** Highway bypasses, major public roads, high wattage requirements, and locations with heavy cloud shade.
* **Pros:** Allows much larger solar panels and high-capacity battery banks to be paired with high-lumen luminaires.

### Quick Decision Rule
For short hours and modest lighting requirements, choose **All-in-one**. For main roads, all-night full brightness, or long monsoon backup, choose **Split-type**.`,
    published: true,
    created_at: new Date('2026-10-02T14:00:00').toISOString()
  },
  {
    id: "blog-4",
    slug: "solar-quote-preparation-checklist",
    title: "What to prepare before requesting a solar lighting quote",
    read_time: "3 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk8.jpg",
    excerpt: "Gather these 4 essential details to get a faster, pinpoint accurate quote for your site.",
    content: `A few minutes of prep saves days of back-and-forth messaging. Here is what we recommend gathering before reaching out:

### 1. Site Layout & Dimensions
Measure or sketch the total road length, width, and desired pole spacing. Mark any existing poles or structures.

### 2. Shade & Tree Coverage
Note any tall coconut trees, surrounding buildings, or dense canopy that might block sun exposure between 9 AM and 4 PM.

### 3. Lighting Hours & Usage
Specify whether full brightness is required from dusk to dawn, or if motion-sensing dimming late at night is acceptable.

### 4. Soil & Ground Condition
Let us know if poles will be installed on soft earth (requiring concrete foundations), paved interlock tiles, or existing compound walls.`,
    published: true,
    created_at: new Date('2026-10-01T09:00:00').toISOString()
  },
  {
    id: "blog-5",
    slug: "lifepo4-battery-lifespan-solar-lights",
    title: "Why LiFePO4 batteries are essential for Kerala solar lights",
    read_time: "5 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk11.jpg",
    excerpt: "Understanding heat tolerance, cycle life, and depth of discharge for tropical solar installations.",
    content: `Lithium Iron Phosphate (LiFePO4) chemistry has revolutionized solar outdoor lighting due to its thermal stability and long cycle life.

### High Heat Resistance
Kerala summer temperatures can accelerate lead-acid or standard lithium degradation. LiFePO4 safely withstands temperatures up to 65°C without thermal runaway.

### 2000+ Deep Charge Cycles
While standard batteries last 300 to 500 cycles, LiFePO4 lasts over 2000 full charge-discharge cycles, giving 6+ years of operational service.`,
    published: true,
    created_at: new Date('2026-09-28T11:00:00').toISOString()
  },
  {
    id: "blog-6",
    slug: "panchayat-solar-street-lighting-guidelines",
    title: "Solar street lighting for Panchayats & Municipal roads",
    read_time: "4 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk15.jpg",
    excerpt: "Key specifications required for public road safety, pole foundation standards, and warranty terms.",
    content: `Public roads require robust poles, galvanized brackets, and IP67 weather resistance. Here are public layout considerations.

### Heavy-Duty Pole Foundations
Concrete civil foundations must cure for 5-7 days to prevent wind tilt during tropical squalls.

### Uniform Lux Spacing
Calculate pole spacing to avoid dark gaps between street light fixtures along Panchayat lanes.`,
    published: true,
    created_at: new Date('2026-09-25T15:00:00').toISOString()
  },
  {
    id: "blog-7",
    slug: "solar-flood-lights-industrial-yards",
    title: "Illuminating factories & storage yards with solar flood lights",
    read_time: "5 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk2.jpg",
    excerpt: "How high-wattage 600W solar flood lights secure large perimeters without electricity cables.",
    content: `Factory yards require high lumen output from dusk to dawn to ensure perimeter security and safe night loading operations.

### Wide Angle Beam Dispersion
Opt for 120-degree wide angle flood optics to cover vast open spaces with minimum fixture count.`,
    published: true,
    created_at: new Date('2026-09-20T10:00:00').toISOString()
  },
  {
    id: "blog-8",
    slug: "resort-pathway-lighting-solar-bollards",
    title: "Resort & villa pathway lighting: Aesthetics meets efficiency",
    read_time: "4 min read",
    author: "FRK Technical Team",
    image_url: "/images/frk13.jpg",
    excerpt: "Low height warm lighting bollards for resorts and villa walkways without visible wiring.",
    content: `Architectural bollards enhance night ambience while eliminating ugly cable trenches across resort lawns.`,
    published: true,
    created_at: new Date('2026-09-15T09:00:00').toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "all-in-one-solar-street-light",
    name: "All-in-one Solar Street Light",
    subtitle: "Compact, integrated dusk-to-dawn lighting fixture",
    description: "The solar panel, LiFePO4 battery, MPPT smart controller, and high-lumen LED matrix sit in a single weatherproof body. Mount on a pole and it is instantly operational.",
    category: "All-in-one",
    wattage_range: "30W - 120W",
    best_for: "Estate roads, internal lanes, walkway paths, resort grounds, and gates",
    why_choose: "Fastest installation with zero cabling and a clean, modern aesthetic.",
    keep_in_mind: "Solar panel size is bound to the fixture body, so 14+ hour backup may require split-type.",
    image_url: "/images/frk4.webp",
    is_active: true,
    sort_order: 1
  },
  {
    id: "prod-2",
    slug: "split-type-solar-street-light",
    name: "Split-type Solar Street Light",
    subtitle: "High-power modular lighting for heavy duty roads",
    description: "The panel is mounted separately at optimal solar tilt on top of the pole, connected to a dedicated battery box and luminaire. Fully customizable panel and battery capacity.",
    category: "Split-type",
    wattage_range: "60W - 200W",
    best_for: "Panchayat roads, highways, wide car parks, and monsoon-heavy regions",
    why_choose: "Maximum solar capture, larger battery storage, and easy independent battery replacement.",
    keep_in_mind: "Requires slightly more pole assembly compared to integrated all-in-one models.",
    image_url: "/images/frk7.jpg",
    is_active: true,
    sort_order: 2
  },
  {
    id: "prod-3",
    slug: "solar-flood-light",
    name: "Solar Flood Light",
    subtitle: "Wide-angle high lumen flood illumination",
    description: "Delivers broad, intense illumination for open grounds, building perimeters, commercial yards, and sports fields. Available in models up to 600W output.",
    category: "Flood Light",
    wattage_range: "100W - 600W",
    best_for: "Commercial yards, parking areas, temple grounds, sports courts, and security perimeters",
    why_choose: "Tremendous area coverage with zero grid electricity consumption or trenching costs.",
    keep_in_mind: "Mount at appropriate height and downward angle to optimize beam spread and prevent glare.",
    image_url: "/images/frk10.jpg",
    is_active: true,
    sort_order: 3
  },
  {
    id: "prod-4",
    slug: "solar-garden-pathway-light",
    name: "Garden & Pathway Lights",
    subtitle: "Low-height architectural bollard & landscape solar lights",
    description: "Elegant, low-profile solar fixtures designed for resort walkways, garden lawns, poolside paths, and villa entrances where tall street poles would be visually disruptive.",
    category: "Landscape",
    wattage_range: "10W - 30W",
    best_for: "Gardens, resort paths, residential walkways, compound walls, and outdoor dining areas",
    why_choose: "Soft warm illumination, ambient glare-free design, effortless ground stake or flange mounting.",
    keep_in_mind: "Position in unshaded lawn areas to allow optimal daylight charging.",
    image_url: "/images/frk12.jpg",
    is_active: true,
    sort_order: 4
  }
];

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    slug: "roads-highways",
    title: "Roads & Highways",
    description: "Panchayat roads, bypasses, junctions, and bridges. Split-type lights provide reliable, uniform illumination without expensive grid cabling.",
    image_url: "/images/frk14.jpg",
    sort_order: 1
  },
  {
    id: "app-2",
    slug: "residential-layouts",
    title: "Residential Layouts & Apartments",
    description: "Gated communities, apartment internal roads, perimeter walls, and security gates. Quiet, reliable dusk-to-dawn lighting with zero electricity bill for residents.",
    image_url: "/images/frk15.jpg",
    sort_order: 2
  },
  {
    id: "app-3",
    slug: "car-parks",
    title: "Car Parks & Commercial Centers",
    description: "Malls, hospitals, office compounds, churches, and temples. Wide flood coverage enhances safety and nighttime visibility.",
    image_url: "/images/frk16.jpg",
    sort_order: 3
  },
  {
    id: "app-4",
    slug: "schools-campuses",
    title: "Schools, Colleges & Campuses",
    description: "Pathways, athletic fields, and entrance gates illuminated without digging up lawns or sports grounds for cabling.",
    image_url: "/images/frk17.jpg",
    sort_order: 4
  },
  {
    id: "app-5",
    slug: "industrial-yards",
    title: "Factories, Warehouses & Yards",
    description: "Perimeter security, loading docks, and open storage. High-wattage flood lights up to 600W keep operations bright and secure.",
    image_url: "/images/frk2.jpg",
    sort_order: 5
  },
  {
    id: "app-6",
    slug: "farms-plantations",
    title: "Farms & Remote Sites",
    description: "Rubber plantations, tea estates, and agricultural land where extending a main electricity line is cost-prohibitive.",
    image_url: "/images/frk3.jpg",
    sort_order: 6
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    name: "Rajesh Kumar",
    contact: "+91 98470 12345",
    location: "Kochi, Ernakulam",
    project_type: "Residential layout",
    details: "Need 8 solar street lights for our gated villa community road. Approx 200m road length.",
    status: "new",
    created_at: new Date('2026-10-04T10:30:00').toISOString()
  },
  {
    id: "inq-2",
    name: "Sunil Varghese",
    contact: "sunil@resortkerala.com",
    location: "Wayanad",
    project_type: "Other",
    details: "Looking for solar flood lights and garden pathway lights for resort grounds.",
    status: "contacted",
    created_at: new Date('2026-10-03T14:15:00').toISOString()
  }
];

export const INITIAL_KEEPALIVE_LOGS: KeepAliveLog[] = [
  {
    id: "log-1",
    timestamp: new Date().toISOString(),
    status: "success",
    notes: "Database status active. Initial system check completed cleanly.",
    source: "app_keepalive"
  }
];

let memoryBlogs = [...INITIAL_BLOGS];
let memoryProducts = [...INITIAL_PRODUCTS];
let memoryApplications = [...INITIAL_APPLICATIONS];
let memorySettings = { ...INITIAL_SITE_SETTINGS };
let memoryInquiries = [...INITIAL_INQUIRIES];
let memoryKeepAliveLogs = [...INITIAL_KEEPALIVE_LOGS];

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        const settingsObj = { ...INITIAL_SITE_SETTINGS };
        data.forEach(item => {
          if (item.key && item.value !== undefined) {
            (settingsObj as any)[item.key] = item.value;
          }
        });
        return settingsObj;
      }
    } catch (e) {
      console.warn("Supabase fetch site_settings failed, using fallback:", e);
    }
  }
  return memorySettings;
}

export async function updateSiteSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
  memorySettings = { ...memorySettings, ...newSettings };
  if (isSupabaseConfigured && supabase) {
    try {
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
    } catch (e) {
      console.warn("Supabase site_settings update error:", e);
    }
  }
  return memorySettings;
}

export async function getBlogs(): Promise<Blog[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Blog[];
      }
    } catch (e) {
      console.warn("Supabase blogs fetch failed, using memory store:", e);
    }
  }
  return memoryBlogs;
}

export async function saveBlog(blog: Partial<Blog>): Promise<Blog> {
  const isEdit = Boolean(blog.id);
  const now = new Date().toISOString();
  const id = blog.id || `blog-${Date.now()}`;
  const slug = blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`;
  
  const updatedBlog: Blog = {
    id,
    slug,
    title: blog.title || "Untitled Post",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    read_time: blog.read_time || "4 min read",
    author: blog.author || "FRK Technical Team",
    image_url: blog.image_url || "/images/frk10.jpg",
    published: blog.published !== undefined ? blog.published : true,
    created_at: blog.created_at || now,
    updated_at: now
  };

  if (isEdit) {
    memoryBlogs = memoryBlogs.map(b => b.id === id ? updatedBlog : b);
  } else {
    memoryBlogs = [updatedBlog, ...memoryBlogs];
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('blogs').upsert([updatedBlog]);
    } catch (e) {
      console.warn("Supabase saveBlog error:", e);
    }
  }

  return updatedBlog;
}

export async function deleteBlog(id: string): Promise<boolean> {
  memoryBlogs = memoryBlogs.filter(b => b.id !== id);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('blogs').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase deleteBlog error:", e);
    }
  }
  return true;
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (e) {
      console.warn("Supabase products fetch failed:", e);
    }
  }
  return memoryProducts;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const isEdit = Boolean(product.id);
  const id = product.id || `prod-${Date.now()}`;
  const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
  
  const updatedProd: Product = {
    id,
    slug,
    name: product.name || "New Solar Product",
    subtitle: product.subtitle || "",
    description: product.description || "",
    category: product.category || "All-in-one",
    wattage_range: product.wattage_range || "30W - 120W",
    best_for: product.best_for || "Roads and paths",
    why_choose: product.why_choose || "Reliable performance",
    keep_in_mind: product.keep_in_mind || "Standard installation",
    image_url: product.image_url || "/images/frk4.webp",
    is_active: product.is_active !== undefined ? product.is_active : true,
    sort_order: product.sort_order || memoryProducts.length + 1
  };

  if (isEdit) {
    memoryProducts = memoryProducts.map(p => p.id === id ? updatedProd : p);
  } else {
    memoryProducts = [...memoryProducts, updatedProd];
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert([updatedProd]);
    } catch (e) {
      console.warn("Supabase saveProduct error:", e);
    }
  }

  return updatedProd;
}

export async function deleteProduct(id: string): Promise<boolean> {
  memoryProducts = memoryProducts.filter(p => p.id !== id);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase deleteProduct error:", e);
    }
  }
  return true;
}

export async function getApplications(): Promise<ApplicationItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('applications').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as ApplicationItem[];
      }
    } catch (e) {
      console.warn("Supabase applications fetch failed:", e);
    }
  }
  return memoryApplications;
}

export async function saveApplication(appItem: Partial<ApplicationItem>): Promise<ApplicationItem> {
  let updatedApp: ApplicationItem;
  if (appItem.id) {
    memoryApplications = memoryApplications.map((a) => (a.id === appItem.id ? ({ ...a, ...appItem } as ApplicationItem) : a));
    updatedApp = memoryApplications.find((a) => a.id === appItem.id)!;
  } else {
    updatedApp = {
      id: `app-${Date.now()}`,
      slug: appItem.slug || `app-${Date.now()}`,
      title: appItem.title || 'New Application',
      description: appItem.description || '',
      image_url: appItem.image_url || '',
      sort_order: appItem.sort_order || memoryApplications.length + 1,
    };
    memoryApplications.push(updatedApp);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('applications').upsert([updatedApp]);
    } catch (e) {
      console.warn("Supabase saveApplication error:", e);
    }
  }

  return updatedApp;
}

export async function deleteApplication(id: string): Promise<boolean> {
  memoryApplications = memoryApplications.filter((a) => a.id !== id);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('applications').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase deleteApplication error:", e);
    }
  }
  return true;
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Inquiry[];
      }
    } catch (e) {
      console.warn("Supabase inquiries fetch failed:", e);
    }
  }
  return memoryInquiries;
}

export async function saveInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<Inquiry> {
  const newInq: Inquiry = {
    id: `inq-${Date.now()}`,
    ...inquiry,
    status: 'new',
    created_at: new Date().toISOString()
  };

  memoryInquiries = [newInq, ...memoryInquiries];

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('inquiries').insert([{
        name: inquiry.name,
        contact: inquiry.contact,
        location: inquiry.location,
        project_type: inquiry.project_type,
        details: inquiry.details,
        status: 'new'
      }]);
    } catch (e) {
      console.warn("Supabase saveInquiry error:", e);
    }
  }

  return newInq;
}

export async function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<boolean> {
  memoryInquiries = memoryInquiries.map(i => i.id === id ? { ...i, status } : i);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    } catch (e) {
      console.warn("Supabase inquiry status update error:", e);
    }
  }
  return true;
}

export async function recordKeepAlivePing(source: 'cron' | 'manual' | 'app_keepalive' = 'cron', notes?: string): Promise<KeepAliveLog> {
  const now = new Date().toISOString();
  const log: KeepAliveLog = {
    id: `log-${Date.now()}`,
    timestamp: now,
    status: 'success',
    notes: notes || `Database ping executed cleanly at ${new Date().toLocaleString()}`,
    source
  };

  memoryKeepAliveLogs = [log, ...memoryKeepAliveLogs.slice(0, 19)];

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('db_keepalive_log').insert([{
        status: 'success',
        notes: log.notes,
        source: log.source
      }]);

      if (error) {
        await supabase.from('site_settings').select('key').limit(1);
      }
    } catch (e) {
      console.warn("Supabase keepalive ping warning:", e);
    }
  }

  return log;
}

export async function getKeepAliveStatus(): Promise<{
  lastPing: string;
  status: 'active' | 'pending';
  hoursSinceLastPing: number;
  logs: KeepAliveLog[];
}> {
  let logs = memoryKeepAliveLogs;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('db_keepalive_log').select('*').order('timestamp', { ascending: false }).limit(10);
      if (!error && data && data.length > 0) {
        logs = data as KeepAliveLog[];
      }
    } catch (e) {
      // fallback
    }
  }

  const lastLog = logs[0];
  const lastPingDate = lastLog ? new Date(lastLog.timestamp) : new Date();
  const hoursSince = Math.floor((Date.now() - lastPingDate.getTime()) / (1000 * 60 * 60));

  if (hoursSince >= 48) {
    recordKeepAlivePing('app_keepalive', `Auto keep-alive ping triggered after ${hoursSince} hours`);
  }

  return {
    lastPing: lastPingDate.toISOString(),
    status: hoursSince < 48 ? 'active' : 'pending',
    hoursSinceLastPing: hoursSince,
    logs
  };
}
