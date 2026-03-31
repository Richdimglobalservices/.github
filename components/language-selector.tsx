"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { languages, type Language } from "@/lib/i18n";

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language;
    if (stored && languages[stored]) {
      setCurrentLang(stored);
    }
  }, []);

  function handleLanguageChange(lang: Language) {
    setCurrentLang(lang);
    localStorage.setItem("language", lang);
    // Update document direction for RTL languages
    document.documentElement.dir = languages[lang].dir;
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={currentLang === code ? "bg-muted" : ""}
          >
            <span className="mr-2">{flag}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
