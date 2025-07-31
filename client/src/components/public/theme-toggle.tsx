import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      size="icon"
      variant="outline"
      className="bg-white/20 dark:bg-gray-800/80 border-white/30 dark:border-gray-600 hover:bg-white/30 dark:hover:bg-gray-700 backdrop-blur-lg shadow-lg"
    >
      {theme === "light" ? (
        <i className="fas fa-moon text-white dark:text-gray-200 text-lg" />
      ) : (
        <i className="fas fa-sun text-yellow-300 text-lg" />
      )}
    </Button>
  );
}
