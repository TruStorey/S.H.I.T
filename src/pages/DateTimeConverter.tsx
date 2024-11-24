import React, { useState, useEffect } from "react";
import { CalendarClock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import SunCalc from "suncalc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";

const DateTimeConverter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [milliseconds, setMilliseconds] = useState<number>(
    currentTime.getMilliseconds()
  );
  const [microseconds, setMicroseconds] = useState<number>(
    currentTime.getMilliseconds() * 1000
  );
  const [sunData, setSunData] = useState<{ hour: string; altitude: number }[]>(
    []
  );
  const [latitude, setLatitude] = useState<number>(51.5074); // Default to London
  const [longitude, setLongitude] = useState<number>(-0.1278); // Default to London

  const { toast } = useToast();

  useEffect(() => {
    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // Update current time dynamically
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMilliseconds(now.getMilliseconds());
      setMicroseconds(
        now.getMilliseconds() * 1000 + Math.floor(Math.random() * 1000)
      );
    }, 1);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate sun position data for the chart
    const calculateSunData = () => {
      const data: { hour: string; altitude: number }[] = [];
      const date = new Date();

      for (let hour = 0; hour < 24; hour++) {
        date.setHours(hour, 0, 0, 0);
        const position = SunCalc.getPosition(date, latitude, longitude);
        data.push({
          hour: `${hour}:00`,
          altitude: Math.max(0, position.altitude * (180 / Math.PI)), // Convert radians to degrees
        });
      }
      setSunData(data);
    };

    calculateSunData();
  }, [latitude, longitude]);

  const localeDateString = currentTime.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const utcOffset = currentTime.getTimezoneOffset();
  const utcOffsetHours = Math.floor(Math.abs(utcOffset) / 60);
  const utcOffsetMinutes = Math.abs(utcOffset) % 60;
  const formattedOffset = `${utcOffset <= 0 ? "+" : "-"}${utcOffsetHours
    .toString()
    .padStart(2, "0")}:${utcOffsetMinutes.toString().padStart(2, "0")}`;

  const iso9075 = currentTime.toISOString().replace("T", " ").split(".")[0]; // ISO 9075 format: YYYY-MM-DD HH:MM:SS

  const timeFormats = [
    {
      format: "Locale Time",
      time: `${localeDateString} (UTC ${formattedOffset})`,
    },
    { format: "ISO 8601", time: currentTime.toISOString() },
    { format: "ISO 9075", time: iso9075 },
    {
      format: "Timestamp",
      time: Math.floor(currentTime.getTime() / 1000).toString(),
    },
    {
      format: "Timestamp (ms)",
      time: currentTime.getTime().toString(),
    },
    {
      format: "Timestamp (μs)",
      time: (currentTime.getTime() * 1000 + microseconds).toString(),
    },
  ];

  const handleCopy = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `Copied "${format}".`,
    });
  };

  const chartConfig: ChartConfig = {
    altitude: {
      label: "Sun Position",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <>
    <div className="flex p-4 gap-2 items-center justify-center">
      <CalendarClock size="30"/>
      <h1>Convert Dates and Times</h1>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 p-4">
        {/* Column 1: Table */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Format</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Copy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeFormats.map((format, index) => (
                <TableRow key={index}>
                  <TableCell>{format.format}</TableCell>
                  <TableCell className="font-medium">{format.time}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(format.format, format.time)}
                    >
                      <Copy />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ChartContainer config={chartConfig} className="h-52 w-full p-4">
            <AreaChart
              data={sunData}
              margin={{ top: 20, right: 40, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                label={{
                  value: "Altitude (°)",
                  angle: -90,
                  position: "Left",
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey="altitude"
                fill="hsl(var(--chart-1))"
                stroke="hsl(var(--chart-1))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
          <h4 className="text-center">Sunset/Sunrise for today</h4>
        </div>

        {/* Column 2: Chart */}
        <div>Col2</div>
        <div>Col3</div>
      </div>
    
    </>
  );
};

export default DateTimeConverter;
