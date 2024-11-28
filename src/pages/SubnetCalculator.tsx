import React, { useState } from "react";
import { Workflow, Split, Merge } from "lucide-react";
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
  parentCidr?: string;
};

const SubnetCalculator: React.FC = () => {
  const [subnet, setSubnet] = useState("");
  const [cidrOptions, setCidrOptions] = useState<
    { cidr: number; info: string }[]
  >([]);
  const [selectedCidr, setSelectedCidr] = useState<string>("");
  const [subnetInfo, setSubnetInfo] = useState<SubnetInfo[]>([]);
  const [hiddenSubnets, setHiddenSubnets] = useState<SubnetInfo[]>([]);
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
    const usableAddresses = cidr === 31 || cidr === 32 ? blockSize : blockSize - 2;
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

  const handleSplitClick = (index: number) => {
    const subnetToSplit = subnetInfo[index];
    const cidr = parseInt(subnetToSplit.subnet.split("/")[1]);
    if (cidr >= 31) return;

    const blockSize = 2 ** (32 - cidr);
    const newCidr = cidr + 1;
    const startIp = ipToInt(subnetToSplit.subnet.split("/")[0]);
    const midIp = startIp + blockSize / 2;

    const newSubnets = [
      {
        subnet: `${intToIp(startIp)}/${newCidr}`,
        netmask: intToIp((0xffffffff << (32 - newCidr)) >>> 0),
        range: `${intToIp(startIp)} - ${intToIp(startIp + blockSize / 2 - 1)}`,
        usable: `${intToIp(startIp + 1)} - ${intToIp(startIp + blockSize / 2 - 2)}`,
        hosts: blockSize / 2 - 2,
        parentCidr: subnetToSplit.subnet,
      },
      {
        subnet: `${intToIp(midIp)}/${newCidr}`,
        netmask: intToIp((0xffffffff << (32 - newCidr)) >>> 0),
        range: `${intToIp(midIp)} - ${intToIp(midIp + blockSize / 2 - 1)}`,
        usable: `${intToIp(midIp + 1)} - ${intToIp(midIp + blockSize / 2 - 2)}`,
        hosts: blockSize / 2 - 2,
        parentCidr: subnetToSplit.subnet,
      },
    ];

    const updatedSubnets = [
      ...subnetInfo.slice(0, index),
      ...newSubnets,
      ...subnetInfo.slice(index + 1),
    ];

    setSubnetInfo(updatedSubnets);
    setHiddenSubnets((prev) => [...prev, subnetToSplit]);
  };

  const handleMergeClick = (index: number) => {
    if (index < 0 || index >= subnetInfo.length) return;

    const targetSubnet = subnetInfo[index];
    const parentCidr = targetSubnet.parentCidr;

    if (!parentCidr) {
      console.warn("No parent CIDR found for the selected subnet.");
      return;
    }

    const mergedSubnet = hiddenSubnets.find(
      (info) => info.subnet === parentCidr
    );

    if (!mergedSubnet) {
      console.error(`Original parent subnet not found for parentCidr: ${parentCidr}`);
      return;
    }

    const subnetsToRemove = subnetInfo.filter(
      (info) => info.parentCidr === parentCidr || info.subnet === parentCidr
    );

    const updatedSubnets = subnetInfo.filter(
      (info) => !subnetsToRemove.includes(info)
    );

    setSubnetInfo([...updatedSubnets, mergedSubnet]);

    setHiddenSubnets((prev) =>
      prev.filter((info) => info.subnet !== parentCidr)
    );
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-4 p-4 lg:w-2/3">
          <div className="flex md:col-span-2 p-4 gap-2 items-center justify-center">
            <Workflow size="30" />
            <h1>Visually Split and Merge Subnets</h1>
          </div>

          <div className="flex md:col-span-2 p-4 gap-4 justify-center">
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

          <div className="flex md:col-span-2 p-4 gap-4 justify-center items-center">
            <Switch
              id="subnet-toggle"
              checked={showSubnet}
              onCheckedChange={setShowSubnet}
            />
            <Label htmlFor="subnet-toggle">Subnet</Label>
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
            <Label htmlFor="useable-toggle">Usable IPs</Label>
            <Switch
              id="hosts-toggle"
              checked={showHosts}
              onCheckedChange={setShowHosts}
            />
            <Label htmlFor="hosts-toggle">Hosts</Label>
          </div>

          <div className="flex md:col-span-2 gap-4 p-4">
            <table className="w-full text-start justify-center">
              <thead>
                <tr>
                  {showSubnet && (
                    <th className="text-start border-b border-secondary p-2">
                      Subnet
                    </th>
                  )}
                  {showNetmask && (
                    <th className="text-start border-b border-secondary p-2">
                      Netmask
                    </th>
                  )}
                  {showRange && (
                    <th className="text-start border-b border-secondary p-2">
                      Address Range
                    </th>
                  )}
                  {showUseable && (
                    <th className="text-start border-b border-secondary p-2">
                      Usable IPs
                    </th>
                  )}
                  {showHosts && (
                    <th className="text-start border-b border-secondary p-2">
                      Hosts
                    </th>
                  )}
                  <th className="text-start border-b border-secondary p-2">
                    Split
                  </th>
                  <th className="text-start border-b border-secondary p-2">
                    Merge
                  </th>
                </tr>
              </thead>
              <tbody>
                {subnetInfo.map((info, index) => {
                  const isMergeButtonVisible =
                    index > 0 &&
                    info.parentCidr === subnetInfo[index - 1].parentCidr;

                  const parentCidrPrefix = info.parentCidr
                    ? `/${info.parentCidr.split("/")[1]}`
                    : "";

                  return (
                    <tr key={index} className="hover:bg-secondary">
                      {showSubnet && <td className="pt-2">{info.subnet}</td>}
                      {showNetmask && <td className="pt-2">{info.netmask}</td>}
                      {showRange && <td className="pt-2">{info.range}</td>}
                      {showUseable && <td className="pt-2">{info.usable}</td>}
                      {showHosts && <td className="pt-2">{info.hosts}</td>}
                      <td className="pt-2">
                        <Button
                          variant="default"
                          onClick={() => handleSplitClick(index)}
                        >
                          <Split />
                        </Button>
                      </td>
                      {!isMergeButtonVisible && info.parentCidr && (
                        <td
                          rowSpan={2}
                          className="pt-2 text-center align-middle"
                          style={{ verticalAlign: "middle" }}
                        >
                          <Button
                            variant="default"
                            onClick={() => handleMergeClick(index + 1)}
                          >
                            <Merge /> {parentCidrPrefix}
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubnetCalculator;
