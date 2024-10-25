import { format } from "date-fns";

export default function Timestamp({ timestamp }: { timestamp: Date | string }) {
  return (
    <p className="italic text-gray-500">
      {format(timestamp, "E do MMM y, kk:mm:ss")}
    </p>
  );
}
