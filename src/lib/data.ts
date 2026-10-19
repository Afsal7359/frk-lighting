import { Blog, Product, ApplicationItem, Inquiry, SiteSettings, KeepAliveLog, InstallationStory, CustomerTestimonial } from './types';
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
    id: "prod-frk-600w-s1",
    slug: "solar-streetlight-600w-s1",
    name: "Solar Streetlight 600W-S1",
    subtitle: "Compact All-In-One Dusk-To-Dawn Solar Street Light",
    description: "Engineered for Kerala's coastal and tropical conditions. Features a 60W monocrystalline solar panel, high-grade LiFePO4 battery, and high-pressure aluminium die-cast housing with IP67 ingress protection.",
    category: "All-in-one",
    wattage_range: "600W (60W Solar Panel)",
    best_for: "Private compound roads, residential layouts, villa entrances, and farmhouses",
    why_choose: "60,000mAh battery delivers 2 full days of rainy backup with IP67 waterproofing and over 10 years lifespan.",
    keep_in_mind: "Recommended installation height is 5-6 meters for optimum 120° beam distribution.",
    image_url: "/images/products/solar-streetlight-600w-s1-fixture.webp",
    fixture_image_url: "/images/products/solar-streetlight-600w-s1-fixture.webp",
    lifestyle_image_url: "/images/products/solar-streetlight-600w-s1-install.webp",
    is_active: true,
    sort_order: 1,
    specs: {
      panel: {
        size: "610 × 580 mm",
        power: "60 W",
        voc: "21.95 V",
        vmax: "19.23 V",
        isc: "3.30 A",
        imax: "3.12 A",
        noct: "45°C"
      },
      battery: {
        name: "Lithium Iron Phosphate (LiFePO4)",
        capacity: "60,000 mAh (Ensures Autonomy in Cloudy Days)",
        lifespan: "Over 10 Years",
        charging_time: "05 - 06 Hrs (Normal Sunlight)",
        backup: "2 Days Full Backup",
        protections: "Overcharge, Deep Discharge, Short Circuit, Over-current, Over-voltage, Under-voltage, Open Circuit",
        ip_rating: "IP67 or above"
      },
      lighting: {
        housing: "High Pressure Aluminium Die-Cast",
        lamp_material: "Die Casting Aluminium + PC Lens",
        pir_sensor: "Optional (Energy Saving Feature)",
        features: "Flicker-free, Dimming Option",
        lumens: "2,178.04 lm",
        lumens_per_watt: "140 lm/W",
        color_temp: "6500K Cool White",
        light_size: "21 × 41 × 8 cm",
        led_count: "69 High-Lumen LEDs",
        working_time: "2 Days Backup (First 6 Hours 100% Brightness / After 6 Hours 80%)",
        driver: "Inbuilt DC-DC",
        beam_angle: "120° Wide Angle",
        waterproof: "IP67 Waterproof",
        working_mode: "Light Control (Dusk to Dawn) + Remote Control",
        installation_height: "5 - 6 m",
        standards: "IS: 15885 / IS: 16104 / IEC 62384 (latest)"
      }
    }
  },
  {
    id: "prod-frk-600w-s2",
    slug: "solar-streetlight-600w-s2",
    name: "Solar Streetlight 600W-S2",
    subtitle: "High-Density 204 LED Matrix Solar Street Light with 80W Panel",
    description: "Upgraded with an 80W high-efficiency solar panel and a dense 204 LED array, delivering uniform, glare-free light across public lanes and colony roads.",
    category: "All-in-one",
    wattage_range: "600W (80W Solar Panel)",
    best_for: "Village Panchayat roads, commercial internal lanes, and large apartment perimeters",
    why_choose: "Upgraded 80W solar panel charges 60,000mAh battery faster, paired with a 204 LED matrix for smooth road light distribution.",
    keep_in_mind: "Includes intelligent infrared remote control with programmable timer and brightness dimming.",
    image_url: "/images/products/solar-streetlight-600w-s2-fixture.webp",
    fixture_image_url: "/images/products/solar-streetlight-600w-s2-fixture.webp",
    lifestyle_image_url: "/images/products/solar-streetlight-600w-s2-install.webp",
    is_active: true,
    sort_order: 2,
    specs: {
      panel: {
        size: "610 × 580 mm",
        power: "80 W",
        voc: "21.95 V",
        vmax: "19.23 V",
        isc: "3.30 A",
        imax: "3.12 A",
        noct: "45°C"
      },
      battery: {
        name: "Lithium Iron Phosphate (LiFePO4)",
        capacity: "60,000 mAh (Ensures Autonomy in Cloudy Days)",
        lifespan: "Over 10 Years",
        charging_time: "05 - 06 Hrs (Normal Sunlight)",
        backup: "2 Days Full Backup",
        protections: "Overcharge, Deep Discharge, Short Circuit, Over-current, Over-voltage, Under-voltage, Open Circuit",
        ip_rating: "IP67 or above"
      },
      lighting: {
        housing: "High Pressure Aluminium Die-Cast",
        lamp_material: "Die Casting Aluminium + PC Lens",
        pir_sensor: "Optional (Energy Saving Feature)",
        features: "Flicker-free, Dimming Option",
        lumens: "2,178.04 lm",
        lumens_per_watt: "140 lm/W",
        color_temp: "6500K Cool White",
        light_size: "21 × 41 × 8 cm",
        led_count: "204 LED Matrix",
        working_time: "2 Days Backup (First 6 Hours 100% Brightness / After 6 Hours 80%)",
        driver: "Inbuilt DC-DC",
        beam_angle: "120° Wide Angle",
        waterproof: "IP67 Waterproof",
        working_mode: "Light Control + Remote Control",
        installation_height: "5 - 6 m",
        standards: "IS: 15885 / IS: 16104 / IEC 62384 (latest)"
      }
    }
  },
  {
    id: "prod-frk-800w-warm",
    slug: "solar-streetlight-800w-warm",
    name: "Solar Streetlight 800W (Warm)",
    subtitle: "Architectural 100W Panel Luminaire with 80,000mAh Battery",
    description: "Specialized warm ambient solar street light tailored for hospitality venues, resorts, and heritage residences. Combines high-capacity 100W solar harvesting with warm, relaxing illumination.",
    category: "Architectural & Landscape",
    wattage_range: "800W (100W Solar Panel)",
    best_for: "Luxury resorts, beachfront pathways, heritage estates, clubhouses, and garden drives",
    why_choose: "Warm ambient glow that preserves evening aesthetics without harsh blue glare, supported by an oversized 80,000mAh battery.",
    keep_in_mind: "Heavy-duty 760mm panel provides high rainy-day autonomy throughout monsoon months.",
    image_url: "/images/products/solar-streetlight-800w-warm-fixture.webp",
    fixture_image_url: "/images/products/solar-streetlight-800w-warm-fixture.webp",
    lifestyle_image_url: "/images/products/solar-streetlight-800w-warm-install.webp",
    is_active: true,
    sort_order: 3,
    specs: {
      panel: {
        size: "760 × 580 × 25 mm",
        power: "100 W",
        voc: "21.95 V",
        vmax: "19.23 V",
        isc: "4.47 A",
        imax: "4.23 A",
        noct: "45°C"
      },
      battery: {
        name: "Lithium Iron Phosphate (LiFePO4)",
        capacity: "80,000 mAh (Ensures Autonomy in Cloudy Days)",
        lifespan: "Over 10 Years",
        charging_time: "05 - 06 Hrs (Normal Sunlight)",
        backup: "2 Days Full Backup",
        protections: "Overcharge, Deep Discharge, Short Circuit, Over-current, Over-voltage, Under-voltage, Open Circuit",
        ip_rating: "IP67 (better than IP66)"
      },
      lighting: {
        housing: "High Pressure Aluminium Die-Cast",
        lamp_material: "Die Casting Aluminium + PC Lens",
        pir_sensor: "Optional (Energy Saving Feature)",
        features: "Flicker-free, Dimming Option",
        lumens: "2,178.04 lm",
        lumens_per_watt: "140 lm/W",
        color_temp: "3000K - 4000K Warm White",
        light_size: "22 × 49 × 9 cm",
        led_count: "160 High-Efficiency LEDs",
        working_time: "2 Days Backup (First 6 Hours 100% Brightness / After 6 Hours 80%)",
        driver: "Inbuilt DC-DC",
        beam_angle: "120° Wide Angle",
        waterproof: "IP67 Waterproof",
        working_mode: "Light Control + Remote Control",
        installation_height: "5 - 6 m",
        standards: "IS: 15885 / IS: 16104 / IEC 62384 (latest)"
      }
    }
  },
  {
    id: "prod-frk-800w-white",
    slug: "solar-streetlight-800w-white",
    name: "Solar Streetlight 800W (White)",
    subtitle: "High-Lumen Crisp Daylight White Street Light",
    description: "Built for maximum nighttime clarity and security. Equipped with 100W solar panel and 80,000mAh battery powering 88 high-output LEDs at 6500K daylight white.",
    category: "Commercial",
    wattage_range: "800W (100W Solar Panel)",
    best_for: "Commercial complexes, school & college campuses, industrial yards, and arterial roads",
    why_choose: "Superior 6500K daylight clarity combined with 100W heavy panel for uninterrupted operation.",
    keep_in_mind: "First 6 hours operate at 100% full brightness, transitioning automatically to 80% to conserve battery until dawn.",
    image_url: "/images/products/solar-streetlight-800w-white-fixture.webp",
    fixture_image_url: "/images/products/solar-streetlight-800w-white-fixture.webp",
    lifestyle_image_url: "/images/products/solar-streetlight-800w-white-install.webp",
    is_active: true,
    sort_order: 4,
    specs: {
      panel: {
        size: "760 × 580 × 25 mm",
        power: "100 W",
        voc: "21.95 V",
        vmax: "19.23 V",
        isc: "4.47 A",
        imax: "4.23 A",
        noct: "45°C"
      },
      battery: {
        name: "Lithium Iron Phosphate (LiFePO4)",
        capacity: "80,000 mAh (Ensures Autonomy in Cloudy Days)",
        lifespan: "Over 10 Years",
        charging_time: "05 - 06 Hrs (Normal Sunlight)",
        backup: "2 Days Full Backup",
        protections: "Overcharge, Deep Discharge, Short Circuit, Over-current, Over-voltage, Under-voltage, Open Circuit",
        ip_rating: "IP67 (better than IP66)"
      },
      lighting: {
        housing: "High Pressure Aluminium Die-Cast",
        lamp_material: "Die Casting Aluminium + PC Lens",
        pir_sensor: "Optional (Energy Saving Feature)",
        features: "Flicker-free, Dimming Option",
        lumens: "2,178.04 lm",
        lumens_per_watt: "140 lm/W",
        color_temp: "6500K Crisp Daylight White",
        light_size: "22 × 49 × 9 cm",
        led_count: "88 High-Power LEDs",
        working_time: "2 Days Backup (First 6 Hours 100% Brightness / After 6 Hours 80%)",
        driver: "Inbuilt DC-DC",
        beam_angle: "120° Wide Angle",
        waterproof: "IP67 Waterproof",
        working_mode: "Light Control + Remote Control",
        installation_height: "5 - 6 m",
        standards: "IS: 15885 / IS: 16104 / IEC 62384 (latest)"
      }
    }
  },
  {
    id: "prod-frk-1000w",
    slug: "solar-streetlight-1000w",
    name: "Solar Streetlight 1000W",
    subtitle: "Heavy-Duty 4,884 Lumen Commercial Luminaire with 150W Panel",
    description: "Heavy-duty commercial streetlight generating 4,884.84 lumens. Powered by an oversized 150W solar panel and massive 100,000mAh LiFePO4 battery pack for large open zones.",
    category: "Heavy-Duty Commercial",
    wattage_range: "1000W (150W Solar Panel)",
    best_for: "Township main roads, factory perimeters, truck parking bays, and large sports grounds",
    why_choose: "Blazing 4,884.84 lumens output with 150W panel and 100,000mAh storage for unmatched coverage and safety.",
    keep_in_mind: "Requires standard pole diameter 60-76mm with heavy-duty civil foundation.",
    image_url: "/images/products/solar-streetlight-1000w-fixture.webp",
    fixture_image_url: "/images/products/solar-streetlight-1000w-fixture.webp",
    lifestyle_image_url: "/images/products/solar-streetlight-1000w-install.webp",
    is_active: true,
    sort_order: 5,
    specs: {
      panel: {
        size: "960 × 580 × 25 mm",
        power: "150 W",
        voc: "22.64 V",
        vmax: "19.83 V",
        isc: "5.35 A",
        imax: "5.06 A",
        noct: "45°C"
      },
      battery: {
        name: "Lithium Iron Phosphate (LiFePO4)",
        capacity: "100,000 mAh (Ensures Autonomy in Cloudy Days)",
        lifespan: "Over 10 Years",
        charging_time: "05 - 06 Hrs (Normal Sunlight)",
        backup: "2 Days Full Backup",
        protections: "Overcharge, Deep Discharge, Short Circuit, Over-current, Over-voltage, Under-voltage, Open Circuit",
        ip_rating: "IP67 or above"
      },
      lighting: {
        housing: "High Pressure Aluminium Die-Cast",
        lamp_material: "Die Casting Aluminium + PC Lens",
        pir_sensor: "Optional (Energy Saving Feature)",
        features: "Flicker-free, Dimming Option",
        lumens: "4,884.84 lm",
        lumens_per_watt: "140 lm/W",
        color_temp: "6500K Daylight White",
        light_size: "24 × 45 × 8 cm",
        led_count: "144 High-Efficiency LEDs",
        working_time: "2 Days Backup (First 6 Hours 100% Brightness / After 6 Hours 80%)",
        driver: "Inbuilt DC-DC",
        beam_angle: "120° Wide Angle",
        waterproof: "IP67 Waterproof",
        working_mode: "Light Control + Remote Control",
        installation_height: "5 - 6 m",
        standards: "IS: 15885 / IS: 16104 / IEC 62384 (latest)"
      }
    }
  },
  {
    id: "prod-frk-1200w",
    slug: "solar-streetlight-1200w",
    name: "Solar Streetlight 1200W",
    subtitle: "Flagship Highway & Municipal Luminaire with 120,000mAh Battery",
    description: "FRK's flagship ultra-high capacity solar street light. Delivers 4,884.84 lumens with 204 LEDs, 150W solar module, and an unmatched 120,000mAh battery bank for extreme autonomy.",
    category: "Municipal & Highway Grade",
    wattage_range: "1200W (150W Solar Panel)",
    best_for: "Highway bypasses, Panchayat major roads, logistics depots, port perimeters, and railway siding areas",
    why_choose: "Industry-leading 120,000mAh battery capacity guarantees uninterrupted lighting through continuous monsoon downpours.",
    keep_in_mind: "Engineered for 5-6m pole mounting with reinforced die-cast bracket for high wind tolerance.",
    image_url: "/images/products/solar-streetlight-1200w-fixture.webp",
    fixture_image_url: "/images/products/solar-streetlight-1200w-fixture.webp",
    lifestyle_image_url: "/images/products/solar-streetlight-1200w-install.webp",
    is_active: true,
    sort_order: 6,
    specs: {
      panel: {
        size: "980 × 580 × 25 mm",
        power: "150 W",
        voc: "22.64 V",
        vmax: "19.83 V",
        isc: "5.35 A",
        imax: "5.06 A",
        noct: "45°C"
      },
      battery: {
        name: "Lithium Iron Phosphate (LiFePO4)",
        capacity: "120,000 mAh (Ensures Autonomy in Cloudy Days)",
        lifespan: "Over 10 Years",
        charging_time: "05 - 06 Hrs (Normal Sunlight)",
        backup: "2 Days Full Backup",
        protections: "Overcharge, Deep Discharge, Short Circuit, Over-current, Over-voltage, Under-voltage, Open Circuit",
        ip_rating: "IP67 (better than IP65)"
      },
      lighting: {
        housing: "High Pressure Aluminium Die-Cast",
        lamp_material: "Die Casting Aluminium + PC Lens",
        pir_sensor: "Optional (Energy Saving Feature)",
        features: "Flicker-free, Dimming Option",
        lumens: "4,884.84 lm",
        lumens_per_watt: "140 lm/W",
        color_temp: "6500K Daylight White",
        light_size: "42 × 33 × 75 cm",
        led_count: "204 High-Output LEDs",
        working_time: "2 Days Backup (First 6 Hours 100% Brightness / After 6 Hours 80%)",
        driver: "Inbuilt DC-DC",
        beam_angle: "120° Wide Angle",
        waterproof: "IP67 Waterproof",
        working_mode: "Light Control + Remote Control",
        installation_height: "5 - 6 m",
        standards: "IS: 15885 / IS: 16104 / IEC 62384 (latest)"
      }
    }
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

export const INITIAL_INSTALLATION_STORIES: InstallationStory[] = [
  {
    id: "story-1",
    slug: "residential-street-lighting",
    title: "Residential Street Lighting",
    location: "Kozhikode, Kerala",
    category: "Solar Street Lights",
    image_url: "/images/frk14.jpg",
    description: "Complete dusk-to-dawn split-type solar street lighting project covering private colony access roads with high lumen efficiency.",
    sort_order: 1
  },
  {
    id: "story-2",
    slug: "home-compound-lighting",
    title: "Home Compound Lighting",
    location: "Malappuram, Kerala",
    category: "Residential",
    image_url: "/images/frk15.jpg",
    description: "Villa perimeter solar street lights installed on 5m powder-coated poles ensuring security and zero electricity costs.",
    sort_order: 2
  },
  {
    id: "story-3",
    slug: "industrial-area-lighting",
    title: "Industrial Area Lighting",
    location: "Thrissur, Kerala",
    category: "Commercial",
    image_url: "/images/frk16.jpg",
    description: "High-power solar flood lighting across factory dispatch bays, raw material yards, and perimeter security walls.",
    sort_order: 3
  },
  {
    id: "story-4",
    slug: "resort-pathway-lighting",
    title: "Resort Pathway Lighting",
    location: "Wayanad, Kerala",
    category: "Solar Street Lights",
    image_url: "/images/frk13.jpg",
    description: "Warm solar path fixtures installed across hillside eco-resort walkways without disrupting landscape soil or roots.",
    sort_order: 4
  },
  {
    id: "story-5",
    slug: "village-road-project",
    title: "Village Road Project",
    location: "Kannur, Kerala",
    category: "Solar Street Lights",
    image_url: "/images/frk17.jpg",
    description: "Panchayat road lighting initiative delivering uninterrupted 2-day monsoon backup for rural junctions and curves.",
    sort_order: 5
  },
  {
    id: "story-6",
    slug: "commercial-property",
    title: "Commercial Property",
    location: "Kottayam, Kerala",
    category: "Solar Flood Lights",
    image_url: "/images/frk10.jpg",
    description: "Commercial plaza parking and facade lighting powered entirely by rooftop solar arrays and LiFePO4 battery banks.",
    sort_order: 6
  }
];

export const INITIAL_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: "test-1",
    name: "Shafeeq",
    location: "Kozhikode, Kerala",
    comment: "Very good product and professional installation. The brightness is excellent and working perfectly.",
    rating: 5,
    avatar_url: "/images/avatars/user1.svg",
    sort_order: 1
  },
  {
    id: "test-2",
    name: "Ramesh",
    location: "Malappuram, Kerala",
    comment: "FRK team guided us well from selection to installation. Highly recommended.",
    rating: 5,
    avatar_url: "/images/avatars/user2.svg",
    sort_order: 2
  },
  {
    id: "test-3",
    name: "Aji Kumar",
    location: "Kannur, Kerala",
    comment: "Very satisfied with the service. Installation was neat and on time.",
    rating: 5,
    avatar_url: "/images/avatars/user3.svg",
    sort_order: 3
  },
  {
    id: "test-4",
    name: "Fathima",
    location: "Kottayam, Kerala",
    comment: "Good quality light and excellent customer support even after installation.",
    rating: 5,
    avatar_url: "/images/avatars/user4.svg",
    sort_order: 4
  }
];

