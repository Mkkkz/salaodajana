import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { requireAdmin, errorResponse } from '../../../../lib/api';

export async function PUT(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const supabase = getSupabaseServer();

    const payload = {
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time || '09:00',
      client_name: body.client_name || 'Cliente',
      phone: body.phone || '',
      service: body.service || 'Serviço',
      status: body.status || 'Agendado',
      notes: body.notes || ''
    };

    const { data, error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ appointment: data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
