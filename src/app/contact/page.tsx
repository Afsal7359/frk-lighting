import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';

import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact FRK Lighting Solutions by WhatsApp, phone or email for a solar street light quote.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-0 pb-20">
      {/* Sub Banner */}
      <section className="bg-[#f6f4ee] border-b border-[#e4e2da] py-14">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#1f2220]">Get a quote</h1>
          <p className="text-base text-[#5b605b] max-w-xl">
            Tell us about your site. We will reply with questions or a proposal directly on WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-7">
              <ContactForm whatsappNumber={settings.whatsapp || settings.phone} />
            </div>

            {/* Direct Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#1f2220]">Talk to us directly</h2>

              <ul className="space-y-4 text-sm divide-y divide-[#e4e2da]">
                <li className="pt-2">
                  <b className="block text-[#1f2220] font-serif mb-1">WhatsApp and phone</b>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-[#9a6f0c] font-bold hover:underline">
                    {settings.phone}
                  </a>
                </li>

                <li className="pt-4">
                  <b className="block text-[#1f2220] font-serif mb-1">Email</b>
                  <a href={`mailto:${settings.email}`} className="text-[#9a6f0c] hover:underline">
                    {settings.email}
                  </a>
                </li>

                <li className="pt-4">
                  <b className="block text-[#1f2220] font-serif mb-1">Instagram</b>
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[#9a6f0c] hover:underline">
                    {settings.instagram_handle}
                  </a>
                </li>

                <li className="pt-4">
                  <b className="block text-[#1f2220] font-serif mb-1">Service area</b>
                  <span className="text-[#5b605b]">{settings.service_area}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
