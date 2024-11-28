import React, { useState } from "react";
import {
  Waypoints,
  Download,
  Trash2,
  BookText,
  GitPullRequestCreateArrow,
  GitCompareArrows,
  GitPullRequestClosed,
  GitMerge,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { NginxLogo } from "@/components/icons/nginx";
import { TraefikLogo } from "@/components/icons/traefik";
import { CaddyLogo } from "@/components/icons/caddy";

const ReverseProxyConfig: React.FC = () => {
  const [hostname, setHostname] = useState({
    value: "",
    port: "443", // Default to HTTPS on load
  });

  const [upstreams, setUpstreams] = useState([
    { hostname: "", port: "", loadBalancing: "round_robin" },
  ]);

  const [loadBalancingPolicy, setLoadBalancingPolicy] = useState("round_robin"); // Global policy
  const [activeTab, setActiveTab] = useState("reverse-proxy");
  const [errorPageType, setErrorPageType] = useState<string>("default"); // Initialize with "default"

  return (
    <>
      <div className="flex justify-center">
        {/* Main container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 lg:w-2/3">
          {/* Header */}
          <div className="flex md:col-span-3 p-4 gap-2 items-center justify-center">
            <Waypoints size="30" />
            <h1>Create site blocks for reverse proxies</h1>
          </div>

          {/* Content1: Static Files or Reverse Proxy */}
          <div className="flex flex-col gap-4 p-4">
            <div className="flex"></div>
            <div className="flex">
              <ToggleGroup variant="outline" type="single" size={"lg"}>
                <ToggleGroupItem value="caddy" aria-label="Caddy">
                  <CaddyLogo />
                  Caddy
                </ToggleGroupItem>
                <ToggleGroupItem value="nginx" aria-label="Nginx">
                  <NginxLogo />
                  Nginx
                </ToggleGroupItem>
                <ToggleGroupItem value="Traefik" aria-label="Traefik">
                  <TraefikLogo />
                  Traefik
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reverse-proxy">Reverse Proxy</TabsTrigger>
                <TabsTrigger value="static-files">Static Files</TabsTrigger>
              </TabsList>

              {/* Reverse Proxy Tab */}
              <TabsContent value="reverse-proxy">
                <h5 className="p-1">Site Hostname</h5>
                <div className="flex gap-2 mb-4 items-center">
                  {/* Hostname Input */}
                  <Input
                    value={hostname.value}
                    onChange={(e) => {
                      const value = e.target.value.trim(); // Trim whitespace for clean input

                      setHostname((prev) => ({
                        ...prev,
                        value,
                        port: value.startsWith("http://") ? "80" : "443", // Update port based on protocol
                      }));
                    }}
                    placeholder="Enter Hostname / IP..."
                    className=""
                  />
                  :{/* Port Input */}
                  <Input
                    value={hostname.port}
                    onChange={(e) => {
                      const portValue = e.target.value.trim();
                      setHostname((prev) => ({
                        ...prev,
                        port: portValue, // Allow manual port override
                      }));
                    }}
                    placeholder="Port..."
                    className="w-2/6"
                  />
                  {/* Additional Button */}
                  <Button variant="outline">
                    <BookText />
                  </Button>
                </div>

                <h5 className="p-1">Upstreams</h5>
                {upstreams.map((upstream, index) => (
                  <div key={index} className="flex flex-col gap-2 mb-4">
                    <div className="flex gap-2 items-center">
                      {/* Upstream Hostname Input */}
                      <Input
                        value={upstream.hostname}
                        onChange={(e) => {
                          const value = e.target.value.trim(); // Trim whitespace
                          setUpstreams((prev) => {
                            const updated = [...prev];
                            updated[index] = {
                              ...updated[index],
                              hostname: value,
                            };
                            return updated;
                          });
                        }}
                        placeholder="Enter Hostname / IP / Service..."
                        className=""
                      />
                      :{/* Upstream Port Input */}
                      <Input
                        value={upstream.port || ""} // Default to blank
                        onChange={(e) => {
                          const portValue = e.target.value.trim();
                          setUpstreams((prev) => {
                            const updated = [...prev];
                            updated[index] = {
                              ...updated[index],
                              port: portValue,
                            };
                            return updated;
                          });
                        }}
                        placeholder="Port..."
                        className="w-2/6"
                      />
                      {/* Book Button for First Upstream */}
                      {index === 0 ? (
                        <Button variant="outline">
                          <BookText />
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setUpstreams((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Load Balancing Selector */}

                <div className="flex mt-4">
                  {upstreams.length > 1 && (
                    <TooltipProvider>
                      <ToggleGroup
                        variant="outline"
                        type="single"
                        onValueChange={(value) => setLoadBalancingPolicy(value)}
                        value={loadBalancingPolicy}
                        className="flex gap-2"
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <ToggleGroupItem
                              value="round_robin"
                              aria-label="Round Robin"
                            >
                              <GitCompareArrows />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Round Robin</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <ToggleGroupItem
                              value="least_conn"
                              aria-label="Least Connections"
                            >
                              <GitPullRequestClosed />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Least Connections</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <ToggleGroupItem value="random" aria-label="Random">
                              <GitMerge />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Random</p>
                          </TooltipContent>
                        </Tooltip>
                      </ToggleGroup>
                    </TooltipProvider>
                  )}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setUpstreams([
                        ...upstreams,
                        {
                          hostname: "",
                          port: "",
                        },
                      ])
                    }
                    className="ml-auto"
                  >
                    <GitPullRequestCreateArrow />
                  </Button>
                </div>
              </TabsContent>

              {/* Static Files Tab */}
              <TabsContent value="static-files">
                <h5 className="p-1">Root Directory</h5>
                <Input id="root" placeholder="Enter path /var/www/html ..." />
              </TabsContent>
            </Tabs>

            <Tabs defaultValue="tls">
              <TabsList>
                <TabsTrigger value="tls">TLS</TabsTrigger>
                <TabsTrigger value="logging">Logging</TabsTrigger>
                <TabsTrigger value="compression">Compression</TabsTrigger>
                <TabsTrigger value="error-pages">Error Pages</TabsTrigger>
                <TabsTrigger value="rate-limiting">Rate Limiting</TabsTrigger>
              </TabsList>

              {/* TLS Tab */}
              <TabsContent value="tls">
                <h5 className="p-1">Email for SSL</h5>
                <Input id="tls-email" placeholder="e.g., email@example.com" />
                <h5 className="p-1">Type</h5>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SSL type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self-signed">Self-Signed</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>

                {/* SSL Certificates */}
                <div className="mt-4">
                  <h5 className="p-1">Certificate Path</h5>
                  <Input id="cert-path" placeholder="e.g., /path/to/cert.pem" />
                  <h5 className="p-1">Key Path</h5>
                  <Input id="key-path" placeholder="e.g., /path/to/key.pem" />
                </div>
              </TabsContent>

              {/* Logging Tab */}
              <TabsContent value="logging">
                <Label htmlFor="log-output">Log Output</Label>
                <Input id="log-output" placeholder="e.g., /path/to/log" />
                <Label htmlFor="log-format">Log Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select log format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="plain">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>

              {/* Compression Tab */}
              <TabsContent value="compression">
                <Label htmlFor="compression-types">Compression Types</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compression type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gzip">Gzip</SelectItem>
                    <SelectItem value="zstd">Zstd</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>

              {/* Error Pages Tab */}
              <TabsContent value="error-pages">
                <Label htmlFor="error-type">Error Page Type</Label>
                <Select
                  onValueChange={(value) => {
                    setErrorPageType(value); // Update the error page type state dynamically
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select error page type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="custom-url">Custom URL</SelectItem>
                    <SelectItem value="static-file">Static File</SelectItem>
                  </SelectContent>
                </Select>

                {/* Dynamically Render Based on Selection */}
                {errorPageType === "custom-url" && (
                  <div className="mt-4">
                    <Label htmlFor="error-custom-url">Custom URL</Label>
                    <Input
                      id="error-custom-url"
                      placeholder="e.g., https://example.com/error"
                    />
                  </div>
                )}
                {errorPageType === "static-file" && (
                  <div className="mt-4">
                    <Label htmlFor="error-file-path">Static File Path</Label>
                    <Input
                      id="error-file-path"
                      placeholder="e.g., /path/to/error.html"
                    />
                  </div>
                )}
              </TabsContent>

              {/* Rate Limiting Tab */}
              <TabsContent value="rate-limiting">
                <Label htmlFor="rate-limit-path">Path</Label>
                <Input id="rate-limit-path" placeholder="e.g., /api/*" />
                <Label htmlFor="rate-limit">Limit</Label>
                <Input id="rate-limit" placeholder="e.g., 10 requests/sec" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Output Section */}
          <div className="flex flex-col lg:col-span-2 gap-4 p-4 justify-center">
            <Textarea
              id="textarea-1"
              className="h-full p-4"
              placeholder="Reverse proxy config will appear here..."
              readOnly
            />
            <div>
              <Button variant="default">
                <Download /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReverseProxyConfig;
