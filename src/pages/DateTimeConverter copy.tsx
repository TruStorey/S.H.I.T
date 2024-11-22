import React, { useState, useEffect } from "react";
import { CalendarClock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const DateTimeConverter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [milliseconds, setMilliseconds] = useState<number>(
    currentTime.getMilliseconds()
  );
  const [microseconds, setMicroseconds] = useState<number>(
    currentTime.getMilliseconds() * 1000
  );

  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMilliseconds(now.getMilliseconds());
      setMicroseconds(
        now.getMilliseconds() * 1000 + Math.floor(Math.random() * 1000)
      ); // Mock microsecond updates
    }, 1);

    return () => clearInterval(interval);
  }, []);

  const localeDateString = currentTime.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "long",
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
      time: (currentTime.getTime() + milliseconds).toString(),
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

  return (
    <>
      <div className="p-4">
          <CalendarClock size={24} />
          <h1>Convert Dates and Times</h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 p-4">
          {/* Column 1: Table */}
          <div>
            <Table>
              <TableCaption>
                A list of different time formats for the current time.
              </TableCaption>
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
                    <TableCell>
                      {format.format}
                    </TableCell>
                    <TableCell  className="font-medium">{format.time}</TableCell>
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
          </div>

          {/* Column 2: Placeholder for Next Steps */}
          <div>
            <h2 className="text-lg font-medium">Next Steps</h2>
            <p>Add further features or instructions here.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateTimeConverter;
