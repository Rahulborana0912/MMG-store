import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: 'connected',
        latencyMs: dbLatencyMs,
      },
      environment: process.env.NODE_ENV || 'production',
      company: 'Mahadev Marble and Granite Pvt. Ltd.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
        },
      },
      { status: 503 }
    );
  }
}
