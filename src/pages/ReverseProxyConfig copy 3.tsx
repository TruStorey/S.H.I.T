import React from "react";
import { Waypoints, Download } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { NginxLogo } from "@/components/icons/nginx";
import { TraefikLogo } from "@/components/icons/traefik";
import { CaddyLogo } from "@/components/icons/caddy";

const BoilerPlate: React.FC = () => {
  return (
    <>
      <div className="flex justify-center">
        {/* This div makes everything in a container and center aligns it */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:w-2/3 border border-red-600">
          {/* Header */}
          <div className="flex md:col-span-2 p-4 gap-2 items-center justify-center border border-green-600">
            {/* Justify will center the items in the middle, Items will align the items */}
            <Waypoints size="30" />
            <h1>Create site blocks for reverse proxies</h1>
          </div>

          {/* Col 1 */}
          <div className="flex gap-4 p-4 border border-blue-600 ">
            Content1
          </div>
          <div className="flex gap-4 p-4 border border-blue-600 ">
            Content2
          </div>

          {/* Col 2 */}
          <div className="flex col-span-2 gap-4 p-4 justify-center border border-pink-600">
            <Button variant="outline">
              <CaddyLogo />
              Caddy
            </Button>
            <Button variant="outline">
              <NginxLogo />
              Nginx
            </Button>
            <Button variant="outline">
              <TraefikLogo />
              Traefik
            </Button>
          </div>

          <div className="flex flex-col lg:col-span-2 gap-4 p-4 justify-center border border-yellow-600">
            <Textarea
              id="textarea-1"
              className="p-4 bg-zinc-900"
              placeholder="Reverse proxy config will appear here..."
              rows="10"
              readonly
            />
            <Button variant="default">
              <Download /> Download
            </Button>
          </div>

          
          </div>
        </div>
      
    </>
  );
};

export default BoilerPlate;
