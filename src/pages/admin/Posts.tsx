
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
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash, Eye } from "lucide-react";

// Sample blog post data
const initialPosts = [
  {
    id: 1,
    title: "10 Tips for Indoor Plant Care",
    excerpt: "Learn how to keep your indoor plants thriving all year round...",
    status: "published",
    author: "Emily Johnson",
    date: "2023-10-15",
    category: "Plant Care",
  },
  {
    id: 2,
    title: "Sustainable Gardening Practices",
    excerpt: "Discover eco-friendly gardening methods that help the environment...",
    status: "published",
    author: "Michael Chen",
    date: "2023-09-28",
    category: "Sustainability",
  },
  {
    id: 3,
    title: "Best Plants for Beginners",
    excerpt: "New to gardening? These plants are perfect for starting your journey...",
    status: "draft",
    author: "Sarah Wilson",
    date: "2023-10-02",
    category: "Beginners Guide",
  },
  {
    id: 4,
    title: "Seasonal Planting Guide",
    excerpt: "What to plant during each season for optimal growth and harvest...",
    status: "published",
    author: "Emily Johnson",
    date: "2023-08-10",
    category: "Seasonal Tips",
  },
];

interface Post {
  id: number;
  title: string;
  excerpt: string;
  status: "published" | "draft";
  author: string;
  date: string;
  category: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Omit<Post, "id" | "date">>({
    title: "",
    excerpt: "",
    status: "draft",
    author: "Admin",
    category: "Plant Care",
  });
  const { toast } = useToast();

  const handleAddPost = () => {
    setFormData({
      title: "",
      excerpt: "",
      status: "draft",
      author: "Admin",
      category: "Plant Care",
    });
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      status: post.status,
      author: post.author,
      category: post.category,
    });
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast({
      title: "Post deleted",
      description: "The blog post has been deleted successfully.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) =>
          post.id === editingPost.id
            ? { ...post, ...formData }
            : post
        )
      );
      toast({
        title: "Post updated",
        description: "The blog post has been updated successfully.",
      });
    } else {
      // Add new post
      const newPost = {
        id: Math.max(...posts.map((p) => p.id), 0) + 1,
        ...formData,
        date: currentDate,
      };
      setPosts([...posts, newPost]);
      toast({
        title: "Post added",
        description: "The new blog post has been added successfully.",
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

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Blog Posts</h1>
        <Button onClick={handleAddPost}>
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={post.status === "published" ? "default" : "outline"}
                    className={post.status === "published" ? "bg-green-500" : ""}
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({
                      title: "View post",
                      description: "Viewing functionality will be implemented soon.",
                    })}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPost(post)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Make changes to the blog post details below."
                : "Fill in the details for the new blog post."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Post Title
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
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plant Care">Plant Care</SelectItem>
                    <SelectItem value="Sustainability">Sustainability</SelectItem>
                    <SelectItem value="Beginners Guide">Beginners Guide</SelectItem>
                    <SelectItem value="Seasonal Tips">Seasonal Tips</SelectItem>
                    <SelectItem value="DIY Projects">DIY Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value as "published" | "draft")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium">
                Author
              </label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
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
                {editingPost ? "Save Changes" : "Add Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Posts;
