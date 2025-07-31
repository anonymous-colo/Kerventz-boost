import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/admin-auth";
import { apiRequest } from "@/lib/queryClient";

export default function SuffixManager() {
  const [newSuffix, setNewSuffix] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suffixes = [], isLoading } = useQuery({
    queryKey: ["/api/admin/suffixes"],
    queryFn: async () => {
      const response = await fetch("/api/admin/suffixes", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch suffixes");
      return response.json();
    },
  });

  const createSuffixMutation = useMutation({
    mutationFn: (data: { value: string; isActive: boolean }) =>
      fetch("/api/admin/suffixes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suffixes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suffixes"] });
      setShowAddDialog(false);
      setNewSuffix("");
      toast({ title: "Suffix created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create suffix", variant: "destructive" });
    },
  });

  const updateSuffixMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      fetch(`/api/admin/suffixes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suffixes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suffixes"] });
      toast({ title: "Suffix updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update suffix", variant: "destructive" });
    },
  });

  const deleteSuffixMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/suffixes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suffixes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suffixes"] });
      toast({ title: "Suffix deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete suffix", variant: "destructive" });
    },
  });

  const handleAddSuffix = () => {
    if (!newSuffix.trim()) return;
    createSuffixMutation.mutate({ value: newSuffix.trim(), isActive: true });
  };

  const toggleSuffixStatus = (id: string, isActive: boolean) => {
    updateSuffixMutation.mutate({ id, updates: { isActive } });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-primary-400 mb-4" />
          <p>Loading suffixes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-700">
      <CardHeader className="border-b border-primary-200 dark:border-primary-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-primary-900 dark:text-white">
            Suffix Management
          </CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-accent-500 hover:bg-accent-600">
                <i className="fas fa-plus mr-2" />
                Add Suffix
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Suffix</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="suffix-value">Suffix Value</Label>
                  <Input
                    id="suffix-value"
                    placeholder="e.g., BOOST.4💎"
                    value={newSuffix}
                    onChange={(e) => setNewSuffix(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSuffix}
                    disabled={createSuffixMutation.isPending || !newSuffix.trim()}
                  >
                    {createSuffixMutation.isPending ? "Adding..." : "Add Suffix"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {suffixes.map((suffix: any) => (
            <div
              key={suffix.id}
              className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-700 rounded-lg border border-primary-200 dark:border-primary-600"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{suffix.value}</div>
                <div>
                  <p className="font-medium text-primary-900 dark:text-white">
                    {suffix.value}
                  </p>
                  <p className="text-sm text-primary-500 dark:text-primary-400">
                    Created: {new Date(suffix.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`active-${suffix.id}`} className="text-sm">
                    Active
                  </Label>
                  <Switch
                    id={`active-${suffix.id}`}
                    checked={suffix.isActive}
                    onCheckedChange={(checked) => toggleSuffixStatus(suffix.id, checked)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSuffixMutation.mutate(suffix.id)}
                  disabled={deleteSuffixMutation.isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <i className="fas fa-trash" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {suffixes.length === 0 && (
          <div className="text-center py-8">
            <i className="fas fa-tags text-4xl text-primary-300 dark:text-primary-600 mb-4" />
            <p className="text-primary-500 dark:text-primary-400">
              No suffixes configured yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
