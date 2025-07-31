import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  const languages = [
    { code: "fr", label: "🇫🇷 Français" },
    { code: "en", label: "🇺🇸 English" },
    { code: "es", label: "🇪🇸 Español" },
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="glassmorphism text-primary-700 dark:text-white border-white/20 w-auto min-w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
