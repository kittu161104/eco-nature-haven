
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Eye } from "lucide-react";

// Sample pages data
const initialPages = [
  {
    id: 1,
    title: "About Us",
    slug: "about",
    lastUpdated: "2023-09-10",
  },
  {
    id: 2,
    title: "Contact Us",
    slug: "contact",
    lastUpdated: "2023-08-15",
  },
  {
    id: 3,
    title: "Terms & Conditions",
    slug: "terms",
    lastUpdated: "2023-07-22",
  },
  {
    id: 4,
    title: "Privacy Policy",
    slug: "privacy",
    lastUpdated: "2023-07-22",
  },
];

interface Page {
  id: number;
  title: string;
  slug: string;
  lastUpdated: string;
}

const Pages = () => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const { toast } = useToast();

  const handleEditPage = (page: Page) => {
    setFormData({
      title: page.title,
      content: "This is sample content for the " + page.title + " page. In a real app, this would be loaded from a database.",
    });
    setEditingPage(page);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      // Update existing page
      const currentDate = new Date().toISOString().split('T')[0];
      
      setPages(
        pages.map((page) =>
          page.id === editingPage.id
            ? { ...page, title: formData.title, lastUpdated: currentDate }
            : page
        )
      );
      
      toast({
        title: "Page updated",
        description: `The "${formData.title}" page has been updated successfully.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Static Pages</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>/{page.slug}</TableCell>
                <TableCell>{page.lastUpdated}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({
                      title: "View page",
                      description: "Viewing functionality will be implemented soon.",
                    })}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPage(page)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Page Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editingPage?.title} Page
            </DialogTitle>
            <DialogDescription>
              Make changes to the page content below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Page Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Page Content
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pages;
