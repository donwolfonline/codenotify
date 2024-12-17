import { type ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
