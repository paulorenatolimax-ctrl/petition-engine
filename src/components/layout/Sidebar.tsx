"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { APP_NAV_ITEMS } from "@/lib/config/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, pendingErrorsCount, queueCount } = useAppStore();

  return (
    <motion.aside
      className="hidden md:flex flex-col h-screen sticky top-0 left-0 bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 shadow-[2px_0_24px_rgba(0,0,0,0.6)]"
      animate={{ width: sidebarCollapsed ? "72px" : "260px" }}
      initial={false}
    >
      <div className="flex flex-col h-full">
        {/* Header Logo */}
        <div className="flex h-16 items-center justify-between px-4 py-4 mb-4">
          <div className="flex items-center gap-3 w-full">
            <div className="relative shrink-0 flex items-center justify-center w-10 h-10">
              <div
                className="w-9 h-9 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #00eaff 0%, #6366f1 100%)',
                  animation: 'float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite',
                  boxShadow: '0 0 20px rgba(0, 234, 255, 0.4)',
                }}
              />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex items-center justify-between flex-1"
                >
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="text-[15px] font-black tracking-widest text-[#00eaff] drop-shadow-[0_0_8px_rgba(0,234,255,0.4)]">PETITION</span>
                    <span className="text-[10px] font-medium tracking-[0.3em] text-[#64748b] -mt-1">ENGINE</span>
                  </div>
                  
                  <button 
                    onClick={toggleSidebar}
                    className="p-1 rounded bg-[#080d16] border border-[#00eaff]/10 hover:border-[#00eaff]/30 text-[#00eaff] transition-all shrink-0 hover:shadow-[0_0_10px_rgba(0,234,255,0.2)]"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {sidebarCollapsed && (
            <button 
              onClick={toggleSidebar}
              className="absolute right-[-12px] top-[24px] z-50 p-1 rounded-full bg-[#080d16] border border-[#00eaff]/20 text-[#00eaff] shadow-[0_0_10px_rgba(0,234,255,0.1)] hover:shadow-[0_0_15px_rgba(0,234,255,0.3)] transition-all"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto scrollbar-hide">
          {APP_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all relative group overflow-hidden",
                    isActive 
                      ? "bg-[rgba(0,234,255,0.06)] text-[#00eaff] shadow-[inset_3px_0_0_#00eaff]" 
                      : "text-[#a1b1cc] hover:bg-[rgba(0,234,255,0.05)] hover:text-[#e2e8f0]"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-all", isActive ? "text-[#00eaff] drop-shadow-[0_0_8px_rgba(0,234,255,0.5)]" : "group-hover:text-[#00c4d6]")} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className={cn("whitespace-nowrap flex-1 text-[13px] font-semibold tracking-wide", isActive ? "text-[#00eaff] drop-shadow-[0_0_5px_rgba(0,234,255,0.3)]" : "")}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Badges Desktop */}
                  {!sidebarCollapsed && item.label === 'Erros' && pendingErrorsCount > 0 && (
                    <Badge className="ml-auto flex h-[18px] w-[18px] items-center justify-center rounded-full p-0 shrink-0 bg-[#ff4757] text-white shadow-[0_0_10px_rgba(255,71,87,0.4)] border-none">
                      {pendingErrorsCount}
                    </Badge>
                  )}
                  {!sidebarCollapsed && item.label === 'Gerador' && queueCount > 0 && (
                    <Badge className="ml-auto bg-[#00eaff]/10 text-[#00eaff] border border-[#00eaff]/30 flex h-[18px] w-[18px] items-center justify-center rounded-full p-0 shrink-0 shadow-[0_0_8px_rgba(0,234,255,0.2)]">
                      {queueCount}
                    </Badge>
                  )}
                  
                  {/* Tooltip Badges (collapsed) */}
                  {sidebarCollapsed && item.label === 'Erros' && pendingErrorsCount > 0 && (
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#ff4757] shadow-[0_0_6px_rgba(255,71,87,0.6)]" />
                  )}
                  {sidebarCollapsed && item.label === 'Gerador' && queueCount > 0 && (
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#00eaff] shadow-[0_0_6px_rgba(0,234,255,0.6)]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border bg-[#080d16]/50">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-[#4b6584]">v1.0.0</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#2ed573]">Online</span>
                <div className="h-1.5 w-1.5 rounded-full bg-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.8)] animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.8)] animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
