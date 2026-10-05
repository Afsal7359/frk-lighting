import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getSiteSettings, getProducts, getApplications, getBlogs } from '@/lib/data';

export default async function HomePage() {
  const settings = await getSiteSettings();
  const products = await getProducts();
  const applications = await getApplications();
  const blogs = await getBlogs();
  const latestBlogs = blogs.slice(0, 3);

  const features = [
    { title: "No grid connection", desc: "Each light makes its own power" },
    { title: "Dusk-to-dawn", desc: "Automatic light sensor switching" },
    { title: "No cabling", desc: "Faster install, less civil work" },
    { title: "Low upkeep", desc: "LED lamps and sealed batteries" },
  ];

  const faqs = [
    {
      q: "Do solar lights work during the monsoon?",
      a: "Yes, if the battery is sized for it. We size the system for several cloudy days in a row, so lights keep running through the rainy season."
    },
    {
      q: "How long do the batteries last?",
      a: "It depends on the battery type, how deeply it is discharged and the heat it sits in. We quote the battery type and warranty terms in writing."
    },
    {
      q: "Do I need permission or an electricity connection?",
      a: "No electricity connection is needed. For public roads you may need local body approval, and we can supply the documents you need."
    },
    {
      q: "How long does installation take?",
      a: "Most jobs take a day or two for a small group of lights. Foundations need time to cure before poles go up."
    },
    {
      q: "Do you offer after-sales service?",
      a: "Yes. Call or message us on WhatsApp and we will arrange a visit."
    }
  ];

  return (
    <div className="space-y-0">
      {/* HERO SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-[#1f2220] tracking-tight leading-tight">
                {settings.hero_title}
              </h1>

              <p className="text-base sm:text-lg text-[#5b605b] max-w-xl">
                {settings.hero_subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href="/contact"
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-3 rounded-md text-base transition-colors"
                >
                  Get a quote
                </Link>

                <Link
                  href="/products"
                  className="bg-white hover:bg-[#f6f4ee] text-[#1f2220] border-2 border-[#1f2220] font-bold px-6 py-3 rounded-md text-base transition-colors"
                >
                  See our products
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden bg-[#f6f4ee] aspect-[4/5] border border-[#e4e2da]">
                <Image
                  src="/images/frk1.webp"
                  alt="Solar street light on a pole at dusk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP FEATURE RIBBON */}
      <section className="bg-[#242624] text-[#f2f0e7] py-7">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div key={idx}>
                <b className="block text-[#E4B241] font-bold font-serif text-base">{item.title}</b>
                <span className="text-xs text-[#c9c7bc]">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SOLAR STREET LIGHTING MAKES SENSE */}
      <section className="py-20 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="relative rounded-lg overflow-hidden bg-[#f6f4ee] aspect-[4/3] border border-[#e4e2da]">
                <Image
                  src="/images/frk5.jpg"
                  alt="Technicians installing a solar street light"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">
                Why solar street lighting makes sense
              </h2>
              <p className="text-[#5b605b] text-base">
                Conventional street lighting needs a trench, a cable and a connection to the supply before it gives any light. Solar lights need a foundation and a pole.
              </p>

              <ul className="space-y-3 pt-2 divide-y divide-[#e4e2da]">
                {[
                  { b: "Quicker to install.", t: "No digging up roads, driveways or compound walls." },
                  { b: "Nothing to pay monthly.", t: "The sun charges the battery every day." },
                  { b: "Keeps working in power cuts.", t: "Each light is independent." },
                  { b: "Safer from cable theft.", t: "There is no copper cable to steal." },
                  { b: "Easy to relocate.", t: "If your layout changes, the light moves with it." }
                ].map((item, idx) => (
                  <li key={idx} className="pt-3 text-sm text-[#5b605b]">
                    <b className="text-[#1f2220] font-serif font-bold">{item.b} </b>
                    <span>{item.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE SUPPLY */}
      <section className="py-20 bg-[#f6f4ee] border-y border-[#e4e2da]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">What we supply</h2>
            <p className="text-[#5b605b] text-base mt-1">
              Three families cover most jobs. <Link href="/products" className="underline font-semibold">Full range and comparison</Link>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((prod) => (
              <div key={prod.id} className="bg-white border border-[#e4e2da] rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] bg-[#f6f4ee]">
                    <Image
                      src={prod.image_url || "/images/all-in-one.jpg"}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold font-serif text-[#1f2220]">{prod.name}</h3>
                    <p className="text-xs text-[#5b605b] leading-relaxed">{prod.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE OUR LIGHTS ARE USED */}
      <section className="py-20 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">Where our lights are used</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white border border-[#e4e2da] rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] bg-[#f6f4ee]">
                    <Image
                      src={app.image_url || "/images/road.jpg"}
                      alt={app.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h3 className="text-lg font-bold font-serif text-[#1f2220]">{app.title}</h3>
                    <p className="text-xs text-[#5b605b] leading-relaxed">{app.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/applications" className="bg-white hover:bg-[#f6f4ee] text-[#1f2220] border-2 border-[#1f2220] font-bold px-6 py-3 rounded-md text-sm inline-block">
              More about applications
            </Link>
          </div>
        </div>
      </section>

      {/* HOW A SOLAR STREET LIGHT WORKS */}
      <section className="py-20 bg-[#f6f4ee] border-y border-[#e4e2da]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">How a solar street light works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "Step 1", title: "Daytime: the panel collects sun", desc: "The solar panel turns sunlight into electricity, even on bright cloudy days at a lower rate." },
              { step: "Step 2", title: "The battery stores it", desc: "A charge controller fills the battery and protects it from overcharging." },
              { step: "Step 3", title: "At dusk the light switches on", desc: "A sensor notices the dark and turns the LED on without any switch or timer." },
              { step: "Step 4", title: "At dawn it switches off", desc: "The cycle repeats every day. Many models can dim late at night to stretch battery life." }
            ].map((st, idx) => (
              <div key={idx} className="border-t-4 border-[#E4B241] pt-3 space-y-1">
                <span className="text-xs font-bold font-serif text-[#9a6f0c] block">{st.step}</span>
                <h3 className="text-base font-bold font-serif text-[#1f2220]">{st.title}</h3>
                <p className="text-xs text-[#5b605b] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUESTIONS WE HEAR OFTEN */}
      <section className="py-20 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">Questions we hear often</h2>
              <p className="text-[#5b605b] text-sm">
                Can't find yours? <Link href="/contact" className="underline font-semibold">Ask us directly</Link>.
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-[#e4e2da]">
              {faqs.map((faq, idx) => (
                <details key={idx} className="py-4 group">
                  <summary className="font-bold text-base text-[#1f2220] cursor-pointer list-none flex items-center justify-between font-serif">
                    <span>{faq.q}</span>
                    <ChevronRight className="w-5 h-5 text-[#9a6f0c] group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="text-[#5b605b] text-sm mt-3 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FROM THE BLOG */}
      <section className="py-20 bg-[#f6f4ee] border-t border-[#e4e2da]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">From the blog</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBlogs.map((blog) => (
              <div key={blog.id} className="bg-white border border-[#e4e2da] rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                  {blog.image_url && (
                    <div className="relative aspect-[16/9] bg-[#f6f4ee]">
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <span className="text-xs text-[#5b605b] font-medium block">
                      {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-base font-bold font-serif text-[#1f2220]">
                      <Link href={`/blog/${blog.slug}`} className="hover:underline">
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#5b605b] leading-relaxed">{blog.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
