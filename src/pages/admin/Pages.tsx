
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Save, Plus, Trash } from "lucide-react";

// Define the structure for team members
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// Define the structure for values
interface Value {
  title: string;
  description: string;
  icon: string;
}

const Pages = () => {
  const [aboutContent, setAboutContent] = useState("");
  const [contactContent, setContactContent] = useState("");
  const [missionContent, setMissionContent] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [visitInfo, setVisitInfo] = useState({
    address: "",
    hours: "",
    description: "",
    image: ""
  });
  const { toast } = useToast();

  // Load stored content on component mount
  useEffect(() => {
    const savedAboutContent = localStorage.getItem("page_about");
    const savedContactContent = localStorage.getItem("page_contact");
    const savedMissionContent = localStorage.getItem("about_mission");
    const savedTeamMembers = localStorage.getItem("about_team");
    const savedValues = localStorage.getItem("about_values");
    const savedVisitInfo = localStorage.getItem("about_visit");

    if (savedAboutContent) {
      setAboutContent(savedAboutContent);
    }

    if (savedContactContent) {
      setContactContent(savedContactContent);
    }

    if (savedMissionContent) {
      setMissionContent(savedMissionContent);
    }

    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    } else {
      // Default team members
      setTeamMembers([
        {
          name: "Emily Johnson",
          role: "Founder & Head Botanist",
          bio: "With over 15 years of experience in plant cultivation, Emily founded Natural Green with a vision to make sustainable gardening accessible to all.",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "David Chen",
          role: "Sustainability Director",
          bio: "David ensures all our operations meet the highest environmental standards. He oversees our eco-friendly initiatives and carbon offset program.",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Maria Rodriguez",
          role: "Plant Care Specialist",
          bio: "Maria develops our detailed care guides and manages plant health throughout our nursery. She's passionate about helping everyone succeed with plants.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        }
      ]);
    }

    if (savedValues) {
      setValues(JSON.parse(savedValues));
    } else {
      // Default values
      setValues([
        {
          title: "Sustainability",
          description: "We're committed to environmental stewardship through sustainable growing practices, eco-friendly packaging, and reduced carbon footprint.",
          icon: "Leaf"
        },
        {
          title: "Quality",
          description: "Every plant in our nursery is carefully grown and inspected to ensure it's healthy and ready to thrive in your home or garden.",
          icon: "Heart"
        },
        {
          title: "Community",
          description: "We believe in building a community of plant lovers and providing education on sustainable gardening practices.",
          icon: "Users"
        },
        {
          title: "Planet-First",
          description: "Our business decisions are made with the health of our planet in mind, from sourcing to shipping.",
          icon: "Globe"
        }
      ]);
    }

    if (savedVisitInfo) {
      setVisitInfo(JSON.parse(savedVisitInfo));
    } else {
      // Default visit info
      setVisitInfo({
        address: "123 Green Avenue, Eco City, EC 12345",
        hours: "Monday - Friday: 9am - 6pm\nSaturday: 8am - 5pm\nSunday: 10am - 4pm",
        description: "We'd love to welcome you to our physical location where you can explore our full collection of plants, get personalized advice from our experts, and experience our sustainable nursery practices firsthand.",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
      });
    }
  }, []);

  const handleSaveAbout = () => {
    localStorage.setItem("page_about", aboutContent);
    toast({
      title: "About page updated",
      description: "The About page content has been saved successfully.",
    });
  };

  const handleSaveContact = () => {
    localStorage.setItem("page_contact", contactContent);
    toast({
      title: "Contact page updated",
      description: "The Contact page content has been saved successfully.",
    });
  };

  const handleSaveMission = () => {
    localStorage.setItem("about_mission", missionContent);
    toast({
      title: "Mission section updated",
      description: "The About page mission section has been saved successfully.",
    });
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers[index] = { ...updatedTeamMembers[index], [field]: value };
    setTeamMembers(updatedTeamMembers);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        name: "",
        role: "",
        bio: "",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      }
    ]);
  };

  const handleRemoveTeamMember = (index: number) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers.splice(index, 1);
    setTeamMembers(updatedTeamMembers);
  };

  const handleSaveTeam = () => {
    localStorage.setItem("about_team", JSON.stringify(teamMembers));
    toast({
      title: "Team section updated",
      description: "The About page team section has been saved successfully.",
    });
  };

  const handleValueChange = (index: number, field: keyof Value, value: string) => {
    const updatedValues = [...values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setValues(updatedValues);
  };

  const handleSaveValues = () => {
    localStorage.setItem("about_values", JSON.stringify(values));
    toast({
      title: "Values section updated",
      description: "The About page values section has been saved successfully.",
    });
  };

  const handleVisitInfoChange = (field: keyof typeof visitInfo, value: string) => {
    setVisitInfo({ ...visitInfo, [field]: value });
  };

  const handleSaveVisit = () => {
    localStorage.setItem("about_visit", JSON.stringify(visitInfo));
    toast({
      title: "Visit section updated",
      description: "The About page visit section has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Static Pages</h1>
      </div>

      <p className="text-gray-600">
        Edit the content of your website's static pages here. Changes will be immediately visible on the customer-facing website.
      </p>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="mission">Our Mission</TabsTrigger>
          <TabsTrigger value="values">Our Values</TabsTrigger>
          <TabsTrigger value="team">Our Team</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit About Page Content</h2>
            <p className="text-gray-600">
              This content will appear on the About page of your website. Use clear, concise language to tell your story and share your mission with customers.
            </p>

            <div className="space-y-2">
              <label htmlFor="aboutContent" className="text-sm font-medium">
                Page Content
              </label>
              <Textarea
                id="aboutContent"
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                placeholder="Enter your About page content here..."
                rows={15}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveAbout}>
                <Save className="h-4 w-4 mr-2" />
                Save About Page
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mission" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit Our Mission Section</h2>
            <p className="text-gray-600">
              This content will appear in the Mission section of the About page. Describe your company's mission and history.
            </p>

            <div className="space-y-2">
              <label htmlFor="missionContent" className="text-sm font-medium">
                Mission Content
              </label>
              <Textarea
                id="missionContent"
                value={missionContent}
                onChange={(e) => setMissionContent(e.target.value)}
                placeholder="Enter your mission content here..."
                rows={10}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveMission}>
                <Save className="h-4 w-4 mr-2" />
                Save Mission Section
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="values" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit Our Values Section</h2>
            <p className="text-gray-600">
              Edit the values that define your company. These will appear in the Values section of the About page.
            </p>

            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Value {index + 1}</h3>
                    {values.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const updatedValues = [...values];
                          updatedValues.splice(index, 1);
                          setValues(updatedValues);
                        }}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={value.title}
                        onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                        placeholder="Value title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Icon</label>
                      <Input
                        value={value.icon}
                        onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                        placeholder="Icon name (Leaf, Heart, Users, Globe, etc.)"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                      placeholder="Value description"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setValues([...values, { title: "", description: "", icon: "Star" }]);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
                
                <Button onClick={handleSaveValues}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Values
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit Our Team Section</h2>
            <p className="text-gray-600">
              Manage the team members that appear on the About page. Add, edit, or remove team members as needed.
            </p>

            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Team Member {index + 1}</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRemoveTeamMember(index)}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Input
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={member.bio}
                      onChange={(e) => handleTeamMemberChange(index, 'bio', e.target.value)}
                      placeholder="Short bio"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={member.image}
                      onChange={(e) => handleTeamMemberChange(index, 'image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleAddTeamMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
                
                <Button onClick={handleSaveTeam}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Team
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-eco-800">Edit Contact Page Content</h2>
            <p className="text-gray-600">
              This content will appear on the Contact page of your website. Include important information like business hours, location, and additional contact methods.
            </p>

            <div className="space-y-2">
              <label htmlFor="contactContent" className="text-sm font-medium">
                Page Content
              </label>
              <Textarea
                id="contactContent"
                value={contactContent}
                onChange={(e) => setContactContent(e.target.value)}
                placeholder="Enter your Contact page content here..."
                rows={15}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveContact}>
                <Save className="h-4 w-4 mr-2" />
                Save Contact Page
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pages;
