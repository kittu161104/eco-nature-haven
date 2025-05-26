
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminContactSettings from "@/components/admin/AdminContactSettings";

const Pages = () => {
  const [aboutContent, setAboutContent] = useState({
    about: { title: "", description: "" },
    mission: { title: "", description: "" },
    values: { title: "", description: "" }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*');

      if (error) throw error;

      const contentMap = {};
      data?.forEach(item => {
        contentMap[item.section] = item.content;
      });

      setAboutContent(prev => ({
        ...prev,
        ...contentMap
      }));
    } catch (error) {
      console.error('Error fetching about content:', error);
      toast.error('Failed to load about content');
    }
  };

  const updateAboutSection = async (section: string, content: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('about_content')
        .upsert({
          section,
          content,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setAboutContent(prev => ({
        ...prev,
        [section]: content
      }));

      toast.success('About content updated successfully');
    } catch (error) {
      console.error('Error updating about content:', error);
      toast.error('Failed to update about content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold text-white">Page Management</h1>
      </div>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-green-900/20">
          <TabsTrigger value="contact" className="data-[state=active]:bg-green-700/30">
            <Mail className="h-4 w-4 mr-2" />
            Contact Page
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-green-700/30">
            <Info className="h-4 w-4 mr-2" />
            About Page
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <AdminContactSettings />
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <div className="space-y-6">
            {Object.entries(aboutContent).map(([section, content]) => (
              <Card key={section} className="glass border-green-800/30">
                <CardHeader>
                  <CardTitle className="text-white capitalize">{section} Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      value={content.title || ""}
                      onChange={(e) => setAboutContent(prev => ({
                        ...prev,
                        [section]: { ...content, title: e.target.value }
                      }))}
                      className="bg-black/40 border-green-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={content.description || ""}
                      onChange={(e) => setAboutContent(prev => ({
                        ...prev,
                        [section]: { ...content, description: e.target.value }
                      }))}
                      className="bg-black/40 border-green-900/50 text-white"
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={() => updateAboutSection(section, content)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Update {section}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pages;
