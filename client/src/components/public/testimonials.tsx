import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

const testimonials = [
  {
    name: "Marie Dubois",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b830?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    message: {
      fr: "Service exceptionnel ! Les statuts sont toujours à jour et créatifs.",
      en: "Exceptional service! The statuses are always up-to-date and creative.",
      es: "¡Servicio excepcional! Los estados siempre están actualizados y son creativos."
    }
  },
  {
    name: "Jean Michel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    message: {
      fr: "Je recommande vivement cette plateforme. Contenu de qualité premium.",
      en: "I highly recommend this platform. Premium quality content.",
      es: "Recomiendo encarecidamente esta plataforma. Contenido de calidad premium."
    }
  },
  {
    name: "Sophie Laurent",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    message: {
      fr: "Interface moderne et service client réactif. Parfait !",
      en: "Modern interface and responsive customer service. Perfect!",
      es: "Interfaz moderna y servicio al cliente receptivo. ¡Perfecto!"
    }
  },
  {
    name: "Carlos Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    message: {
      fr: "Excellente plateforme avec contenu exclusif et mises à jour constantes.",
      en: "Excellent platform with exclusive content and constant updates.",
      es: "Excelente plataforma con contenido exclusivo y actualizaciones constantes."
    }
  },
  {
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    message: {
      fr: "Service remarquable ! Les mises à jour de statut WhatsApp sont créatives et engageantes.",
      en: "Outstanding service! The WhatsApp status updates are creative and engaging.",
      es: "¡Servicio excepcional! Las actualizaciones de estado de WhatsApp son creativas y atractivas."
    }
  },
  {
    name: "Pierre Martin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
    message: {
      fr: "Très satisfait du service. Les mises à jour sont régulières et pertinentes.",
      en: "Very satisfied with the service. Updates are regular and relevant.",
      es: "Muy satisfecho con el servicio. Las actualizaciones son regulares y relevantes."
    }
  }
];

export default function TestimonialsSection() {
  const { t, language } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gray-100 dark:bg-primary-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {t("testimonials_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-700 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-sm" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 italic">
                  "{testimonial.message[language as keyof typeof testimonial.message] || testimonial.message.fr}"
                </p>
                <div className="mt-4 flex items-center text-sm text-accent-500">
                  <i className="fas fa-check-circle mr-1" />
                  <span>Membre vérifié</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
