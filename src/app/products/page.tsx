import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { ShieldCheck, BatteryCharging, Sun, Zap, CheckCircle2, ArrowRight, Download, Sliders, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Street Lights & Commercial Outdoor Lighting | FRK Lighting Kerala',
  description: 'Explore FRK Lighting solar street light models from 600W to 1200W with LiFePO4 batteries, IP67 waterproofing, 2-day rainy backup, and high-efficiency monocrystalline panels.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-0 pb-20 bg-white">
      {/* Hero Header */}
      <section className="bg-[#fcfbf7] border-b border-[#e6e4dc] py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E4B241]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E4B241]/15 text-[#9a6f0c] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#E4B241]/30">
            <Sun className="w-3.5 h-3.5 text-[#9a6f0c]" />
            Official FRK Lighting Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#1f2220] tracking-tight leading-tight">
            Solar Street Lighting Solutions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5b605b] max-w-2xl leading-relaxed">
            Engineered for high-humidity coastal climates, monsoon rain resilience, and maximum dusk-to-dawn reliability across Kerala. Complete with LiFePO4 battery banks and high-pressure die-cast aluminium bodies.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-[#1f2220]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#e4e2da] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              IP67 Waterproof
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#e4e2da] shadow-sm">
              <BatteryCharging className="w-4 h-4 text-[#9a6f0c]" />
              LiFePO4 10+ Year Lifespan
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#e4e2da] shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              2 Days Rainy Autonomy
            </span>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 space-y-16">
          {products.map((prod, index) => {
            const isEven = index % 2 === 0;
            const specs = prod.specs;

            return (
              <div
                key={prod.id || prod.slug}
                id={prod.slug}
                className="bg-white rounded-2xl border border-[#e5e3db] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                  {/* Left Column: Dual Imagery (Fixture + Real-world Installation) */}
                  <div className={`lg:col-span-5 bg-[#fbf9f4] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 ${isEven ? 'lg:border-r border-[#e5e3db]' : 'lg:order-2 lg:border-l border-[#e5e3db]'}`}>
                    <div className="space-y-4">
                      {/* Main Product Fixture */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#e8e6df] shadow-sm flex items-center justify-center p-4">
                        <Image
                          src={prod.fixture_image_url || prod.image_url || '/images/products/solar-streetlight-600w-s1-fixture.webp'}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute top-3 left-3 bg-[#1f2220]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {prod.category}
                        </div>
                        {specs?.battery?.ip_rating && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                            IP67
                          </div>
                        )}
                      </div>

                      {/* Real Installation Preview */}
                      {prod.lifestyle_image_url && (
                        <div className="relative aspect-[16/7] rounded-lg overflow-hidden border border-[#e8e6df] shadow-xs group">
                          <Image
                            src={prod.lifestyle_image_url}
                            alt={`${prod.name} installed view`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[11px] text-white/95 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#E4B241]" />
                              Real Installation View
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick highlight metric badges */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#e8e6df]/70 text-center">
                      <div className="bg-white p-2 rounded-lg border border-[#e8e6df]">
                        <span className="block text-[11px] text-[#5b605b] uppercase font-semibold">Panel</span>
                        <span className="block text-xs font-bold text-[#1f2220]">{specs?.panel?.power || prod.wattage_range || '60W+'}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-[#e8e6df]">
                        <span className="block text-[11px] text-[#5b605b] uppercase font-semibold">Battery</span>
                        <span className="block text-xs font-bold text-[#9a6f0c]">{specs?.battery?.capacity?.split(' ')[0] || 'LiFePO4'}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-[#e8e6df]">
                        <span className="block text-[11px] text-[#5b605b] uppercase font-semibold">Rain Backup</span>
                        <span className="block text-xs font-bold text-emerald-700">2 Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Full Details & Specifications */}
                  <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 ${isEven ? '' : 'lg:order-1'}`}>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#9a6f0c] uppercase tracking-wider">
                          Model Code: {prod.slug.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {prod.wattage_range}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1f2220]">
                        {prod.name}
                      </h2>
                      <p className="text-sm font-medium text-[#7d827d]">
                        {prod.subtitle}
                      </p>
                      <p className="text-[#5b605b] text-sm sm:text-base leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Technical Specs Mini-Grid */}
                      {specs && (
                        <div className="pt-2">
                          <h3 className="text-xs font-bold text-[#1f2220] uppercase tracking-wider mb-2 font-serif">
                            Technical Specifications
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#f8f7f2] p-3.5 rounded-xl border border-[#e8e6df]">
                            <div>
                              <span className="text-[#7d827d]">Solar Panel:</span>{' '}
                              <strong className="text-[#1f2220]">{specs.panel?.size} ({specs.panel?.power})</strong>
                            </div>
                            <div>
                              <span className="text-[#7d827d]">Battery Chemistry:</span>{' '}
                              <strong className="text-[#1f2220]">{specs.battery?.name?.split(' ')[0]} {specs.battery?.capacity?.split(' ')[0]}</strong>
                            </div>
                            <div>
                              <span className="text-[#7d827d]">Lumens & CCT:</span>{' '}
                              <strong className="text-[#1f2220]">{specs.lighting?.lumens} • {specs.lighting?.color_temp?.split(' ')[0]}</strong>
                            </div>
                            <div>
                              <span className="text-[#7d827d]">LED Matrix:</span>{' '}
                              <strong className="text-[#1f2220]">{specs.lighting?.led_count} ({specs.lighting?.lumens_per_watt})</strong>
                            </div>
                            <div>
                              <span className="text-[#7d827d]">Protection Rating:</span>{' '}
                              <strong className="text-emerald-700">{specs.battery?.ip_rating} Ingress Sealed</strong>
                            </div>
                            <div>
                              <span className="text-[#7d827d]">Mounting Height:</span>{' '}
                              <strong className="text-[#1f2220]">{specs.lighting?.installation_height}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Best suited bullet points */}
                      <div className="space-y-1.5 text-xs sm:text-sm text-[#5b605b] pt-1">
                        <div>
                          <b className="text-[#1f2220] font-semibold">Best for:</b> {prod.best_for}
                        </div>
                        <div>
                          <b className="text-[#1f2220] font-semibold">Why choose it:</b> {prod.why_choose}
                        </div>
                        {prod.keep_in_mind && (
                          <div>
                            <b className="text-[#1f2220] font-semibold">Mounting note:</b> {prod.keep_in_mind}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#e5e3db] flex flex-wrap items-center gap-3">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-2.5 rounded-lg text-sm inline-flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Full Technical Datasheet</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`https://wa.me/917025888461?text=Hello%20FRK%20Lighting,%20I%20am%20interested%20in%20${encodeURIComponent(prod.name)}%20for%20my%20site.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-white" />
                        <span>Enquire on WhatsApp</span>
                      </Link>
                      <Link
                        href="/contact"
                        className="bg-white hover:bg-[#f6f4ee] text-[#1f2220] border border-[#1f2220] font-bold px-5 py-2.5 rounded-lg text-sm inline-block transition-colors"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Comparison Matrix */}
      <section className="py-16 bg-[#fbf9f4] border-t border-[#e4e2da]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">
              Product Specification Comparison
            </h2>
            <p className="text-sm sm:text-base text-[#5b605b]">
              Quick comparison of technical parameters and performance ratings across all models.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e4e2da] bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm text-[#1f2220]">
              <thead className="bg-[#f6f4ee] font-serif font-bold border-b border-[#e4e2da]">
                <tr>
                  <th className="p-3.5">Model</th>
                  <th className="p-3.5">Panel Pmax</th>
                  <th className="p-3.5">Battery Capacity</th>
                  <th className="p-3.5">Lumen Output</th>
                  <th className="p-3.5">LED Matrix</th>
                  <th className="p-3.5">Rain Backup</th>
                  <th className="p-3.5">IP Rating</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e2da]">
                {products.map((p) => (
                  <tr key={p.slug} className="hover:bg-[#fcfbf9] transition-colors">
                    <td className="p-3.5 font-bold font-serif text-[#1f2220]">
                      {p.name}
                    </td>
                    <td className="p-3.5 text-[#5b605b]">
                      {p.specs?.panel?.power || p.wattage_range}
                    </td>
                    <td className="p-3.5 font-semibold text-[#9a6f0c]">
                      {p.specs?.battery?.capacity?.split(' ')[0] || '60000mAh'}
                    </td>
                    <td className="p-3.5 text-[#5b605b]">
                      {p.specs?.lighting?.lumens || '2178 lm'}
                    </td>
                    <td className="p-3.5 text-[#5b605b]">
                      {p.specs?.lighting?.led_count || 'Multi-chip'}
                    </td>
                    <td className="p-3.5 font-medium text-emerald-700">
                      2 Days Full
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        IP67
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/products/${p.slug}`}
                        className="text-[#9a6f0c] hover:text-[#1f2220] font-bold text-xs underline underline-offset-2"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-xl bg-[#1f2220] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold font-serif text-[#E4B241]">
                Need a Custom Project Quotation or Sizing Survey?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                We conduct free on-site measurements across Kerala, including pole height recommendations and lux calculations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                Request Site Survey
              </Link>
              <Link
                href="https://wa.me/917025888461?text=Hi%20FRK%20Lighting,%20please%20send%20the%20product%20details%20and%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                WhatsApp Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