let memoryBlogs = [...INITIAL_BLOGS];
let memoryProducts = [...INITIAL_PRODUCTS];
let memoryApplications = [...INITIAL_APPLICATIONS];
let memoryInstallationStories = [...INITIAL_INSTALLATION_STORIES];
let memoryTestimonials = [...INITIAL_TESTIMONIALS];
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

const isUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

export async function getBlogs(): Promise<Blog[]> {
  let dbBlogs: Blog[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        dbBlogs = data as Blog[];
      }
    } catch (e) {
      console.warn("Supabase blogs fetch failed, using memory store:", e);
    }
  }

  if (dbBlogs.length > 0) {
    const dbSlugs = new Set(dbBlogs.map((b) => b.slug));
    const extraMemory = memoryBlogs.filter((b) => !dbSlugs.has(b.slug));
    return [...dbBlogs, ...extraMemory];
  }

  return memoryBlogs;
}

export async function saveBlog(blog: Partial<Blog>): Promise<Blog> {
  const isEdit = Boolean(blog.id);
  const now = new Date().toISOString();
  const id = blog.id || `blog-${Date.now()}`;
  const slug = blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`;

  let updatedBlog: Blog = {
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
    updated_at: now,
    prev_blog_id: blog.prev_blog_id,
    next_blog_id: blog.next_blog_id,
    related_blog_ids: blog.related_blog_ids
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Core payload guaranteed to exist on all Supabase blogs tables
      const corePayload: Record<string, any> = {
        slug: updatedBlog.slug,
        title: updatedBlog.title,
        excerpt: updatedBlog.excerpt,
        content: updatedBlog.content,
        category: 'Guide',
        read_time: updatedBlog.read_time,
        author: updatedBlog.author,
        image_url: updatedBlog.image_url,
        published: updatedBlog.published,
        created_at: updatedBlog.created_at,
        updated_at: updatedBlog.updated_at
      };

      // 2. Full payload including optional navigation columns
      const fullPayload: Record<string, any> = { ...corePayload };
      if (updatedBlog.prev_blog_id) fullPayload.prev_blog_id = updatedBlog.prev_blog_id;
      if (updatedBlog.next_blog_id) fullPayload.next_blog_id = updatedBlog.next_blog_id;
      if (updatedBlog.related_blog_ids) fullPayload.related_blog_ids = updatedBlog.related_blog_ids;

      if (isEdit && isUUID(blog.id)) {
        fullPayload.id = blog.id;
        corePayload.id = blog.id;
        const { error } = await supabase.from('blogs').upsert([fullPayload]).select();
        if (error) {
          console.warn("Supabase saveBlog full payload warning, falling back to core payload:", error.message);
          await supabase.from('blogs').upsert([corePayload], { onConflict: 'slug' });
        }
      } else {
        const { data, error } = await supabase.from('blogs').insert([fullPayload]).select();
        if (!error && data && data.length > 0 && data[0].id) {
          updatedBlog.id = data[0].id;
        } else if (error) {
          console.warn("Supabase saveBlog full payload error, falling back to core payload:", error.message);
          const { data: coreData, error: coreErr } = await supabase.from('blogs').upsert([corePayload], { onConflict: 'slug' }).select();
          if (!coreErr && coreData && coreData.length > 0 && coreData[0].id) {
            updatedBlog.id = coreData[0].id;
          }
        }
      }
    } catch (e) {
      console.warn("Supabase saveBlog exception:", e);
    }
  }

  if (isEdit) {
    memoryBlogs = memoryBlogs.map((b) => (b.id === updatedBlog.id || b.slug === updatedBlog.slug ? updatedBlog : b));
  } else {
    memoryBlogs = [updatedBlog, ...memoryBlogs.filter((b) => b.slug !== updatedBlog.slug)];
  }

  return updatedBlog;
}

export async function deleteBlog(id: string): Promise<boolean> {
  memoryBlogs = memoryBlogs.filter((b) => b.id !== id);
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
  let dbProducts: Product[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        dbProducts = data as Product[];
      }
    } catch (e) {
      console.warn("Supabase products fetch failed:", e);
    }
  }

  if (dbProducts.length > 0) {
    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    const extraMemory = memoryProducts.filter((p) => !dbSlugs.has(p.slug));
    const enrichedDb = dbProducts.map((dbp) => {
      const initial = INITIAL_PRODUCTS.find((ip) => ip.slug === dbp.slug);
      return {
        ...initial,
        ...dbp,
        fixture_image_url: dbp.fixture_image_url || initial?.fixture_image_url || dbp.image_url,
        lifestyle_image_url: dbp.lifestyle_image_url || initial?.lifestyle_image_url,
        specs: dbp.specs || initial?.specs
      };
    });
    return [...enrichedDb, ...extraMemory];
  }

  return memoryProducts;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const isEdit = Boolean(product.id);
  const id = product.id || `prod-${Date.now()}`;
  const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

  let updatedProd: Product = {
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
    fixture_image_url: product.fixture_image_url || product.image_url || "/images/frk4.webp",
    lifestyle_image_url: product.lifestyle_image_url,
    specs: product.specs,
    is_active: product.is_active !== undefined ? product.is_active : true,
    sort_order: product.sort_order || memoryProducts.length + 1
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const corePayload: Record<string, any> = {
        slug: updatedProd.slug,
        name: updatedProd.name,
        subtitle: updatedProd.subtitle,
        description: updatedProd.description,
        category: updatedProd.category,
        wattage_range: updatedProd.wattage_range,
        best_for: updatedProd.best_for,
        why_choose: updatedProd.why_choose,
        keep_in_mind: updatedProd.keep_in_mind,
        image_url: updatedProd.image_url,
        is_active: updatedProd.is_active,
        sort_order: updatedProd.sort_order
      };

      const fullPayload: Record<string, any> = {
        ...corePayload,
        fixture_image_url: updatedProd.fixture_image_url,
        lifestyle_image_url: updatedProd.lifestyle_image_url,
        specs: updatedProd.specs
      };

      if (isEdit && isUUID(product.id)) {
        fullPayload.id = product.id;
        corePayload.id = product.id;
        const { error } = await supabase.from('products').upsert([fullPayload], { onConflict: 'slug' }).select();
        if (error) {
          console.warn("Supabase saveProduct full payload fallback:", error.message);
          await supabase.from('products').upsert([corePayload], { onConflict: 'slug' });
        }
      } else {
        const { data, error } = await supabase.from('products').insert([fullPayload]).select();
        if (!error && data && data.length > 0 && data[0].id) {
          updatedProd.id = data[0].id;
        } else if (error) {
          console.warn("Supabase saveProduct full payload insert fallback:", error.message);
          const { data: cData } = await supabase.from('products').upsert([corePayload], { onConflict: 'slug' }).select();
          if (cData && cData.length > 0 && cData[0].id) {
            updatedProd.id = cData[0].id;
          }
        }
      }
    } catch (e) {
      console.warn("Supabase saveProduct error:", e);
    }
  }

  if (isEdit) {
    memoryProducts = memoryProducts.map((p) => (p.id === updatedProd.id || p.slug === updatedProd.slug ? updatedProd : p));
  } else {
    memoryProducts = [updatedProd, ...memoryProducts.filter((p) => p.slug !== updatedProd.slug)];
  }

  return updatedProd;
}

export async function deleteProduct(id: string): Promise<boolean> {
  memoryProducts = memoryProducts.filter((p) => p.id !== id);
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
  let dbApps: ApplicationItem[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('applications').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        dbApps = data as ApplicationItem[];
      }
    } catch (e) {
      console.warn("Supabase applications fetch failed:", e);
    }
  }

  if (dbApps.length > 0) {
    const dbSlugs = new Set(dbApps.map((a) => a.slug));
    const extraMemory = memoryApplications.filter((a) => !dbSlugs.has(a.slug));
    return [...dbApps, ...extraMemory];
  }

  return memoryApplications;
}

export async function saveApplication(appItem: Partial<ApplicationItem>): Promise<ApplicationItem> {
  const isEdit = Boolean(appItem.id);
  const id = appItem.id || `app-${Date.now()}`;
  const slug = appItem.slug || appItem.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `app-${Date.now()}`;

  let updatedApp: ApplicationItem = {
    id,
    slug,
    title: appItem.title || 'New Application',
    description: appItem.description || '',
    image_url: appItem.image_url || '',
    sort_order: appItem.sort_order || memoryApplications.length + 1,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload: Record<string, any> = { ...updatedApp };
      if (!isUUID(appItem.id)) {
        delete dbPayload.id;
      }
      const { data, error } = await supabase.from('applications').upsert([dbPayload], { onConflict: 'slug' }).select();
      if (!error && data && data.length > 0 && data[0].id) {
        updatedApp.id = data[0].id;
      }
    } catch (e) {
      console.warn("Supabase saveApplication error:", e);
    }
  }

  if (isEdit) {
    memoryApplications = memoryApplications.map((a) => (a.id === updatedApp.id || a.slug === updatedApp.slug ? updatedApp : a));
  } else {
    memoryApplications = [updatedApp, ...memoryApplications.filter((a) => a.slug !== updatedApp.slug)];
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

// --- INSTALLATION STORIES ---
export async function getInstallationStories(): Promise<InstallationStory[]> {
  let dbStories: InstallationStory[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('installation_stories').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        dbStories = data as InstallationStory[];
      }
    } catch (e) {
      console.warn("Supabase installation_stories fetch failed:", e);
    }
  }

  if (dbStories.length > 0) {
    const dbSlugs = new Set(dbStories.map((s) => s.slug));
    const extraMemory = memoryInstallationStories.filter((s) => !dbSlugs.has(s.slug));
    return [...dbStories, ...extraMemory];
  }

  return memoryInstallationStories;
}

export async function saveInstallationStory(story: Partial<InstallationStory>): Promise<InstallationStory> {
  const isEdit = Boolean(story.id);
  const id = story.id || `story-${Date.now()}`;
  const slug = story.slug || story.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `story-${Date.now()}`;

  const updatedStory: InstallationStory = {
    id,
    slug,
    title: story.title || "Solar Installation Project",
    location: story.location || "Kerala, India",
    category: story.category || "Solar Street Lights",
    image_url: story.image_url || "/images/frk14.jpg",
    description: story.description || "",
    sort_order: story.sort_order || memoryInstallationStories.length + 1,
    created_at: story.created_at || new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload: Record<string, any> = { ...updatedStory };
      if (!isUUID(story.id)) {
        delete dbPayload.id;
      }
      const { data, error } = await supabase.from('installation_stories').upsert([dbPayload], { onConflict: 'slug' }).select();
      if (!error && data && data.length > 0 && data[0].id) {
        updatedStory.id = data[0].id;
      }
    } catch (e) {
      console.warn("Supabase saveInstallationStory warning:", e);
    }
  }

  if (isEdit) {
    memoryInstallationStories = memoryInstallationStories.map((s) => (s.id === updatedStory.id || s.slug === updatedStory.slug ? updatedStory : s));
  } else {
    memoryInstallationStories = [updatedStory, ...memoryInstallationStories.filter((s) => s.slug !== updatedStory.slug)];
  }

  return updatedStory;
}

export async function deleteInstallationStory(id: string): Promise<boolean> {
  memoryInstallationStories = memoryInstallationStories.filter((s) => s.id !== id);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('installation_stories').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase deleteInstallationStory error:", e);
    }
  }
  return true;
}

// --- TESTIMONIALS ---
export async function getTestimonials(): Promise<CustomerTestimonial[]> {
  let dbTestimonials: CustomerTestimonial[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        dbTestimonials = data as CustomerTestimonial[];
      }
    } catch (e) {
      console.warn("Supabase testimonials fetch failed:", e);
    }
  }

  if (dbTestimonials.length > 0) {
    const dbIds = new Set(dbTestimonials.map((t) => t.id));
    const extraMemory = memoryTestimonials.filter((t) => !dbIds.has(t.id));
    return [...dbTestimonials, ...extraMemory];
  }

  return memoryTestimonials;
}

export async function saveTestimonial(testimonial: Partial<CustomerTestimonial>): Promise<CustomerTestimonial> {
  const isEdit = Boolean(testimonial.id);
  const id = testimonial.id || `test-${Date.now()}`;

  const updatedTestimonial: CustomerTestimonial = {
    id,
    name: testimonial.name || "Customer",
    location: testimonial.location || "Kerala, India",
    comment: testimonial.comment || "Great service and lighting performance.",
    rating: testimonial.rating || 5,
    avatar_url: testimonial.avatar_url || "/images/avatars/user1.svg",
    sort_order: testimonial.sort_order || memoryTestimonials.length + 1,
    created_at: testimonial.created_at || new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload: Record<string, any> = { ...updatedTestimonial };
      if (!isUUID(testimonial.id)) {
        delete dbPayload.id;
      }
      const { data, error } = await supabase.from('testimonials').upsert([dbPayload]).select();
      if (!error && data && data.length > 0 && data[0].id) {
        updatedTestimonial.id = data[0].id;
      }
    } catch (e) {
      console.warn("Supabase saveTestimonial warning:", e);
    }
  }

  if (isEdit) {
    memoryTestimonials = memoryTestimonials.map((t) => (t.id === updatedTestimonial.id ? updatedTestimonial : t));
  } else {
    memoryTestimonials = [updatedTestimonial, ...memoryTestimonials.filter((t) => t.id !== updatedTestimonial.id)];
  }

  return updatedTestimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  memoryTestimonials = memoryTestimonials.filter((t) => t.id !== id);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('testimonials').delete().eq('id', id);
    } catch (e) {
      console.warn("Supabase deleteTestimonial error:", e);
    }
  }
  return true;
}
