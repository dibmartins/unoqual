"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SidebarContent } from "./sidebar";
import { 
  Dialog, 
  DialogContent, 
  DialogPortal, 
  DialogOverlay,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-600">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        } />
        <DialogPortal>
          <DialogOverlay />
          <DialogContent 
            className="fixed inset-y-0 left-0 z-50 h-full w-72 max-w-sm translate-x-0 translate-y-0 border-r bg-slate-900 p-0 shadow-xl data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left transition-transform duration-300 rounded-none"
          >
            <div className="absolute right-4 top-4 z-50">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
                <span className="sr-only">Fechar menu</span>
              </Button>
            </div>
            <SidebarContent onItemClick={() => setOpen(false)} />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
