import { NextResponse } from 'next/server';
import {
  getAdminSettings,
  getUserSettings,
  updateAdminSettings,
  updateUserSettings,
} from '@/lib/store';
import { getSession } from '@/lib/auth';
import { backendFetch, parseBackendResponse } from '@/lib/backend';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (session.token) {
      const backendResponse = await backendFetch('/api/Settings', { method: 'GET' });
      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        return NextResponse.json(backendData);
      }
    }
  } catch (error) {
    console.error('Error fetching settings from backend:', error);
  }

  if (session.role === 'admin') {
    return NextResponse.json(getAdminSettings());
  }
  return NextResponse.json(getUserSettings());
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    if (session.token) {
      const backendResponse = await backendFetch('/api/Settings', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        return NextResponse.json(backendData);
      }
    }
  } catch (error) {
    console.error('Error updating settings on backend:', error);
  }

  if (session.role === 'admin') {
    return NextResponse.json(updateAdminSettings(body));
  }
  return NextResponse.json(updateUserSettings(body));
}

