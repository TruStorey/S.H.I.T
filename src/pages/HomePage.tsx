import React from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const HomePage: React.FC = () => {
  return (
    <>
    <div className="flex flex-col justify-center items-center">
      <h1 className="mb-4">
        Small Helpful IT Tools
      </h1>
      <p>
        A collection of s.h.i.t to help with the day to day, it's <a href="https://www.youtube.com/watch?v=edmqTODMZC4" target="_blank">happening</a>.
      </p>
    </div>
    <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      This is a card
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
  </>
  )
};


export default HomePage;
