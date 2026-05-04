import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Settings,
  Star,
} from "lucide-react";

export const MAIN_NAV: readonly {
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { href: "/horoscope", label: "Хороскоп", Icon: Star },
  { href: "/journal", label: "Дневник", Icon: BookOpen },
  { href: "/chat", label: "Чат", Icon: MessageCircle },
  { href: "/compatibility", label: "Съвместимост", Icon: Heart },
  { href: "/settings", label: "Настройки", Icon: Settings },
];
