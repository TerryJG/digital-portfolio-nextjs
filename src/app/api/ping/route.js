import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Pong!");

  return NextResponse.json({
    message: "Pong!",
    timestamp: new Date().toISOString(),
  });
}