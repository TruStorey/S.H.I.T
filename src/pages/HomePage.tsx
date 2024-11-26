import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ListMinus,
  CalendarClock,
  Waypoints,
  Workflow,
  Binary,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardData = [
  {
    title: "Transform Lists",
    description: "Edit and Transform Lists",
    url: "/transform-list",
    icon: ListMinus,
  },
  {
    title: "Date/Time Converter",
    description: "Convert dates and times into different formats or time zones",
    url: "/date-time-converter",
    icon: CalendarClock,
  },
  {
    title: "Reverse Proxy Config",
    description: "Edit and Transform Lists",
    url: "/reverse-proxy-config",
    icon: Waypoints,
  },
  {
    title: "Subnet Calculator",
    description: "Visually split and merge subnets",
    url: "/subnet-calculator",
    icon: Workflow,
  },
  {
    title: "Base64 Converter",
    description: "Edit and Transform Lists",
    url: "/base64-converter",
    icon: Binary,
  },
  {
    title: "Certificate Checker",
    description: "Edit and Transform Lists",
    url: "/certificate-checker",
    icon: ShieldCheck,
  },
  {
    title: "SSH Key Generator",
    description: "Edit and Transform Lists",
    url: "/ssh-key-generator",
    icon: KeyRound,
  },
  {
    title: "Boilerplate",
    description: "Blank Start page",
    url: "/boilerplate",
    icon: KeyRound,
  },
]

const HomePage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-4">Small Helpful IT Tools</h1>
        <p>
          A collection of s.h.i.t to help with the day to day, it's{" "}
          <a href="https://www.youtube.com/watch?v=edmqTODMZC4" target="_blank">
            happening
          </a>
          .
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8 px-32"> 
      {cardData.map((card, index) => ( 
          
        <Card key={index} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button variant="default" size="icon" className="ml-auto" asChild>
              <Link to={card.url}><card.icon /></Link>
            </Button>
          </CardFooter>
        </Card>
            
        ))}
        </div>
      
    </>
  );
};

export default HomePage;
