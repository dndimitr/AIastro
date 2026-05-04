"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await fetch("/api/admin/auth/logout", { method: "POST" });
          router.replace("/admin/login");
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
      className="gap-2 rounded-xl border-white/15 bg-transparent text-white/80 hover:bg-white/5"
    >
      <LogOut className="size-4" />
      Изход
    </Button>
  );
}
