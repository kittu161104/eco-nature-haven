
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Info, Home } from "lucide-react";
import AdminContactSettings from "@/components/admin/AdminContactSettings";

const Pages = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold text-white">Page Management</h1>
      </div>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-green-900/20">
          <TabsTrigger value="contact" className="data-[state=active]:bg-green-700/30">
            <Mail className="h-4 w-4 mr-2" />
            Contact Page
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-green-700/30">
            <Info className="h-4 w-4 mr-2" />
            About Page
          </TabsTrigger>
          <TabsTrigger value="home" className="data-[state=active]:bg-green-700/30">
            <Home className="h-4 w-4 mr-2" />
            Home Page
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-green-700/30">
            <FileText className="h-4 w-4 mr-2" />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <AdminContactSettings />
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">About Page Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                About page management features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Home Page Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Home page management features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card className="glass border-green-800/30">
            <CardHeader>
              <CardTitle className="text-white">Policies Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Privacy policy, terms of service, and return policy management coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pages;
