import type { Metadata } from 'next';
import { Public_Sans, Archivo } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getSiteSettings } from '@/lib/data';

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-serif' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://frklighting.com';

  return {
    title: {
      default: 'Solar street lights in Kerala | FRK Lighting Solutions',
      template: '%s | FRK Lighting Solutions'
    },
    description: settings.hero_subtitle,
    keywords: [
      'Solar street lights Kerala',
      'Solar flood lights Kerala',
      'All in one solar street light',
      'Split type solar street light',
      'Pathway solar lights',
      'Estate lighting Kerala',
      'FRK Lighting Solutions'
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: [
        { url: '/images/frk-logo.png', type: 'image/png' },
        { url: '/images/logo.png', type: 'image/png' },
      ],
      shortcut: '/images/frk-logo.png',
      apple: '/images/frk-logo.png',
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: baseUrl,
      title: 'Solar street lights in Kerala | FRK Lighting Solutions',
      description: settings.hero_subtitle,
      siteName: 'FRK Lighting Solutions',
      images: [
        {
          url: `${baseUrl}/images/frk-logo.png`,
          width: 800,
          height: 600,
          alt: 'FRK Lighting Solutions Logo',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FRK Lighting Solutions',
    url: 'https://frklighting.com',
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Kerala',
      addressCountry: 'IN'
    },
    areaServed: 'Kerala'
  };

  return (
    <html lang="en" className={`${publicSans.variable} ${archivo.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-[#1f2220] min-h-screen flex flex-col font-sans antialiased selection:bg-[#E4B241] selection:text-black">
        <Header settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
        <WhatsAppButton phone={settings.whatsapp} />
      </body>
    </html>
  );
}
