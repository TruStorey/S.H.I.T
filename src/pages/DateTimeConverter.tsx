import React from "react";
import { CalendarClock } from "lucide-react";

const DateTimeConverter: React.FC = () => {
  return (
    <>
      <div className="p-4">
        {/* Header */}
        <CalendarClock />
        <h1>Convert dates and times into different formats or time zones.</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 p-4">
        
      </div>
    </>
  );
};

export default DateTimeConverter;
