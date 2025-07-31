import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/admin-auth";
import { apiRequest } from "@/lib/queryClient";

export default function ContactsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/contacts", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Contact deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete contact", variant: "destructive" });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: getAuthHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setShowDeleteAll(false);
      toast({ title: "All contacts deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete all contacts", variant: "destructive" });
    },
  });

  const handleExport = async (format: "vcf" | "csv") => {
    try {
      const response = await fetch(`/api/admin/export/${format}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error(`Failed to export ${format.toUpperCase()}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `kerventz_contacts.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({ title: `${format.toUpperCase()} exported successfully` });
    } catch (error) {
      toast({ 
        title: `Failed to export ${format.toUpperCase()}`, 
        variant: "destructive" 
      });
    }
  };

  const filteredContacts = contacts.filter((contact: any) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-primary-400 mb-4" />
          <p>Loading contacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-700">
      <CardHeader className="border-b border-primary-200 dark:border-primary-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-bold text-primary-900 dark:text-white">
            Contact Management
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleExport("vcf")}
              variant="outline"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            >
              <i className="fas fa-download mr-2" />
              Export VCF
            </Button>
            <Button
              onClick={() => handleExport("csv")}
              variant="outline"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white border-green-500"
            >
              <i className="fas fa-file-csv mr-2" />
              Export CSV
            </Button>
            <Dialog open={showDeleteAll} onOpenChange={setShowDeleteAll}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <i className="fas fa-trash mr-2" />
                  Delete All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Delete All</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Are you sure you want to delete ALL contacts? This action cannot be undone.</p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowDeleteAll(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteAllMutation.mutate()}
                      disabled={deleteAllMutation.isPending}
                    >
                      {deleteAllMutation.isPending ? "Deleting..." : "Delete All"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mt-4">
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-primary-700 border-primary-300 dark:border-primary-600"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-primary-200 dark:border-primary-700">
                <TableHead className="text-primary-500 dark:text-primary-400">Name</TableHead>
                <TableHead className="text-primary-500 dark:text-primary-400">Phone</TableHead>
                <TableHead className="text-primary-500 dark:text-primary-400">Email</TableHead>
                <TableHead className="text-primary-500 dark:text-primary-400">Country</TableHead>
                <TableHead className="text-primary-500 dark:text-primary-400">Date</TableHead>
                <TableHead className="text-primary-500 dark:text-primary-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact: any) => (
                <TableRow key={contact.id} className="border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-700">
                  <TableCell className="font-medium text-primary-900 dark:text-white">
                    {contact.fullName}
                  </TableCell>
                  <TableCell className="font-mono text-primary-900 dark:text-white">
                    {contact.phone}
                  </TableCell>
                  <TableCell className="text-primary-900 dark:text-white">
                    {contact.email || "-"}
                  </TableCell>
                  <TableCell className="text-primary-900 dark:text-white">
                    {contact.country}
                  </TableCell>
                  <TableCell className="text-primary-500 dark:text-primary-400">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteContactMutation.mutate(contact.id)}
                      disabled={deleteContactMutation.isPending}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredContacts.length === 0 && (
          <div className="p-8 text-center">
            <i className="fas fa-users text-4xl text-primary-300 dark:text-primary-600 mb-4" />
            <p className="text-primary-500 dark:text-primary-400">
              {searchTerm ? "No contacts found matching your search." : "No contacts yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
