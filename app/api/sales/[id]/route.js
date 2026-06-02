import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { requireAdmin, errorResponse, moneyNumber } from '../../../../lib/api';

export async function PUT(request, { params }) {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const supabase = getSupabaseServer();

    const payload = {
      sale_date: body.sale_date,
      client_name: body.client_name || 'Cliente',
      service: body.service || 'Serviço',
      value: moneyNumber(body.value),
      payment_method: body.payment_method || 'Pix',
      status: body.status || 'Pago',
      notes: body.notes || ''
    };

    const { data, error } = await supabase
      .from('sales')
      .update(payload)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ sale: data });
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
      .from('sales')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
