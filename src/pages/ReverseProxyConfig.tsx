import React, { useState } from "react";
import { Waypoints, Download } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { NginxLogo } from "@/components/icons/nginx";
import { TraefikLogo } from "@/components/icons/traefik";
import { CaddyLogo } from "@/components/icons/caddy";

const ReverseProxyConfig: React.FC = () => {
  return (
    <>
      <div className="flex justify-center">
        {/* This div makes everything in a container and center aligns it */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 lg:w-2/3 border border-red-600">
          {/* Header */}
          <div className="flex md:col-span-3 p-4 gap-2 items-center justify-center border border-green-600">
            {/* Justify will center the items in the middle, Items will align the items */}
            <Waypoints size="30" />
            <h1>Generate Reverse Proxy Site Block</h1>
          </div>

          {/* Col 1 */}
          <div className="flex flex-col gap-4 p-4 border border-blue-600">
            
            <Label htmlFor="input-1">Host/Domain Name</Label>
            <Input
              id="input-1"
              placeholder="Enter things..."
              aria-label="Input field"
            />
            <Label htmlFor="input-2">Port</Label>
            <Input
              id="input-2"
              placeholder="Enter things..."
              aria-label="Input field"
            />
            <Label htmlFor="input-3">Input</Label>
            <Input
              id="input-3"
              placeholder="Enter things..."
              aria-label="Input field"
            />
            
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
          <div className="flex lg:col-span-3 gap-4 p-4 border justify-center border-purple-600">
            <RadioGroup defaultValue="caddy" className="flex">
              <RadioGroupItem
                value="caddy"
                id="caddy"
                className="sr-only"
                aria-label="Caddy"
              />
              <Label
                htmlFor="caddy"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
              >
                <CaddyLogo className="mb-3 h-8 w-8" />
                Caddy
              </Label>

              <RadioGroupItem
                value="nginx"
                id="nginx"
                className="sr-only"
                aria-label="Nginx"
              />
              <Label
                htmlFor="nginx"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
              >
                <NginxLogo className="mb-3 h-8 w-8" />
                Nginx
              </Label>

              <RadioGroupItem
                value="traefik"
                id="traefik"
                className="sr-only"
                aria-label="Traefik"
              />
              <Label
                htmlFor="Traefik"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
              >
                <TraefikLogo className="mb-3 h-8 w-8" />
                Traefik
              </Label>
            </RadioGroup>
          </div>

          <div className="flex lg:col-span-3 gap-4 p-4 border justify-center border-purple-600">
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

          <div className="flex flex-col lg:col-span-3 gap-4 p-4 border border-yellow-600">
            <Textarea
              id="textarea-1"
              className="p-4 bg-zinc-900"
              placeholder="Enter things..."
              rows="5"
              aria-label="Text area for additional information"
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

export default ReverseProxyConfig;
