import HeroSection from "@/components/public/hero-section";
import TestimonialsSection from "@/components/public/testimonials";
import FAQSection from "@/components/public/faq-section";
import ContactSection from "@/components/public/contact-section";
import Footer from "@/components/public/footer";
import LanguageSelector from "@/components/public/language-selector";
import ThemeToggle from "@/components/public/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function Home() {
  const { t } = useTranslation();

  const { data: recentContacts = [] } = useQuery({
    queryKey: ["/api/contacts/recent"],
    queryFn: async () => {
      const response = await fetch("/api/contacts/recent?limit=5");
      if (!response.ok) throw new Error("Failed to fetch recent contacts");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-primary-900 dark:to-primary-800">
      {/* Language & Theme Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Recent Registrations */}
      <section className="py-20 px-4 bg-white dark:bg-primary-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t("recent_registrations")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {recentContacts.map((contact: any, index: number) => (
              <Card key={contact.id} className="bg-white dark:bg-primary-700 border-primary-200 dark:border-primary-600 hover:shadow-lg transition-all duration-300 animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-user text-white"></i>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    {contact.fullName}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
