import React from "react";
import { CalendarClock } from "lucide-react";

const DateTimeConverter: React.FC = () => {
  return (
    <>
      <div className="md:flex flex-1 p-4 gap-2 items-center justify-center">
        {/* Header */}
        <CalendarClock size="30"/>
        <h1>Convert dates and times into different formats or time zones.</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        
      </div>
    </>
  );
};

export default DateTimeConverter;
