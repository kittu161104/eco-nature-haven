
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Palette, Smartphone } from "lucide-react";
import AdminUpiSettings from "@/components/admin/AdminUpiSettings";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-green-900/20">
          <TabsTrigger value="payments" className="data-[state=active]:bg-green-700/30">
            <Smartphone className="h-4 w-4 mr-2" />
            Payment Settings
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-green-700/30">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <AdminUpiSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Theme Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Appearance customization features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
