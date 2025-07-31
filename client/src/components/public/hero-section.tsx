import { useState, useEffect } from "react";
import RegistrationForm from "./registration-form";
import { useTranslation } from "@/hooks/use-translation";

export default function HeroSection() {
  const { t } = useTranslation();
  const [onlineCount, setOnlineCount] = useState(1267);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700" />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-accent-500 rounded-full opacity-10 animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent-400 rounded-full opacity-10 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glassmorphism p-6 rounded-2xl text-center animate-fade-in">
            <div className="text-3xl font-bold text-accent-400 counter-animation">
              98%
            </div>
            <div className="text-sm opacity-90 mt-2 text-white">
              {t("satisfaction_label")}
            </div>
          </div>
          <div className="glassmorphism p-6 rounded-2xl text-center animate-fade-in delay-200">
            <div className="text-3xl font-bold text-accent-400 counter-animation">
              {onlineCount.toLocaleString()}
            </div>
            <div className="text-sm opacity-90 mt-2 text-white">
              {t("online_label")}
            </div>
          </div>
          <div className="glassmorphism p-6 rounded-2xl text-center animate-fade-in delay-400">
            <div className="text-3xl font-bold text-accent-400 counter-animation">
              45,763
            </div>
            <div className="text-sm opacity-90 mt-2 text-white">
              {t("whatsapp_stats")}
            </div>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold font-inter mb-6 animate-wave">
            <span className="bg-gradient-to-r from-white to-accent-400 bg-clip-text text-transparent">
              KERVENTZ STATUS
            </span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed text-white">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* Registration Form */}
        <div className="max-w-md mx-auto">
          <RegistrationForm />
        </div>
      </div>
    </section>
  );
}
