'use client';
import { useState, useEffect } from "react";
import { fetchContainerLogs } from "../connect-REST/logs-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";

interface Log {
  containerName: string;
}

export default function LogsUI({ containerName }: Log) {
  const [logs, setLogs] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await fetchContainerLogs(containerName);
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to fetch logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [containerName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-96 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {logs ? (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">Logs for {containerName}</h2>
          </div>
          <div className="flex-1 overflow-hidden p-2">
            <ScrollArea className="h-full w-full rounded-md border border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <pre className="whitespace-pre-wrap break-words text-sm font-mono">{logs}</pre>
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No logs available for {containerName}</p>
        </div>
      )}
    </div>
  );
}