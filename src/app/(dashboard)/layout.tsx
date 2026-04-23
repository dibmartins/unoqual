"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 pb-10">
          {children}
        </main>
        <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200">
          <p className="font-medium">© {new Date().getFullYear()} Unoqual. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
