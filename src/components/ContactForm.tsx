'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  whatsappNumber: string;
}

export default function ContactForm({ whatsappNumber }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    project_type: 'Road or street',
    details: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save inquiry to DB in background
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.error('Failed to save inquiry to database', err);
    }

    // Formulate WhatsApp message text
    const messageLines = [
      `*New Lighting Inquiry from Website*`,
      ``,
      `*Name:* ${formData.name}`,
      `*Phone/WhatsApp:* ${formData.contact}`,
      `*Location:* ${formData.location || 'Not specified'}`,
      `*Project Type:* ${formData.project_type}`,
      `*Details:* ${formData.details || 'None provided'}`
    ];
    const text = encodeURIComponent(messageLines.join('\n'));

    // Clean up whatsapp phone number
    const cleanNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';

    const targetUrl = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${text}`
      : `https://wa.me/?text=${text}`;

    setSubmitted(true);
    setLoading(false);

    // Redirect to WhatsApp
    window.open(targetUrl, '_blank');
  };

  return (
    <div>
      {submitted ? (
        <div className="bg-[#f6f4ee] border border-[#e4e2da] rounded-xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-[#1f2220]">Inquiry Sent!</h3>
          <p className="text-sm text-[#5b605b]">
            Your inquiry is opening in WhatsApp. If it didn't open automatically, please click below.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#9a6f0c] underline font-semibold cursor-pointer"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Your name *</label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2.5 text-sm text-[#1f2220] focus:outline-none focus:border-[#E4B241]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Phone or WhatsApp *</label>
            <input
              type="tel"
              required
              placeholder="Phone number"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2.5 text-sm text-[#1f2220] focus:outline-none focus:border-[#E4B241]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Site location</label>
            <input
              type="text"
              placeholder="Town and district"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2.5 text-sm text-[#1f2220] focus:outline-none focus:border-[#E4B241]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Project type</label>
            <select
              value={formData.project_type}
              onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
              className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2.5 text-sm text-[#1f2220] focus:outline-none focus:border-[#E4B241]"
            >
              <option>Road or street</option>
              <option>Residential layout</option>
              <option>Car park</option>
              <option>School or campus</option>
              <option>Factory or yard</option>
              <option>Farm or remote site</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2220] mb-1">Details</label>
            <textarea
              rows={4}
              placeholder="Number of lights, road length, hours of lighting needed"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2.5 text-sm text-[#1f2220] focus:outline-none focus:border-[#E4B241]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-md text-sm cursor-pointer inline-flex items-center gap-2 shadow-sm transition-colors"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Send WhatsApp</span>
          </button>
        </form>
      )}
    </div>
  );
}
