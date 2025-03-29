
import React, { useState, useEffect } from "react";
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

// Define the Page interface
interface Page {
  id: number;
  title: string;
  slug: string;
  lastUpdated: string;
  content?: string; // Content is optional as we'll load it on demand
  template?: string; // Template type for About/Contact pages
}

// Sample pages data
const initialPages: Page[] = [
  {
    id: 1,
    title: "About Us",
    slug: "about",
    lastUpdated: "2023-09-10",
    template: "about",
  },
  {
    id: 2,
    title: "Contact Us",
    slug: "contact",
    lastUpdated: "2023-08-15",
    template: "contact",
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

// Sample content for About page
const aboutPageContent = `
# Our Story

We're on a mission to make sustainable gardening accessible and enjoyable for everyone while promoting a healthier planet.

## Our Mission

Founded in 2015, Natural Green began with a simple idea: to create a plant nursery that puts sustainability and plant health first. What started as a small backyard greenhouse has grown into a thriving nursery dedicated to providing healthy, sustainably grown plants and expert gardening advice.

Our mission is to inspire and enable sustainable living through plants. We believe that every plant we sell has the potential to make homes healthier, gardens more vibrant, and our planet a little greener.

We're committed to sustainable growing practices, plastic-free packaging, and supporting local conservation efforts. When you shop with us, you're not just buying plants – you're supporting a vision of a greener, more sustainable future.

## Our Values

- **Sustainability**: We're committed to environmental stewardship through sustainable growing practices, eco-friendly packaging, and reduced carbon footprint.
- **Quality**: Every plant in our nursery is carefully grown and inspected to ensure it's healthy and ready to thrive in your home or garden.
- **Community**: We believe in building a community of plant lovers and providing education on sustainable gardening practices.
- **Planet-First**: Our business decisions are made with the health of our planet in mind, from sourcing to shipping.

## Our Team

- **Emily Johnson** - Founder & Head Botanist: With over 15 years of experience in plant cultivation, Emily founded Natural Green with a vision to make sustainable gardening accessible to all.
- **David Chen** - Sustainability Director: David ensures all our operations meet the highest environmental standards. He oversees our eco-friendly initiatives and carbon offset program.
- **Maria Rodriguez** - Plant Care Specialist: Maria develops our detailed care guides and manages plant health throughout our nursery. She's passionate about helping everyone succeed with plants.

## Visit Our Nursery

We'd love to welcome you to our physical location where you can explore our full collection of plants, get personalized advice from our experts, and experience our sustainable nursery practices firsthand.

**Address**: 123 Green Avenue, Eco City, EC 12345
**Hours**: 
- Monday - Friday: 9am - 6pm
- Saturday: 8am - 5pm
- Sunday: 10am - 4pm
`;

// Sample content for Contact page
const contactPageContent = `
# Contact Us

Have questions about plants, orders, or want to arrange a visit? We're here to help!

## Get In Touch

**Email**:
- info@naturalgreen.com
- support@naturalgreen.com

**Phone**:
- +1 (555) 123-4567
- Mon-Fri: 9am - 5pm EST

**Visit Our Nursery**:
- 123 Green Avenue
- Eco City, EC 12345

**Business Hours**:
- Monday - Friday: 9am - 6pm
- Saturday: 8am - 5pm
- Sunday: 10am - 4pm

## Send Us a Message

Use our contact form to send us a message and we'll get back to you as soon as possible.

## Find Us

Our nursery is located in a beautiful green space just outside the city center. Easy to reach by public transport or car with plenty of parking available.
`;

const Pages = () => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const { toast } = useToast();

  // Load template content based on page type
  const getTemplateContent = (template?: string) => {
    if (template === "about") return aboutPageContent;
    if (template === "contact") return contactPageContent;
    return "This is a standard page with no template.";
  };

  const handleEditPage = (page: Page) => {
    const content = page.content || getTemplateContent(page.template);
    
    setFormData({
      title: page.title,
      content: content,
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
            ? { 
                ...page, 
                title: formData.title, 
                lastUpdated: currentDate,
                content: formData.content 
              }
            : page
        )
      );
      
      // In a real app, we would save this to localStorage or a database
      localStorage.setItem(`page_${editingPage.slug}`, formData.content);
      
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

  // Load saved content from localStorage if available
  useEffect(() => {
    const updatedPages = pages.map(page => {
      const savedContent = localStorage.getItem(`page_${page.slug}`);
      if (savedContent) {
        return {
          ...page,
          content: savedContent
        };
      }
      return page;
    });
    setPages(updatedPages);
  }, []);

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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <p className="text-xs text-muted-foreground mb-2">
                {editingPage?.template ? "This is a template-based page. Edit the content to customize it." : ""}
              </p>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={20}
                required
                className="font-mono text-sm"
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
