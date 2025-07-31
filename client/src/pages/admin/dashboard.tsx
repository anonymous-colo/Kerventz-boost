import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAdminSession, clearAdminSession } from "@/lib/admin-auth";
import AdminHeader from "@/components/admin/admin-header";
import StatsCards from "@/components/admin/stats-cards";
import ContactsTable from "@/components/admin/contacts-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/public/theme-toggle";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = getAdminSession();
    if (!session || new Date(session.expiresAt) <= new Date()) {
      clearAdminSession();
      setLocation("/admin");
      return;
    }
    setIsAuthenticated(true);
  }, [setLocation]);

  const handleLogout = () => {
    clearAdminSession();
    setLocation("/admin");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-white text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4" />
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-primary-900 dark:to-primary-800">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <AdminHeader onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Administrateur</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <i className="fas fa-shield-alt mr-2"></i>
            <span>Gestion complète du système Kerventz Status</span>
          </div>
        </div>
        
        <StatsCards />
        
        <Tabs defaultValue="contacts" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 shadow-lg">
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <i className="fas fa-users" />
              <span>Gestion des Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <i className="fas fa-chart-bar" />
              <span>Analyses & Rapports</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts" className="mt-6">
            <ContactsTable />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Croissance Mensuelle</h3>
                    <i className="fas fa-chart-line text-2xl text-green-500"></i>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">+24.5%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Par rapport au mois dernier</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Taux de Satisfaction</h3>
                    <i className="fas fa-smile text-2xl text-blue-500"></i>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">98.7%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avis positifs reçus</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Système</h3>
                    <i className="fas fa-server text-2xl text-purple-500"></i>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temps de disponibilité</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6 shadow-lg">
              <CardContent className="p-8 text-center">
                <i className="fas fa-chart-line text-4xl text-primary-500 mb-4" />
                <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-primary-500 dark:text-primary-400">
                  Advanced analytics and reporting features will be available here.
                </p>
                <p className="text-sm text-primary-400 dark:text-primary-500 mt-2">
                  Integration with Chart.js for detailed insights and trends.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
