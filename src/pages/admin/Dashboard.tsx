
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, FileText, DollarSign } from "lucide-react";

const Dashboard = () => {
  // Demo stats
  const stats = [
    {
      title: "Total Sales",
      value: "$12,543",
      change: "+12%",
      icon: <DollarSign className="h-8 w-8 text-eco-600" />,
    },
    {
      title: "Active Orders",
      value: "18",
      change: "+4%",
      icon: <ShoppingBag className="h-8 w-8 text-eco-600" />,
    },
    {
      title: "Customers",
      value: "2,354",
      change: "+18%",
      icon: <Users className="h-8 w-8 text-eco-600" />,
    },
    {
      title: "Blog Posts",
      value: "42",
      change: "+3%",
      icon: <FileText className="h-8 w-8 text-eco-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-eco-800">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-eco-100 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-eco-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New order #1092</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-eco-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-eco-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-eco-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-eco-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New blog post published</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
