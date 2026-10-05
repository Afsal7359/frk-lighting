'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export default function QuoteModal({ isOpen, onClose, settings }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    project_type: 'Road or street',
    details: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.error('Failed to log inquiry', err);
    }

    // Format WhatsApp text
    const messageLines = [
      `*New Quote Request from Website*`,
      ``,
      `*Name:* ${formData.name}`,
      `*Phone/WhatsApp:* ${formData.contact}`,
      `*Location:* ${formData.location || 'Not specified'}`,
      `*Project Type:* ${formData.project_type}`,
      `*Details:* ${formData.details || 'None provided'}`
    ];
    const text = encodeURIComponent(messageLines.join('\n'));
    const phone = settings.whatsapp || settings.phone || '';
    const cleanNumber = phone.replace(/\D/g, '');

    const targetUrl = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${text}`
      : `https://wa.me/?text=${text}`;

    setSubmitted(true);
    setLoading(false);

    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#e4e2da] rounded-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#5b605b] hover:text-[#1f2220] rounded-full bg-[#f6f4ee] hover:bg-[#e4e2da] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#E4B241]/20 text-[#9a6f0c] rounded-full flex items-center justify-center mx-auto border border-[#E4B241]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1f2220] font-serif">Quote Request Received</h3>
            <p className="text-[#5b605b] text-sm max-w-md mx-auto">
              Thank you <strong>{formData.name}</strong>. Our technical team will review your requirements for {formData.project_type} and contact you shortly.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#242624] text-white font-bold px-6 py-2.5 rounded-md text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1f2220] font-serif">Request a Solar Lighting Quote</h2>
              <p className="text-[#5b605b] text-sm mt-1">
                Tell us about your site. We will reply with questions or a written proposal.
              </p>
            </div>

            {error ? (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Your name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anish Nair"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Phone or WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Site location</label>
                  <input
                    type="text"
                    placeholder="Town and district"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2220] mb-1">Project type</label>
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2220] mb-1">Details</label>
                <textarea
                  rows={3}
                  placeholder="Number of lights, road length, hours of lighting needed..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-white border border-[#c9c7bd] rounded-md px-3.5 py-2 text-[#1f2220] text-sm focus:outline-none focus:border-[#E4B241]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-[#c9c7bd] text-[#5b605b] hover:text-[#1f2220] text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-2.5 rounded-md text-sm flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <span>Opening WhatsApp...</span>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Send WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
