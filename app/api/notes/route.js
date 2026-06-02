import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabaseServer';
import { requireAdmin, errorResponse } from '../../../lib/api';

export async function GET() {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ note: data || { id: 1, content: '' } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from('notes')
      .upsert({
        id: 1,
        content: body.content || '',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ note: data });
  } catch (error) {
    return errorResponse(error);
  }
}
