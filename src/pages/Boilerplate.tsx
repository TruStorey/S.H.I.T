import React from "react";
import { Brush, Power } from "lucide-react";

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
            
          </div>

          {/* Col 2 */}
          <div className="flex gap-4 p-4 border border-pink-600">
            {/* Add flex-col ^^^^ to stack items on top of each other.  */}

          
          </div>
        </div>
      </div>
    </>
  );
};

export default BoilerPlate;
