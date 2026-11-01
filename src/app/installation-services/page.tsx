import React from 'react';
import type { Metadata } from 'next';
import {
  getInstallationPageSettings,
  getInstallationServices,
  getInstallationProcessSteps,
  getSiteSettings
} from '@/lib/data';
import InstallationServicesView from '@/components/InstallationServicesView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getInstallationPageSettings();
  return {
    title: `${pageSettings.hero_title} | FRK Lighting Solutions Kerala`,
    description: pageSettings.hero_subtitle || 'FRK Lighting provides professional solar lighting installation across all 14 districts in Kerala.',
    openGraph: {
      title: `${pageSettings.hero_title} | FRK Lighting Solutions`,
      description: pageSettings.hero_subtitle,
      url: 'https://frklighting.com/installation-services',
      type: 'website',
    },
  };
}

export default async function InstallationServicesPage() {
  const [pageSettings, services, processSteps, siteSettings] = await Promise.all([
    getInstallationPageSettings(),
    getInstallationServices(),
    getInstallationProcessSteps(),
    getSiteSettings()
  ]);

  return (
    <InstallationServicesView
      pageSettings={pageSettings}
      services={services}
      processSteps={processSteps}
      siteSettings={siteSettings}
    />
  );
}
