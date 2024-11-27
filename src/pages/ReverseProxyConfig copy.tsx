import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

// Validation schema
const formSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  upstream: z.string().min(1, "Upstream server is required"),
  proxyType: z.enum(["caddy", "nginx", "traefik", "haproxy"]),
  port: z.union([
    z.enum(["80", "443", "custom"]),
    z.string().regex(/^\d+$/, "Port must be a valid number"),
  ]),
  customPort: z.string().optional(),
  sslEnabled: z.boolean(),
  cachingEnabled: z.boolean(),
  rateLimitingEnabled: z.boolean(),
  loggingEnabled: z.boolean(),
  loadBalancing: z.boolean(),
  headers: z.string().optional(),
  errorPages: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReverseProxyConfig: React.FC = () => {
  const [output, setOutput] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      upstream: "",
      proxyType: "caddy",
      port: "80",
      customPort: "",
      sslEnabled: false,
      cachingEnabled: false,
      rateLimitingEnabled: false,
      loggingEnabled: false,
      loadBalancing: false,
      headers: "",
      errorPages: "",
    },
  });

  const generateConfig = (data: FormValues) => {
    const {
      domain,
      upstream,
      proxyType,
      port,
      customPort,
      sslEnabled,
      cachingEnabled,
      rateLimitingEnabled,
      loggingEnabled,
      loadBalancing,
      headers,
      errorPages,
    } = data;

    const bindPort = port === "custom" ? customPort : port;
    let config = "";

    switch (proxyType) {
      case "caddy":
        config = `${sslEnabled ? "https" : "http"}://${domain}:${bindPort} {\n`;
        config += `  reverse_proxy ${upstream}\n`;
        if (cachingEnabled) config += `  cache\n`;
        if (rateLimitingEnabled) config += `  rate_limit\n`;
        if (loggingEnabled) config += `  log\n`;
        if (headers) config += `  header ${headers}\n`;
        if (errorPages) config += `  handle_errors ${errorPages}\n`;
        config += `}`;
        break;

      case "nginx":
        config = `server {\n  listen ${bindPort} ${
          sslEnabled ? "ssl" : ""
        };\n  server_name ${domain};\n\n`;
        config += `  location / {\n    proxy_pass http://${upstream};\n`;
        if (cachingEnabled) config += `    proxy_cache my_cache;\n`;
        if (headers) config += `    add_header ${headers};\n`;
        config += `  }\n\n`;
        if (sslEnabled)
          config += `  ssl_certificate /path/to/cert;\n  ssl_certificate_key /path/to/key;\n`;
        if (loggingEnabled) config += `  access_log /var/log/nginx/access.log;\n`;
        if (errorPages) config += `  error_page ${errorPages};\n`;
        config += `}`;
        break;

      case "traefik":
        config = `http:\n  routers:\n    my-router:\n      rule: "Host(\`${domain}\`)"\n      service: my-service\n`;
        config += `      entryPoints:\n        - web\n`;
        if (sslEnabled)
          config += `      tls:\n        certResolver: "myresolver"\n`;
        config += `  services:\n    my-service:\n      loadBalancer:\n        servers:\n          - url: "http://${upstream}"\n`;
        if (cachingEnabled) config += `  middlewares:\n    cache:\n      my-cache-config\n`;
        if (rateLimitingEnabled)
          config += `  middlewares:\n    rate-limit:\n      rateLimit:\n        average: 100\n        burst: 200\n`;
        break;

      case "haproxy":
        config = `frontend http-in\n  bind *:${bindPort} ${
          sslEnabled ? "ssl crt /path/to/cert" : ""
        }\n`;
        config += `  acl host_acl hdr(host) -i ${domain}\n  use_backend servers_backend if host_acl\n\n`;
        config += `backend servers_backend\n  server server1 ${upstream}\n`;
        if (cachingEnabled) config += `  http-request cache-use my-cache\n`;
        if (loadBalancing) config += `  balance roundrobin\n`;
        break;

      default:
        config = "Invalid proxy type selected.";
    }   

    setOutput(config);
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reverse Proxy Config Generator</h1>
      <div>
      <NginxLogo />
      <TraefikLogo />
      <CaddyLogo />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(generateConfig)}
          className="space-y-4"
        >
          {/* Proxy Type */}
          <FormField
            name="proxyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proxy Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Proxy Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="caddy">Caddy</SelectItem>
                    <SelectItem value="nginx">NGINX</SelectItem>
                    <SelectItem value="traefik">Traefik</SelectItem>
                    <SelectItem value="haproxy">HAProxy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Domain */}
          <FormField
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Port */}
          <FormField
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Port" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="80">80</SelectItem>
                    <SelectItem value="443">443</SelectItem>
                    <SelectItem value="custom">Custom Port</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="customPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Port</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter port number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* SSL */}
          <FormField
            name="sslEnabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Enable SSL</FormLabel>
              </FormItem>
            )}
          />
          {/* Other Options */}
          <FormField
            name="cachingEnabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Enable Caching</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            name="rateLimitingEnabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Enable Rate Limiting</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            name="loggingEnabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Enable Logging</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            name="headers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Headers</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="e.g., X-Header: Value" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Generate Configuration</Button>
        </form>
      </Form>

      {/* Output */}
      {output && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Generated Configuration</h2>
          <Textarea readOnly value={output} rows={15} className="mt-2" />
        </div>
      )}
    </div>
  );
};

export default ReverseProxyConfig;
