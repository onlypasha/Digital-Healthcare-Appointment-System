import { NextResponse } from 'next/server';
import {
  getAdminSettings,
  getUserSettings,
  updateAdminSettings,
  updateUserSettings,
} from '@/lib/store';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (session.role === 'admin') {
    return NextResponse.json(updateAdminSettings(body));
  }
  return NextResponse.json(updateUserSettings(body));
}
