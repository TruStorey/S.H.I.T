import React, { useState, useEffect } from "react";
import {
  Waypoints,
  Copy,
  Trash2,
  BookText,
  GitPullRequestCreateArrow,
  GitCompareArrows,
  GitPullRequestClosed,
  GitMerge,
  GitCommitVertical,
  Hash,
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
  const [selectedProxy, setSelectedProxy] = useState<string>("caddy");
  const [generatedConfig, setGeneratedConfig] = useState<string>("");

  // Supported load balancing policies for each reverse proxy
  const loadBalancerOptions: Record<string, string[]> = {
    caddy: ["round_robin", "least_conn", "random", "first", "ip_hash"],
    nginx: ["round_robin", "least_conn", "ip_hash"],
    traefik: ["round_robin"], // Only round_robin is supported in Traefik
  };

  const availablePolicies = loadBalancerOptions[selectedProxy] || [];

  useEffect(() => {
    setGeneratedConfig(generateConfig());
  }, [hostname, upstreams, loadBalancingPolicy, selectedProxy]);

  const generateConfig = () => {
    if (!hostname.value) {
      return "# Warning: Hostname is missing. Please configure it.\n";
    }

    let config = "# Reverse Proxy Configuration\n\n";

    if (selectedProxy === "caddy") {
      // Caddy Configuration
      config += `${hostname.value}:${hostname.port} {\n`;
      if (upstreams.length > 0) {
        config += `  reverse_proxy`;
        upstreams.forEach((upstream) => {
          if (upstream.hostname && upstream.port) {
            config += ` ${upstream.hostname}:${upstream.port}`;
          }
        });
        if (upstreams.length > 1) {
          config += ` {\n`;
          config += `    lb_policy ${loadBalancingPolicy}\n`;
          config += `  }\n`;
        } else {
          config += `\n`;
        }
      }
      config += `}\n`;
    } else if (selectedProxy === "nginx") {
      // Nginx Configuration
      config += `server {\n`;
      config += `  listen ${hostname.port} ssl;\n`;
      config += `  server_name ${hostname.value};\n\n`;

      if (upstreams.length > 0) {
        config += `  # Upstreams configuration\n`;
        config += `  upstream backends {\n`;
        upstreams.forEach((upstream) => {
          if (upstream.hostname && upstream.port) {
            config += `    server ${upstream.hostname}:${upstream.port};\n`;
          }
        });
        if (loadBalancingPolicy === "ip_hash") {
          config += `    ip_hash;\n`;
        } else if (loadBalancingPolicy === "least_conn") {
          config += `    least_conn;\n`;
        }
        config += `  }\n\n`;
      }

      config += `  location / {\n`;
      config += `    proxy_pass http://backends;\n`;
      config += `    proxy_set_header Host $host;\n`;
      config += `    proxy_set_header X-Real-IP $remote_addr;\n`;
      config += `    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
      config += `  }\n`;
      config += `}\n`;
    } else if (selectedProxy === "traefik") {
      // Traefik Configuration
      config += `http:\n`;
      config += `  routers:\n`;
      config += `    my-router:\n`;
      config += `      rule: "Host(\`${hostname.value}\`)"\n`;
      config += `      entryPoints:\n`;
      config += `        - websecure\n`;
      config += `      service: "my-service"\n`;

      config += `  services:\n`;
      config += `    my-service:\n`;
      config += `      loadBalancer:\n`;
      if (loadBalancingPolicy !== "round_robin") {
        config += `        # Note: Traefik defaults to round_robin. '${loadBalancingPolicy}' is not configurable.\n`;
      }
      config += `        servers:\n`;
      upstreams.forEach((upstream) => {
        if (upstream.hostname && upstream.port) {
          config += `          - url: "http://${upstream.hostname}:${upstream.port}"\n`;
        }
      });
    }

    console.log("Generated Config:", config);
    return config;
  };

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
            <div className="flex">
              <ToggleGroup
                variant="outline"
                type="single"
                size={"lg"}
                onValueChange={(value) => {
                  console.log("Selected Proxy:", value); // Debug log
                  setSelectedProxy(value);
                }}
                value={selectedProxy}
              >
                <ToggleGroupItem value="caddy" aria-label="Caddy">
                  <CaddyLogo />
                  Caddy
                </ToggleGroupItem>
                <ToggleGroupItem value="nginx" aria-label="Nginx">
                  <NginxLogo />
                  Nginx
                </ToggleGroupItem>
                <ToggleGroupItem value="traefik" aria-label="Traefik">
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
                  />
                  :
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
                  <Button variant="outline">
                    <BookText />
                  </Button>
                </div>

                <h5 className="p-1">Upstreams</h5>
                {upstreams.map((upstream, index) => (
                  <div key={index} className="flex flex-col gap-2 mb-4">
                    <div className="flex gap-2 items-center">
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
                      />
                      :
                      <Input
                        value={upstream.port || ""}
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
                              disabled={
                                !availablePolicies.includes("round_robin")
                              }
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
                              disabled={
                                !availablePolicies.includes("least_conn")
                              }
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
                            <ToggleGroupItem
                              value="first"
                              aria-label="First"
                              disabled={!availablePolicies.includes("first")}
                            >
                              <GitCommitVertical />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>First</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <ToggleGroupItem
                              value="random"
                              aria-label="Random"
                              disabled={!availablePolicies.includes("random")}
                            >
                              <GitMerge />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Random</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <ToggleGroupItem
                              value="ip_hash"
                              aria-label="IP Hash"
                              disabled={!availablePolicies.includes("ip_hash")}
                            >
                              <Hash />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>IP Hash</p>
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
                {/* Automatic HTTPS */}
                <div className="mt-4">
                  <div className="flex flex-col gap-2">
                  <h5 className="p-1">Auto or Manual HTTPS</h5>
                    <Tabs defaultValue="auto-https">
                      <TabsList className="grid w-full grid-cols-3">
                      
                        <TabsTrigger value="auto-https-le">Auto (Let's Encrypt)</TabsTrigger>
                        <TabsTrigger value="auto-https-ca">Auto (Internal CA)</TabsTrigger>
                        <TabsTrigger value="manual-https">
                          Manual HTTPS
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="auto-https-le">
                        {/* Certificate Resolver */}
                        <div className="mt-4">
                            <div className="flex flex-col gap-2">
                            <Input id="le-email" type="email" placeholder="Enter your email address to register cert.."/>
                            <div className="flex">
                            <Button variant="outline">* Cert</Button>
                            <Input id="dns-provider" placeholder="Enter your DNS provider credentials.." className="w-1/2"/>
                            </div>
                            </div>
                            
                        </div>

                        {/* Wildcard Certificates */}
                        <div className="mt-4">
                          <h5 className="p-1">Wildcard Certificates</h5>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Enable or Disable Wildcard Certificates" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="enabled">Enabled</SelectItem>
                              <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                      <TabsContent value="manual-https">
                        <div className="flex flex-row gap-2 justify-between">
                          <div className="flex flex-col w-1/2">
                            <h5 className="p-1">Certificate Path</h5>
                            <Input
                              id="cert-path"
                              placeholder="e.g., /path/to/cert.pem"
                            />
                          </div>
                          <div className="flex flex-col w-1/2">
                            <h5 className="p-1">Key Path</h5>
                            <Input
                              id="key-path"
                              placeholder="e.g., /path/to/key.pem"
                            />
                          </div>
                        </div>

                        {/* Minimum TLS Version */}
                        <div className="mt-4">
                          <h5 className="p-1">Minimum TLS Version</h5>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Minimum TLS Version" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tls1.2">TLS 1.2</SelectItem>
                              <SelectItem value="tls1.3">TLS 1.3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                {/* Email for SSL */}
                <div className="mt-4">
                  <h5 className="p-1">Email for SSL</h5>
                  <Input id="tls-email" placeholder="e.g., email@example.com" />
                </div>

                {/* Type of SSL */}
                <div className="mt-4">
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
            <div className="relative h-full">
              <Textarea
                id="textarea-1"
                className="h-full p-4"
                placeholder="Reverse proxy config will appear here..."
                value={generatedConfig}
                readOnly
              />
              <div>
                <Button variant="ghost" className="absolute top-2 right-2">
                  <Copy />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReverseProxyConfig;
