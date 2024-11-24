import React, { useState } from "react";
import {
  Workflow,
  LandPlot,
  MonitorCheck,
  LaptopMinimal,
  Split,
  Merge,
  CornerRightDown,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  calculateCidrOptions,
  isValidSubnet,
  ipToInt,
  intToIp,
} from "@/lib/cidr";

type SubnetInfo = {
  subnet: string;
  netmask: string;
  range: string;
  usable: string;
  hosts: number;
  parentCidr?: string; // Tracks the parent CIDR for merge functionality
};

const SubnetCalculator: React.FC = () => {
  const [subnet, setSubnet] = useState("");
  const [cidrOptions, setCidrOptions] = useState<
    { cidr: number; info: string }[]
  >([]);
  const [selectedCidr, setSelectedCidr] = useState<string>("");
  const [subnetInfo, setSubnetInfo] = useState<SubnetInfo[]>([]);

  const [showSubnet, setShowSubnet] = useState(true);
  const [showNetmask, setShowNetmask] = useState(true);
  const [showRange, setShowRange] = useState(true);
  const [showUseable, setShowUseable] = useState(true);
  const [showHosts, setShowHosts] = useState(true);

  const handleSubnetBlur = () => {
    if (isValidSubnet(subnet)) {
      const options = calculateCidrOptions(subnet);
      setCidrOptions(options);
    } else {
      setCidrOptions([]);
    }
  };

  const handleGoClick = () => {
    if (!subnet || !selectedCidr) return;

    const cidr = parseInt(selectedCidr, 10);
    const blockSize = 2 ** (32 - cidr);
    const usableAddresses =
      cidr === 31 || cidr === 32 ? blockSize : blockSize - 2;
    const startIp = ipToInt(subnet);
    const endIp = startIp + blockSize - 1;

    setSubnetInfo([
      {
        subnet: `${subnet}/${cidr}`,
        netmask: intToIp((0xffffffff << (32 - cidr)) >>> 0),
        range: `${intToIp(startIp)} - ${intToIp(endIp)}`,
        usable: `${intToIp(startIp + 1)} - ${intToIp(endIp - 1)}`,
        hosts: usableAddresses,
      },
    ]);
  };

  return (
    <>
      <div className="flex p-4 items-center justify-center gap-4">
        <Workflow size="30" />
        <h1>Visually Split and Merge Subnets</h1>
      </div>
      <div className="grid grid-cols-1 gap-8 p-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Input
            placeholder="Enter subnet address here"
            className="w-full md:w-[300px]"
            value={subnet}
            onChange={(e) => setSubnet(e.target.value)}
            onBlur={handleSubnetBlur}
          />
          <Select onValueChange={setSelectedCidr}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="CIDR Prefix" />
            </SelectTrigger>
            <SelectContent>
              {cidrOptions.map(({ cidr, info }) => (
                <SelectItem key={cidr} value={cidr.toString()}>
                  {info}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGoClick}>Go</Button>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <Switch
            id="subnet-toggle"
            checked={showSubnet}
            onCheckedChange={setShowSubnet}
          />
          <Label htmlFor="subnet-toggle">CIDR</Label>
          <Switch
            id="netmask-toggle"
            checked={showNetmask}
            onCheckedChange={setShowNetmask}
          />
          <Label htmlFor="netmask-toggle">Netmask</Label>
          <Switch
            id="range-toggle"
            checked={showRange}
            onCheckedChange={setShowRange}
          />
          <Label htmlFor="range-toggle">Address Range</Label>
          <Switch
            id="useable-toggle"
            checked={showUseable}
            onCheckedChange={setShowUseable}
          />
          <Label htmlFor="useable-toggle">Useable IPs</Label>
          <Switch
            id="hosts-toggle"
            checked={showHosts}
            onCheckedChange={setShowHosts}
          />
          <Label htmlFor="hosts-toggle">Hosts</Label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            {subnetInfo.map((info, index) => (
              <Card className="flex flex-col justify-between w-[260px]">
                <CardHeader>
                  <CardTitle>{info.subnet}</CardTitle>
                  <CardDescription>{info.netmask}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <LandPlot /> {info.range}
                  </p>
                </CardContent>
                <CardContent>
                  <p>
                    <MonitorCheck /> {info.usable}
                  </p>
                </CardContent>
                <CardContent>
                  <p>
                    <LaptopMinimal /> {info.hosts}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="default"
                          type="icon"
                          onClick={() => handleSplitClick(index)}
                        >
                          <Merge />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Merge</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="default"
                          type="icon"
                          onClick={() => handleSplitClick(index)}
                        >
                          <Split />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Split</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex flex-row gap-4">
          <Card className="flex flex-col justify-between w-[260px]">
            <CardHeader>
              <CardTitle>192.168.0.0/24</CardTitle>
              <CardDescription>255.255.255.0</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <LandPlot /> 192.168.0.0 - 192.168.0.255
              </p>
            </CardContent>
            <CardContent>
              <p>
                <MonitorCheck /> 192.168.0.1 - 192.168.0.254
              </p>
            </CardContent>
            <CardContent>
              <p>
                <LaptopMinimal /> 254
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="default"
                      type="icon"
                      onClick={() => handleSplitClick(index)}
                    >
                      <Merge />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Merge</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="default"
                      type="icon"
                      onClick={() => handleSplitClick(index)}
                    >
                      <Split />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Split</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default SubnetCalculator;
