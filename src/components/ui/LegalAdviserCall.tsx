"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Scale } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface LegalAdviser {
  name: string;
  phone: string | null;
}

const normalizeTel = (phone: string) => phone.replace(/[^\d+]/g, "");

export default function LegalAdviserCall() {
  const { t } = useI18n();
  const [adviser, setAdviser] = useState<LegalAdviser | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/legal-adviser")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted) {
          setAdviser(data?.legalAdviser || null);
        }
      })
      .catch(() => {
        if (mounted) setAdviser(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const phone = adviser?.phone?.trim();
  const telHref = phone ? `tel:${normalizeTel(phone)}` : undefined;

  if (!adviser) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 lg:bottom-6 lg:right-6">
      {telHref ? (
        <a
          href={telHref}
          className="group flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-lg shadow-emerald-900/10 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:border-emerald-900/60 dark:bg-slate-900/95"
          aria-label={`${t("Call")} ${adviser.name}`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Scale className="h-5 w-5" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-700">
              {t("Free Legal Adviser")}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-sm font-black text-text-primary">
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
              {t("Call")} {adviser.name}
            </span>
          </span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="flex items-center gap-3 rounded-2xl border border-border bg-white/90 px-4 py-3 text-left opacity-80 shadow-lg backdrop-blur dark:bg-slate-900/90"
          title={t("Add legal adviser number in Settings")}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-text-secondary">
            <Scale className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-text-secondary">
              {t("Free Legal Adviser")}
            </span>
            <span className="mt-0.5 block text-sm font-black text-text-primary">
              {t("Number not configured")}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
