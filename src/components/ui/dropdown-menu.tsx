"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

const DropdownMenu = MenuPrimitive.Root

const DropdownMenuTrigger = MenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> & {
    align?: "start" | "center" | "end"
    side?: "top" | "bottom" | "left" | "right"
    sideOffset?: number
  }
>(({ className, align = "end", side = "bottom", sideOffset = 8, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      className="z-50"
    >
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          "min-w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-200", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
