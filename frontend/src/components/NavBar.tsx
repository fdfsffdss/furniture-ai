'use client';

import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="fixed top-0 w-full bg-dark-bg bg-opacity-95 backdrop-blur border-b border-dark-border z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-main rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">DESIGNYX</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/upload" className="text-white hover:text-primary-light transition">
            Upload
          </Link>
          <Link href="/showroom" className="text-white hover:text-primary-light transition">
            AI Showroom
          </Link>
          <Link href="/gallery" className="text-white hover:text-primary-light transition">
            Gallery
          </Link>
          <Link
            href="/profile"
            className="px-4 py-2 bg-primary-main hover:bg-primary-light rounded-lg text-white font-semibold transition"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
