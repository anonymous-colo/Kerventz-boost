import { useTranslation } from "@/hooks/use-translation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary-900 text-white py-12 px-4 border-t border-primary-700">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">KERVENTZ STATUS</h3>
            <p className="text-white/70 mb-4">
              {t("footer_description")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-accent-400 transition-colors">
                <i className="fab fa-whatsapp" />
              </a>
              <a href="#" className="text-2xl hover:text-accent-400 transition-colors">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="text-2xl hover:text-accent-400 transition-colors">
                <i className="fab fa-twitter" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("services_title")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-accent-400 transition-colors">
                  {t("whatsapp_status")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-400 transition-colors">
                  {t("exclusive_content")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-400 transition-colors">
                  {t("premium_access")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("support_title")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-accent-400 transition-colors">
                  {t("help_center")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-400 transition-colors">
                  {t("contact_support")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-400 transition-colors">
                  {t("privacy_policy")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-sm text-white/70">
          <p>&copy; 2024 Kerventz Status. {t("rights_reserved")}</p>
        </div>
      </div>
    </footer>
  );
}
