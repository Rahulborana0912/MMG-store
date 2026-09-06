import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, entityId, source, path, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'eventType required' }, { status: 400 });
    }

    // Only record genuine high-value business conversion events to keep database lean
    const allowedEvents = [
      'WHATSAPP_CLICK',
      'CALL_CLICK',
      'PRODUCT_VIEW',
      'FINDER_COMPLETE',
      'QUOTE_REQUEST',
      'REQUIREMENT_CREATE',
    ];

    if (!allowedEvents.includes(eventType)) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        entityId: entityId ? String(entityId).slice(0, 100) : null,
        source: source ? String(source).slice(0, 50) : null,
        path: path ? String(path).slice(0, 100) : null,
        metadata: metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : null,
      },
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error: any) {
    // Non-blocking for analytics
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

export async function GET() {
  try {
    // Requires ADMIN or STAFF
    await requireAuth(['ADMIN', 'STAFF']);

    // Aggregate key metrics
    const totalEnquiries = await prisma.enquiry.count();
    const totalQuotations = await prisma.quotation.count();
    const totalRequirements = await prisma.requirement.count();
    const totalSlabs = await prisma.slabInventory.count();
    const availableSlabs = await prisma.slabInventory.count({ where: { status: 'AVAILABLE' } });
    const reservedSlabs = await prisma.slabInventory.count({ where: { status: 'RESERVED' } });

    // Count events in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const events = await prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { eventType: true, source: true },
    });

    const eventCounts: Record<string, number> = {
      WHATSAPP_CLICK: 0,
      CALL_CLICK: 0,
      PRODUCT_VIEW: 0,
      FINDER_COMPLETE: 0,
      QUOTE_REQUEST: 0,
    };

    const sourceCounts: Record<string, number> = {};

    for (const ev of events) {
      if (eventCounts[ev.eventType] !== undefined) {
        eventCounts[ev.eventType]++;
      }
      if (ev.source) {
        sourceCounts[ev.source] = (sourceCounts[ev.source] || 0) + 1;
      }
    }

    return NextResponse.json({
      summary: {
        totalEnquiries,
        totalQuotations,
        totalRequirements,
        totalSlabs,
        availableSlabs,
        reservedSlabs,
      },
      events: eventCounts,
      sources: sourceCounts,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
