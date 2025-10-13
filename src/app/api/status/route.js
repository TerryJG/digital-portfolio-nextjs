import { NextResponse } from 'next/server';

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
};

export async function GET() {
  const uptime = process.uptime();

  const healthStatus = {
    status: "ok",
    uptime: {
      seconds: Math.floor(uptime),
      formatted: formatTime(uptime),
    },
    message: "API server is operational",
    timestamp: new Date().toISOString(),
  };

  console.log("App's server is operational");
  return NextResponse.json(healthStatus);
}