import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Report from '@/models/Report';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Report ID is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const report = await Report.findById(id);

        if (!report) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        // Convert to plain object and remove mongoose internals
        const reportData = JSON.parse(JSON.stringify(report));

        return NextResponse.json({
            success: true,
            data: reportData,
        });
    } catch (error: any) {
        console.error('Error fetching report:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch report',
            },
            { status: 500 }
        );
    }
}

