
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Smartphone, Save, Key } from "lucide-react";

const AdminUpiSettings = () => {
  const { toast } = useToast();
  const { updateAdminCode } = useAuth();
  const [settings, setSettings] = useState({
    upiId: "",
    masterCode: "",
    newAdminCode: "",
  });

  useEffect(() => {
    // Load existing settings
    const adminSettings = JSON.parse(localStorage.getItem("adminSettings") || "{}");
    setSettings(prev => ({
      ...prev,
      upiId: adminSettings.upiId || "",
    }));
  }, []);

  const handleSaveUpiSettings = () => {
    if (!settings.upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter a valid UPI ID",
        variant: "destructive"
      });
      return;
    }

    const adminSettings = JSON.parse(localStorage.getItem("adminSettings") || "{}");
    adminSettings.upiId = settings.upiId;
    localStorage.setItem("adminSettings", JSON.stringify(adminSettings));

    toast({
      title: "UPI settings saved",
      description: "Your UPI payment settings have been updated successfully.",
    });
  };

  const handleUpdateAdminCode = async () => {
    if (!settings.masterCode || !settings.newAdminCode) {
      toast({
        title: "Missing information",
        description: "Please enter both master code and new admin code",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAdminCode(settings.masterCode, settings.newAdminCode);
      setSettings(prev => ({
        ...prev,
        masterCode: "",
        newAdminCode: "",
      }));
    } catch (error) {
      toast({
        title: "Failed to update admin code",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            UPI Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="upiId">Your UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              placeholder="yourstore@paytm / yourstore@googlepay"
              value={settings.upiId}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Customers will send payments to this UPI ID. Make sure it's active and verified.
            </p>
          </div>
          
          <Button onClick={handleSaveUpiSettings} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save UPI Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Admin Code Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="masterCode">Master Code</Label>
            <Input
              id="masterCode"
              name="masterCode"
              type="password"
              placeholder="Enter master code"
              value={settings.masterCode}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use the master code to change admin access code
            </p>
          </div>
          
          <div>
            <Label htmlFor="newAdminCode">New Admin Code</Label>
            <Input
              id="newAdminCode"
              name="newAdminCode"
              placeholder="Enter new admin access code"
              value={settings.newAdminCode}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground mt-1">
              This will be the new code for admin login/registration
            </p>
          </div>
          
          <Button onClick={handleUpdateAdminCode} className="w-full" variant="outline">
            <Key className="h-4 w-4 mr-2" />
            Update Admin Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUpiSettings;
