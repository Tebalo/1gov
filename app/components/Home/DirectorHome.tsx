import React, { Suspense } from "react";
import { PageTitle } from "../PageTitle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ApplicationStatusPieChart from "../recharts/piechart-padding-angle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, List } from "lucide-react";
import { HorizontalBarChartStatus } from "../dashboard/components/horizontal-bar-chart";

// Mock data for worklist, followed items, and notifications
const worklistItems = [
  { id: 1, title: "Review application #1234", dueDate: "2024-07-25" },
  { id: 2, title: "Approve license renewal #5678", dueDate: "2024-07-26" },
];

const followedItems = [
  { id: 1, title: "Registration policy update", status: "In progress" },
  { id: 2, title: "New teacher onboarding process", status: "Completed" },
];

const notifications = [
  { id: 1, message: "New application submitted", time: "2 hours ago" },
  { id: 2, message: "License renewal approved", time: "1 day ago" },
];

function InformationBanner() {
  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">Teacher Registration and Licensing in Botswana</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>BOTEPCO regulates teaching through registration and licensing based on recognized qualifications.</li>
          <li>Teachers must be registered and licensed by the Council to practice.</li>
          <li>Applications require prescribed forms, fees, and documentation.</li>
          <li>Licenses are valid for 36 months (non-citizens) or up to 60 months (citizens).</li>
          <li>The Council maintains an official Register of qualified teachers.</li>
          <li>Continuing Professional Development (CPD) is promoted for ongoing skill development.</li>
          <li>CPD includes activities to enhance teachers&rsquo; skills, knowledge, and expertise.</li>
          <li>School leaders must regularly update their management and leadership practices.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export const DirectorHome = () => {
  return (
    <div className="overflow-auto h-screen rounded-lg">
      <div className="mb-5">
        <PageTitle Title="Welcome to Teacher Registration and Licensing System" />
      </div>
      <InformationBanner />
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Applications by status</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="font-light">Show statuses for</Label>
            <Select>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select an application..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Application Type</SelectLabel>
                  <SelectItem value="Registration">Registration</SelectItem>
                  <SelectItem value="License renewal">License renewal</SelectItem>
                  <SelectItem value="License">License</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Suspense fallback="Loading...">
              <HorizontalBarChartStatus />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="mr-2" /> Worklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            {worklistItems.map((item) => (
              <div key={item.id} className="mb-2 p-2 bg-gray-100 rounded">
                <p>{item.title}</p>
                <p className="text-sm text-gray-500">Due: {item.dueDate}</p>
              </div>
            ))}
            <Button className="w-full mt-2">View All Tasks</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2" /> Things I Follow
            </CardTitle>
          </CardHeader>
          <CardContent>
            {followedItems.map((item) => (
              <div key={item.id} className="mb-2 p-2 bg-gray-100 rounded">
                <p>{item.title}</p>
                <p className="text-sm text-gray-500">Status: {item.status}</p>
              </div>
            ))}
            <Button className="w-full mt-2">View All Followed Items</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.map((notification) => (
            <div key={notification.id} className="mb-2 p-2 bg-gray-100 rounded flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <div>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
          <Button className="w-full mt-2">View All Notifications</Button>
        </CardContent>
      </Card>
    </div>
  );
};