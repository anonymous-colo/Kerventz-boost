import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

const faqs = [
  {
    question: {
      fr: "Comment accéder aux statuts WhatsApp ?",
      en: "How to access WhatsApp statuses?",
      es: "¿Cómo acceder a los estados de WhatsApp?"
    },
    answer: {
      fr: "Une fois inscrit, vous recevrez un lien vers notre groupe WhatsApp exclusif où tous les statuts sont partagés régulièrement.",
      en: "Once registered, you will receive a link to our exclusive WhatsApp group where all statuses are shared regularly.",
      es: "Una vez registrado, recibirás un enlace a nuestro grupo exclusivo de WhatsApp donde todos los estados se comparten regularmente."
    }
  },
  {
    question: {
      fr: "Les statuts sont-ils mis à jour régulièrement ?",
      en: "Are statuses updated regularly?",
      es: "¿Se actualizan los estados regularmente?"
    },
    answer: {
      fr: "Oui, nous publions de nouveaux statuts plusieurs fois par jour pour garder votre contenu frais et engageant.",
      en: "Yes, we publish new statuses several times a day to keep your content fresh and engaging.",
      es: "Sí, publicamos nuevos estados varias veces al día para mantener tu contenido fresco y atractivo."
    }
  },
  {
    question: {
      fr: "Puis-je changer mon suffixe après inscription ?",
      en: "Can I change my suffix after registration?",
      es: "¿Puedo cambiar mi sufijo después del registro?"
    },
    answer: {
      fr: "Contactez notre support via WhatsApp ou email pour modifier votre suffixe. Le changement est gratuit une fois par mois.",
      en: "Contact our support via WhatsApp or email to modify your suffix. The change is free once per month.",
      es: "Contacta nuestro soporte vía WhatsApp o email para modificar tu sufijo. El cambio es gratuito una vez al mes."
    }
  },
  {
    question: {
      fr: "Y a-t-il des frais d'inscription ?",
      en: "Are there registration fees?",
      es: "¿Hay tarifas de registro?"
    },
    answer: {
      fr: "Non, l'inscription est entièrement gratuite. Nous offrons un accès premium à tous nos contenus sans frais cachés.",
      en: "No, registration is completely free. We offer premium access to all our content with no hidden fees.",
      es: "No, el registro es completamente gratuito. Ofrecemos acceso premium a todo nuestro contenido sin tarifas ocultas."
    }
  },
  {
    question: {
      fr: "Comment télécharger le fichier VCF ?",
      en: "How to download the VCF file?",
      es: "¿Cómo descargar el archivo VCF?"
    },
    answer: {
      fr: "Le fichier VCF avec tous les contacts est disponible dans le groupe WhatsApp, mis à jour automatiquement après chaque nouvelle inscription.",
      en: "The VCF file with all contacts is available in the WhatsApp group, automatically updated after each new registration.",
      es: "El archivo VCF con todos los contactos está disponible en el grupo de WhatsApp, actualizado automáticamente después de cada nuevo registro."
    }
  }
];

export default function FAQSection() {
  const { t, language } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-white dark:bg-primary-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {t("faq_title")}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white dark:bg-primary-700 border-primary-200 dark:border-primary-600">
              <Button
                variant="ghost"
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 hover:bg-primary-50 dark:hover:bg-primary-600 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {faq.question[language as keyof typeof faq.question] || faq.question.fr}
                  </h4>
                  <i className={`fas fa-chevron-down text-accent-500 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} />
                </div>
              </Button>
              {openIndex === index && (
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 dark:text-gray-200">
                    {faq.answer[language as keyof typeof faq.answer] || faq.answer.fr}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
