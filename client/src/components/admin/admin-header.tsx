import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/public/theme-toggle";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white dark:bg-primary-800 shadow-sm border-b border-primary-200 dark:border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-900 dark:text-white">
              Kerventz Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-sm" />
              </div>
              <span className="text-primary-900 dark:text-white font-medium">Admin</span>
            </div>
            <Button
              onClick={onLogout}
              variant="destructive"
              size="sm"
              className="bg-red-500 hover:bg-red-600"
            >
              <i className="fas fa-sign-out-alt mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
