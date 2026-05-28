"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import LegalAdviserCall from "@/components/ui/LegalAdviserCall";
import MobileRuntime from "@/components/mobile/MobileRuntime";
import { usePushNotifications } from "@/lib/use-push";
import { UserProvider, useUser } from "@/lib/user-context";
import { PanelLeftOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const { user } = useUser();
  const { t } = useI18n();

  // Auto-subscribe to push notifications
  usePushNotifications();

  useEffect(() => {
    setSidebarHidden(localStorage.getItem("society-sidebar-hidden") === "true");
  }, []);

  const hideSidebar = () => {
    localStorage.setItem("society-sidebar-hidden", "true");
    setSidebarOpen(false);
    setSidebarHidden(true);
  };

  const showSidebar = () => {
    localStorage.setItem("society-sidebar-hidden", "false");
    setSidebarHidden(false);
  };

  const handleMenuToggle = () => {
    if (sidebarHidden) {
      showSidebar();
      setSidebarOpen(true);
      return;
    }
    setSidebarOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {!sidebarHidden && (
        <Sidebar
          societyName={user.societyName}
          societyAddress={user.societyAddress}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onHide={hideSidebar}
          userRole={user.role}
        />
      )}
      {sidebarHidden && (
        <button
          type="button"
          onClick={showSidebar}
          className="fixed left-4 top-1/2 z-40 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-blue-100 bg-white/95 text-blue-700 shadow-lg shadow-blue-950/10 backdrop-blur transition-all hover:left-5 hover:bg-blue-50 lg:flex"
          title={t("Show sidebar")}
          aria-label={t("Show sidebar")}
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={user.name}
          userRole={user.role}
          userEmail={user.email}
          joinCode={user.joinCode}
          onMenuToggle={handleMenuToggle}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
      </div>
      <BottomNav userRole={user.role} />
      <LegalAdviserCall />
      <MobileRuntime />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}
