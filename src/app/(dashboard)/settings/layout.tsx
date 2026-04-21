"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, Layers } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Organização",
      href: "/settings/organization",
      icon: Building2,
    },
    {
      label: "Unidades e Setores",
      href: "/settings/facilities",
      icon: Layers,
    },
    {
      label: "Usuários",
      href: "/settings/users",
      icon: Users,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Configurações</h1>
        <p className="text-slate-500 font-medium">Gerencie sua organização, usuários e unidades de saúde</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-8">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all font-bold text-sm ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
