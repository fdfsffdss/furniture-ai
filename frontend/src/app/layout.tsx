import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '../components/NavBar';

export const metadata: Metadata = {
  title: 'DESIGNYX - AI-Powered Interior Design',
  description: 'Transform your interior design with AI-powered furniture visualization and personalized recommendations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-white">
        <NavBar />
        <main className="pt-20 pb-12 px-4">{children}</main>
      </body>
    </html>
  );
}
