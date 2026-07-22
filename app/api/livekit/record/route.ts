import { NextRequest, NextResponse } from 'next/server';
import { EgressClient, EncodedFileOutput, EncodedFileType } from 'livekit-server-sdk';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomName, action, egressId } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: 'Missing roomName' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        { error: 'LiveKit credentials are not configured' },
        { status: 500 }
      );
    }

    const egressClient = new EgressClient(wsUrl, apiKey, apiSecret);

    if (action === 'start') {
      // Start recording
      const fileOutput = new EncodedFileOutput({
        fileType: EncodedFileType.MP4,
        filepath: `recordings/${roomName}-${Date.now()}.mp4`,
      });

      const options = {
        layout: 'grid',
      };

      const info = await egressClient.startRoomCompositeEgress(
        roomName,
        {
          file: fileOutput
        },
        options
      );

      return NextResponse.json({ success: true, egressId: info.egressId });
    } else if (action === 'stop') {
      // Stop recording
      if (!egressId) {
        return NextResponse.json({ error: 'Missing egressId' }, { status: 400 });
      }

      const info = await egressClient.stopEgress(egressId);
      return NextResponse.json({ success: true, info });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error with LiveKit Egress:', error);
    
    // Check if it's the specific output error related to missing S3 credentials in LiveKit Cloud
    let errorMessage = error.message || 'Failed to process egress request';
    if (errorMessage.includes('request has missing or invalid field: output') || errorMessage.includes('invalid_argument')) {
      errorMessage = 'Error de Configuración de Grabación. Si usas LiveKit Cloud, debes configurar un bucket de S3 o Google Cloud Storage en tu proyecto de LiveKit para poder grabar clases, ya que no permite almacenamiento local directo.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
