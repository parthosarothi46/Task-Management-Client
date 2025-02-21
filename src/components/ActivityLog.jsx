import { format } from "date-fns";

const ActivityLog = ({ log }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Activity Log
      </h2>
      <div className="h-[300px] overflow-y-auto">
        <div className="space-y-4">
          {log.map((entry, index) => (
            <div
              key={index}
              className="flex flex-col space-y-1 border-b last:border-0 pb-2 dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {entry.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(entry.timestamp), "MMM dd, yyyy HH:mm:ss")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
