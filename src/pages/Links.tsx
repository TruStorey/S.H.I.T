import React from "react";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Links: React.FC = () => {
  return (
    <>
      <div className="flex justify-center">
        {/* This div makes everything in a container and center aligns it */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:w-2/3">
          {/* Header */}
          <div className="flex md:col-span-2 p-4 gap-2 items-center justify-center">
            {/* Justify will center the items in the middle, Items will align the items */}
            <Link2 size="30" />
            <h1>Links to other tools</h1>
          </div>

          {/* Col 1 */}
          <div className="flex flex-col gap-4 p-4">
            <h2>Data</h2>
            <ul>
              <li>https://tableconvert.com/</li>
            </ul>
            
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4 p-4 justify-around border border-pink-600">
            {/* Add flex-col ^^^^ to stack items on top of each other.  */}

     Stuff2
          </div>

     


        </div>
      </div>
    </>
  );
};

export default Links;
