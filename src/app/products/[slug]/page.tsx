import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  ArrowLeft,
  ShieldCheck,
  BatteryCharging,
  Sun,
  Zap,
  CheckCircle2,
  FileText,
  MessageCircle,
  Clock,
  Ruler,
  Maximize2,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import { getProducts } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Product Not Found | FRK Lighting' };
  }

  return {
    title: `${product.name} Technical Specifications | FRK Lighting Kerala`,
    description: `${product.description} Monocrystalline solar panel, LiFePO4 battery, IP67 waterproof certification, and 2-day rainy autonomy.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const specs = product.specs;
  const otherProducts = products.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-[#fcfbf7] border-b border-[#e8e6df] py-4">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#5b605b]">
            <Link href="/" className="hover:text-[#1f2220] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a3a19b]" />
            <Link href="/products" className="hover:text-[#1f2220] transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a3a19b]" />
            <span className="text-[#1f2220] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9a6f0c] hover:text-[#1f2220] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Products</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Top Product Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary Product Cutout / Fixture View */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#fbf9f4] border border-[#e5e3db] shadow-sm flex items-center justify-center p-6 group">
              <Image
                src={product.fixture_image_url || product.image_url || '/images/products/solar-streetlight-600w-s1-fixture.webp'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-[#1f2220] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="bg-[#E4B241] text-[#1f2220] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {product.wattage_range}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                IP67 Certified
              </div>
            </div>

            {/* Real World Site Installation Photo */}
            {product.lifestyle_image_url && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5b605b] font-medium px-1">
                  <span className="flex items-center gap-1 text-[#1f2220] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Actual On-Site Kerala Installation Photo
                  </span>
                  <span>5-6m Galvanized Pole</span>
                </div>
                <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-[#e5e3db] shadow-xs group">
                  <Image
                    src={product.lifestyle_image_url}
                    alt={`${product.name} installed view`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                    <p className="text-xs text-white/95 font-medium">
                      Installed with dusk-to-dawn intelligent solar controller & LiFePO4 battery enclosure.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance & Quality Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e6df] text-center">
                <Award className="w-5 h-5 text-[#9a6f0c] mx-auto mb-1" />
                <span className="block text-[11px] font-bold text-[#1f2220]">IS: 15885</span>
                <span className="block text-[10px] text-[#7d827d]">Indian Standard</span>
              </div>
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e6df] text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="block text-[11px] font-bold text-[#1f2220]">IEC 62384</span>
                <span className="block text-[10px] text-[#7d827d]">Safety Compliant</span>
              </div>
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e8e6df] text-center">
                <BatteryCharging className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <span className="block text-[11px] font-bold text-[#1f2220]">10+ Years</span>
                <span className="block text-[10px] text-[#7d827d]">LiFePO4 Chemistry</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Quick Specs & Ordering */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold font-serif text-[#9a6f0c] uppercase tracking-wider block">
                FRK Lighting Solutions • Official Product Series
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1f2220] tracking-tight">
                {product.name}
              </h1>
              <p className="text-base text-[#9a6f0c] font-semibold">
                {product.subtitle}
              </p>
              <p className="text-[#5b605b] text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fcfbf7] p-4 rounded-xl border border-[#e8e6df]">
              <div>
                <span className="block text-[11px] font-semibold text-[#7d827d] uppercase">Solar Panel</span>
                <span className="block text-sm font-bold text-[#1f2220]">{specs?.panel?.power || product.wattage_range}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-[#7d827d] uppercase">Battery Pack</span>
                <span className="block text-sm font-bold text-[#9a6f0c]">{specs?.battery?.capacity?.split(' ')[0] || 'LiFePO4'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-[#7d827d] uppercase">Rainy Autonomy</span>
                <span className="block text-sm font-bold text-emerald-700">2 Full Days</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-[#7d827d] uppercase">Lumen Output</span>
                <span className="block text-sm font-bold text-[#1f2220]">{specs?.lighting?.lumens || '2,178 lm'}</span>
              </div>
            </div>

            {/* Highlights Checklist */}
            <div className="space-y-2.5 text-sm text-[#5b605b] bg-white p-5 rounded-xl border border-[#e8e6df]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong className="text-[#1f2220]">Best Suited For:</strong> {product.best_for}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong className="text-[#1f2220]">Why Choose It:</strong> {product.why_choose}</span>
              </div>
              {product.keep_in_mind && (
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9a6f0c] mt-0.5 shrink-0" />
                  <span><strong className="text-[#1f2220]">Installation Guideline:</strong> {product.keep_in_mind}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={`https://wa.me/917025888461?text=Hello%20FRK%20Lighting,%20I%20would%20like%20a%20quotation%20and%20datasheet%20for%20${encodeURIComponent(product.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Chat & Get Instant Quote</span>
                </Link>

                <Link
                  href="/contact"
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Request Custom Site Quotation</span>
                </Link>
              </div>

              <p className="text-xs text-[#7d827d] text-center sm:text-left">
                ⚡ Includes complete supply, GI powder-coated or galvanized pole options, anchor bolts foundation, and on-site commissioning across Kerala.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Technical Datasheet Section */}
        {specs && (
          <section className="pt-8 border-t border-[#e8e6df] space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">
                Laboratory Certified Specifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1f2220]">
                Official Technical Datasheet
              </h2>
              <p className="text-sm text-[#5b605b] max-w-3xl">
                Certified laboratory testing specifications. Tested under standard test conditions (STC: 1000 W/m², AM 1.5, 25°C).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Table 1: Solar Panel Details */}
              <div className="bg-[#fcfbf7] rounded-xl border border-[#e8e6df] overflow-hidden shadow-xs">
                <div className="bg-[#1f2220] text-white px-5 py-3.5 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#E4B241]" />
                  <h3 className="font-serif font-bold text-sm">Solar Panel Details</h3>
                </div>
                <div className="p-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Panel Dimensions</span>
                    <span className="font-semibold text-[#1f2220]">{specs.panel?.size}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Rated Power (Pmax)</span>
                    <span className="font-bold text-[#9a6f0c]">{specs.panel?.power}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Open Circuit Voltage (Voc)</span>
                    <span className="font-semibold text-[#1f2220]">{specs.panel?.voc}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Rated Voltage (Vmax)</span>
                    <span className="font-semibold text-[#1f2220]">{specs.panel?.vmax}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Short Circuit Current (Isc)</span>
                    <span className="font-semibold text-[#1f2220]">{specs.panel?.isc}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Rated Current (Imax)</span>
                    <span className="font-semibold text-[#1f2220]">{specs.panel?.imax}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#5b605b]">NOCT Operating Temp</span>
                    <span className="font-semibold text-[#1f2220]">{specs.panel?.noct}</span>
                  </div>
                </div>
              </div>

              {/* Table 2: Battery Storage Details */}
              <div className="bg-[#fcfbf7] rounded-xl border border-[#e8e6df] overflow-hidden shadow-xs">
                <div className="bg-[#1f2220] text-white px-5 py-3.5 flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-[#E4B241]" />
                  <h3 className="font-serif font-bold text-sm">Battery & Storage Details</h3>
                </div>
                <div className="p-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Chemistry</span>
                    <span className="font-bold text-[#1f2220]">{specs.battery?.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Capacity</span>
                    <span className="font-bold text-[#9a6f0c]">{specs.battery?.capacity}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Lifespan</span>
                    <span className="font-semibold text-emerald-700">{specs.battery?.lifespan}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Full Sunlight Charge</span>
                    <span className="font-semibold text-[#1f2220]">{specs.battery?.charging_time}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Rainy Days Backup</span>
                    <span className="font-bold text-emerald-700">{specs.battery?.backup}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Ingress Seal</span>
                    <span className="font-semibold text-[#1f2220]">{specs.battery?.ip_rating}</span>
                  </div>
                  <div className="pt-1.5 text-[11px] text-[#5b605b]">
                    <strong className="text-[#1f2220] block mb-0.5">Built-in Protections:</strong>
                    {specs.battery?.protections}
                  </div>
                </div>
              </div>

              {/* Table 3: Lighting & Construction Details */}
              <div className="bg-[#fcfbf7] rounded-xl border border-[#e8e6df] overflow-hidden shadow-xs">
                <div className="bg-[#1f2220] text-white px-5 py-3.5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#E4B241]" />
                  <h3 className="font-serif font-bold text-sm">Lighting & Build Details</h3>
                </div>
                <div className="p-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Luminous Flux</span>
                    <span className="font-bold text-[#1f2220]">{specs.lighting?.lumens}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Lumen Efficiency</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.lumens_per_watt}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Color Temp (CCT)</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.color_temp}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">LED Matrix Count</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.led_count}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Housing Material</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.housing}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Beam Angle</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.beam_angle}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Working Mode</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.working_mode}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e8e6df]">
                    <span className="text-[#5b605b]">Mounting Height</span>
                    <span className="font-semibold text-[#1f2220]">{specs.lighting?.installation_height}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#5b605b]">Certifications</span>
                    <span className="font-semibold text-[#1f2220] text-right">{specs.lighting?.standards}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Working Mode Explanation Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#fbf9f4] to-[#f4f1e8] border border-[#e5e3db] flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 rounded-xl bg-white border border-[#e5e3db] shadow-xs shrink-0">
                <Clock className="w-8 h-8 text-[#9a6f0c]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-[#1f2220]">
                  Intelligent Dual-Stage Dimming Profile
                </h4>
                <p className="text-xs sm:text-sm text-[#5b605b] leading-relaxed">
                  To ensure 100% dusk-to-dawn continuity during heavy Kerala cloud cover, the luminaire automatically delivers <strong>100% full brightness for the first 6 peak evening hours</strong>, and then transitions seamlessly to <strong>80% output for the remaining hours until sunrise</strong>.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Other Models in Series */}
        {otherProducts.length > 0 && (
          <section className="pt-12 border-t border-[#e8e6df] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">
                  Alternative Models
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-serif text-[#1f2220]">
                  Explore Other Models in this Series
                </h3>
              </div>
              <Link
                href="/products"
                className="text-xs sm:text-sm font-bold text-[#9a6f0c] hover:text-[#1f2220] underline underline-offset-2"
              >
                View Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherProducts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group bg-[#fbf9f4] hover:bg-white rounded-xl border border-[#e5e3db] hover:border-[#E4B241] p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white border border-[#e8e6df] p-2">
                      <Image
                        src={p.fixture_image_url || p.image_url || '/images/products/solar-streetlight-600w-s1-fixture.webp'}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#9a6f0c] uppercase block">
                        {p.wattage_range}
                      </span>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#1f2220] group-hover:text-[#9a6f0c] transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#5b605b] line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#e8e6df] flex items-center justify-between text-xs font-semibold text-[#1f2220]">
                    <span>View Specifications</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-[#9a6f0c] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
