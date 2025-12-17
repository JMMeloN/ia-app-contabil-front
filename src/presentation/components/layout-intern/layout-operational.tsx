import { ReactNode } from 'react';
import { SidebarOperational } from './sidebar-operational';

interface LayoutOperationalProps {
  children: ReactNode;
}

export function LayoutOperational({ children }: LayoutOperationalProps) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarOperational />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Mobile padding top */}
        <div className="lg:hidden h-16" />

        {/* Content */}
        <div className="container mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
