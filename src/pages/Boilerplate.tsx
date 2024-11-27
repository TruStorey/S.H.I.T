import React from "react";
import { Brush, Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BoilerPlate: React.FC = () => {
  return (
    <>
      <div className="flex justify-center">
        {/* This div makes everything in a container and center aligns it */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:w-2/3 border border-red-600">
          {/* Header */}
          <div className="flex md:col-span-2 p-4 gap-2 items-center justify-center border border-green-600">
            {/* Justify will center the items in the middle, Items will align the items */}
            <Brush size="30" />
            <h1>Enter a description here</h1>
          </div>

          {/* Col 1 */}
          <div className="flex gap-4 p-4 border border-blue-600 ">
            <Button variant="outline">
              <Power /> Button
            </Button>
            <Button variant="default">
              <Power /> Button
            </Button>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4 p-4 justify-around border border-pink-600">
            {/* Add flex-col ^^^^ to stack items on top of each other.  */}

            <Label htmlFor="input-1">Input</Label>
            <Input
              id="input-1"
              placeholder="Enter things..."
              aria-label="Input field"
            />
          </div>

          {/* Col 3 spanning 2 cols */}
          <div className="lg:col-span-2 gap-4 p-4 border border-purple-600">
            <Textarea
              id="textarea-1"
              className="p-4"
              placeholder="Enter things..."
              rows="5"
              aria-label="Text area for additional information"
            />
          </div>


        </div>
      </div>
    </>
  );
};

export default BoilerPlate;
