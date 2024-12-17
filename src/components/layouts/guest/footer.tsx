import Link from 'next/link';
import { Github, Twitter, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-gray-800/30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:3rem_3rem]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left side */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart className="h-3 w-3 text-red-500/70" />
            <span>{currentYear} All rights reserved</span>
            <span className="mx-2 text-gray-800">•</span>
            <Link 
              href="mailto:contact@frederickdineen.com"
              className="text-gray-500 transition-colors hover:text-gray-300"
            >
              contact@frederickdineen.com
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/frederickdineendev/codenotify"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative">
                  <Github className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                  <span className="absolute -inset-2 animate-ping bg-purple-400/40 opacity-0 rounded-full group-hover:opacity-100" />
                </div>
              </Link>

              <Link
                href="https://twitter.com/frederickdineen"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative">
                  <Twitter className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                  <span className="absolute -inset-2 animate-ping bg-blue-400/40 opacity-0 rounded-full group-hover:opacity-100" />
                </div>
              </Link>

              <Link
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative">
                  <ExternalLink className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                  <span className="absolute -inset-2 animate-ping bg-purple-400/40 opacity-0 rounded-full group-hover:opacity-100" />
                </div>
              </Link>
            </div>

            <div className="h-4 w-px bg-gray-800" />

            <p className="group text-sm text-gray-500">
              Made with
              <span className="mx-1 inline-block transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse">❤️</span>
              by Frederick Dineen
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
