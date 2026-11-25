import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Stories & Installation Gallery | FRK Lighting Kerala',
  description: 'Explore real-world solar street light installations, customer reviews, and site photos across Kerala by FRK Lighting Solutions.',
  alternates: {
    canonical: 'https://www.frklighting.com/customer-stories',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.frklighting.com/customer-stories',
    title: 'Customer Stories & Installation Gallery | FRK Lighting Kerala',
    description: 'Explore real-world solar street light installations, customer reviews, and site photos across Kerala by FRK Lighting Solutions.',
  },
};

export default function CustomerStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

