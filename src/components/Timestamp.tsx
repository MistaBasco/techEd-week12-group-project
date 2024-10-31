import { format } from "date-fns";

export default function Timestamp({ timestamp }: { timestamp: Date | string }) {
  return (
    <p className="text-xs text-gray-400 italic">
      {format(timestamp, "E do MMM y, kk:mm:ss")}
    </p>
  );
}
