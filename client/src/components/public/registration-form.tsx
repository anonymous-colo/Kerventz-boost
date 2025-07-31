import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertContactSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { validatePhone } from "@/lib/phone-validation";
import { apiRequest } from "@/lib/queryClient";
import type { z } from "zod";

type FormData = z.infer<typeof insertContactSchema>;

const countryOptions = [
  { value: "HT", label: "🇭🇹 +509", code: "+509" },
  { value: "US", label: "🇺🇸 +1", code: "+1" },
  { value: "FR", label: "🇫🇷 +33", code: "+33" },
  { value: "ES", label: "🇪🇸 +34", code: "+34" },
];

export default function RegistrationForm() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSuffix, setSelectedSuffix] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("HT");

  const { data: suffixes = [] } = useQuery({
    queryKey: ["/api/suffixes"],
    queryFn: async () => {
      const response = await fetch("/api/suffixes");
      if (!response.ok) throw new Error("Failed to fetch suffixes");
      return response.json();
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      suffix: "",
      country: "HT",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const countryInfo = countryOptions.find(c => c.value === data.country);
      const fullPhone = countryInfo?.code + data.phone;
      
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          phone: fullPhone,
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response;
    },
    onSuccess: async (response) => {
      const contact = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts/recent"] });
      
      const messages = {
        fr: `MERCI ${contact.fullName} vous avez été enregistrée avec succès. Maintenant je vous prie de bien vouloir entrer dans le groupe WhatsApp là où tu trouveras le folder VCF qui aura tous les contacts enregistrés pour que tu puisses le télécharger. Merci !`,
        en: `THANK YOU ${contact.fullName} you have been successfully registered. Now please join the WhatsApp group where you will find the VCF folder with all registered contacts for download. Thank you!`,
        es: `GRACIAS ${contact.fullName} has sido registrado exitosamente. Ahora por favor únete al grupo de WhatsApp donde encontrarás la carpeta VCF con todos los contactos registrados para descargar. ¡Gracias!`
      };
      
      setSuccessMessage(messages[language as keyof typeof messages] || messages.fr);
      setShowSuccessModal(true);
      form.reset();
      setSelectedSuffix("");
    },
    onError: (error: any) => {
      const message = error.message.includes("409") ? 
        "Ce numéro est déjà enregistré" : 
        "Erreur lors de l'inscription";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const countryInfo = countryOptions.find(c => c.value === data.country);
    if (!countryInfo || !validatePhone(countryInfo.code, data.phone)) {
      toast({
        title: "Erreur",
        description: "Format de numéro de téléphone invalide",
        variant: "destructive",
      });
      return;
    }

    const finalSuffix = selectedSuffix || 
      (suffixes.length > 0 ? suffixes[Math.floor(Math.random() * suffixes.length)].value : "BOOST🚨🚀🇭🇹");

    registerMutation.mutate({
      ...data,
      fullName: `${data.fullName}.${finalSuffix}`,
      suffix: finalSuffix,
    });
  };

  return (
    <>
      <Card className="glassmorphism border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white drop-shadow-lg">
            {t("registration_title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white/90">
                {t("full_name_label")}
              </Label>
              <Input
                {...form.register("fullName")}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-accent-500"
                placeholder={t("full_name_label")}
              />
              <p className="text-xs text-accent-400">
                {t("name_suffix_message")}
              </p>
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-400">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label className="text-white/90">{t("phone_label")}</Label>
              <div className="flex space-x-2">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-28 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  {...form.register("phone")}
                  type="tel"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-accent-500"
                  placeholder="12345678"
                  onChange={(e) => {
                    form.setValue("country", selectedCountry);
                    form.setValue("phone", e.target.value);
                  }}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-xs text-red-400">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">
                {t("email_label")}
              </Label>
              <Input
                {...form.register("email")}
                type="email"
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-accent-500"
                placeholder={t("email_label")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Suffix Selection */}
            <div className="space-y-3">
              <Label className="text-white/90">{t("suffix_label")}</Label>
              <div className="grid grid-cols-3 gap-2">
                {suffixes.slice(0, 3).map((suffix: any) => (
                  <Button
                    key={suffix.id}
                    type="button"
                    variant={selectedSuffix === suffix.value ? "default" : "outline"}
                    className={`text-xs ${
                      selectedSuffix === suffix.value
                        ? "bg-accent-500 hover:bg-accent-600 text-white border-accent-500"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                    }`}
                    onClick={() => setSelectedSuffix(suffix.value)}
                  >
                    {suffix.value}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-white/70">
                {t("random_suffix_message")}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {registerMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2" />
              ) : (
                <i className="fas fa-user-plus mr-2" />
              )}
              {registerMutation.isPending ? "Inscription..." : t("register_button")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="glassmorphism border-white/20 text-white">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">🎉</div>
            <DialogTitle className="text-2xl font-bold text-center">
              {t("success_title")}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6">
            <p className="text-white/90">{successMessage}</p>
            <a
              href="https://chat.whatsapp.com/CsVWRycnwNHFhqVLEtFyZv?mode=ac_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <i className="fab fa-whatsapp mr-2 text-xl" />
              {t("whatsapp_button")}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
