import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-primary-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">
          {t("contact_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glassmorphism border-white/20">
            <CardContent className="p-8 text-center">
              <i className="fab fa-whatsapp text-4xl text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">WhatsApp</h3>
              <p className="text-accent-400 font-mono text-lg">+18495849472</p>
              <p className="text-sm text-white/70 mt-2">
                {t("whatsapp_response")}
              </p>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-white/20">
            <CardContent className="p-8 text-center">
              <i className="fas fa-envelope text-4xl text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">
                {t("email_contact")}
              </h3>
              <p className="text-accent-400 font-mono text-sm break-all">
                contact.kerventzweb@gmail.com
              </p>
              <p className="text-sm text-white/70 mt-2">
                {t("email_response")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
