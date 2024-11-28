import React, { useState, useEffect } from "react";
import { CalendarClock, Copy, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import SunCalc from "suncalc";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DateTimeConverter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [milliseconds, setMilliseconds] = useState<number>(currentTime.getMilliseconds());
  const [microseconds, setMicroseconds] = useState<number>(currentTime.getMilliseconds() * 1000);
  const [sunData, setSunData] = useState<{ hour: string; altitude: number }[]>([]);
  const [latitude, setLatitude] = useState<number>(51.5074); // Default to London
  const [longitude, setLongitude] = useState<number>(-0.1278); // Default to London
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [customTime, setCustomTime] = useState<Date | null>(null);
  const [timestampInput, setTimestampInput] = useState<string>("");
  const [timestampMsInput, setTimestampMsInput] = useState<string>("");
  const [timestampUsInput, setTimestampUsInput] = useState<string>("");

  const chartConfig = {
    altitude: {
      label: "Sun Position",
      color: "hsl(var(--chart-1))",
    },
  };

  const calculateSunData = (baseDate: Date) => {
    const data: { hour: string; altitude: number }[] = [];
    const date = new Date(baseDate);

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
      if (!customTime) {
        const now = new Date();
        setCurrentTime(now);
        setMilliseconds(now.getMilliseconds());
        setMicroseconds(now.getMilliseconds() * 1000 + Math.floor(Math.random() * 1000));
        calculateSunData(now); // Keep the SunCalc chart updated with the live time
      }
    }, 1);

    return () => clearInterval(interval);
  }, [customTime]);

  const handleCopy = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `Copied "${format}".`,
    });
  };

  const handleReset = () => {
    setCustomTime(null);
    setTimestampInput("");
    setTimestampMsInput("");
    setTimestampUsInput("");
    setHour("00");
    setMinute("00");
    setDate(new Date());
    calculateSunData(new Date());
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(parseInt(hour));
      updatedDate.setMinutes(parseInt(minute));
      updatedDate.setSeconds(0, 0);
      setDate(selectedDate);
      setCustomTime(updatedDate);
      calculateSunData(updatedDate);
    }
  };

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour);
    setMinute(newMinute);
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setHours(parseInt(newHour));
      updatedDate.setMinutes(parseInt(newMinute));
      updatedDate.setSeconds(0, 0);
      setCustomTime(updatedDate);
      calculateSunData(updatedDate);
    }
  };

  const handleTimestampChange = (type: "seconds" | "milliseconds" | "microseconds", value: string) => {
    let timestamp: number;
    let convertedDate: Date | null = null;

    if (type === "seconds" && value.length >= 10) {
      timestamp = parseInt(value, 10) * 1000;
      convertedDate = new Date(timestamp);
    } else if (type === "milliseconds" && value.length >= 13) {
      timestamp = parseInt(value, 10);
      convertedDate = new Date(timestamp);
    } else if (type === "microseconds" && value.length >= 16) {
      timestamp = Math.floor(parseInt(value, 10) / 1000); // Convert μs to ms
      convertedDate = new Date(timestamp);
    }

    if (convertedDate) {
      setCustomTime(convertedDate);
      calculateSunData(convertedDate);
    }

    if (type === "seconds") setTimestampInput(value);
    if (type === "milliseconds") setTimestampMsInput(value);
    if (type === "microseconds") setTimestampUsInput(value);
  };

  const displayTime = customTime || currentTime;

  const localeDateString = displayTime.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const utcOffset = displayTime.getTimezoneOffset();
  const utcOffsetHours = Math.floor(Math.abs(utcOffset) / 60);
  const utcOffsetMinutes = Math.abs(utcOffset) % 60;
  const formattedOffset = `${utcOffset <= 0 ? "+" : "-"}${utcOffsetHours
    .toString()
    .padStart(2, "0")}:${utcOffsetMinutes.toString().padStart(2, "0")}`;

  const iso9075 = displayTime.toISOString().replace("T", " ").split(".")[0];

  const timeFormats = [
    {
      format: "Locale Time",
      time: `${localeDateString} (UTC ${formattedOffset})`,
    },
    { format: "ISO 8601", time: displayTime.toISOString() },
    { format: "ISO 9075", time: iso9075 },
    {
      format: "Timestamp",
      time: Math.floor(displayTime.getTime() / 1000).toString(),
    },
    {
      format: "Timestamp (ms)",
      time: displayTime.getTime().toString(),
    },
    {
      format: "Timestamp (μs)",
      time: (displayTime.getTime() * 1000 + microseconds).toString(),
    },
  ];

  return (
    <>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 lg:w-2/3">
          <div className="flex md:col-span-4 p-4 gap-2 items-center justify-center">
            <CalendarClock size="30" />
            <h1>Convert Dates and Times</h1>
          </div>
          <div className="flex flex-col gap-4 p-4 justify-start items-center">
            <h5>Pick a date/time</h5>
            <div className="flex gap-4 justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
            </div>
            <div className="flex gap-4 w-2/3">
              <Select
                onValueChange={(value) => handleTimeChange(value, minute)}
                defaultValue="00"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hour" value={hour} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => handleTimeChange(hour, value)}
                defaultValue="00"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minute" value={minute} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col md:col-span-2 gap-4 p-4">
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
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleReset}>
                <TimerReset />
                Reset
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 justify-start">
            <h5 className="text-start">Timestamps</h5>
            <div className="flex flex-col gap-4">
              <Input
                id="ts-sec"
                placeholder="Enter Timestamp (s)..."
                aria-label="Input field"
                value={timestampInput}
                onChange={(e) => handleTimestampChange("seconds", e.target.value)}
              />
              <Input
                id="ts-ms"
                placeholder="Enter Timestamp (ms)..."
                aria-label="Input field"
                value={timestampMsInput}
                onChange={(e) => handleTimestampChange("milliseconds", e.target.value)}
              />
              <Input
                id="ts-us"
                placeholder="Enter Timestamp (μs)..."
                aria-label="Input field"
                value={timestampUsInput}
                onChange={(e) => handleTimestampChange("microseconds", e.target.value)}
              />
            </div>
          </div>
          <div className="lg:col-span-4 gap-4 p-4 text-center">
            <h5>Local Sunrise / Sunset</h5>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DateTimeConverter;
