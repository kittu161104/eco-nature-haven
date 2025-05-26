
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Palette, Smartphone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState({
    upi_id: "",
    admin_code: "",
    site_settings: {
      theme: "green",
      maintenance_mode: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = typeof setting.value === 'string' ? 
          JSON.parse(setting.value) : setting.value;
      });

      setSettings(prevSettings => ({
        ...prevSettings,
        ...settingsMap
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [key]: value
      }));

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpiUpdate = () => {
    updateSetting('upi_id', settings.upi_id);
  };

  const handleAdminCodeUpdate = () => {
    updateSetting('admin_code', settings.admin_code);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-green-900/20">
          <TabsTrigger value="payments" className="data-[state=active]:bg-green-700/30">
            <Smartphone className="h-4 w-4 mr-2" />
            Payment Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-green-700/30">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-green-700/30">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">UPI Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi_id" className="text-white">UPI ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="upi_id"
                    value={settings.upi_id}
                    onChange={(e) => setSettings(prev => ({ ...prev, upi_id: e.target.value }))}
                    placeholder="Enter UPI ID"
                    className="bg-black/40 border-green-900/50 text-white"
                  />
                  <Button 
                    onClick={handleUpiUpdate}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Admin Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin_code" className="text-white">Admin Access Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="admin_code"
                    type="password"
                    value={settings.admin_code}
                    onChange={(e) => setSettings(prev => ({ ...prev, admin_code: e.target.value }))}
                    placeholder="Enter admin code"
                    className="bg-black/40 border-green-900/50 text-white"
                  />
                  <Button 
                    onClick={handleAdminCodeUpdate}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Update
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  This code is required for sensitive admin operations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Theme Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Advanced theme customization features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
