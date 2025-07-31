import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthHeaders } from "@/lib/admin-auth";

export default function StatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const statsData = [
    {
      title: "Total Contacts",
      value: stats?.totalContacts || 0,
      icon: "fas fa-users",
      color: "blue",
    },
    {
      title: "Today's Registrations",
      value: stats?.todayContacts || 0,
      icon: "fas fa-user-plus",
      color: "green",
    },
    {
      title: "With Email",
      value: stats?.emailContacts || 0,
      icon: "fas fa-envelope",
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-500 dark:text-primary-400 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                <i className={`${stat.icon} text-xl`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
