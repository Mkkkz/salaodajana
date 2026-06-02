import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabaseServer';
import { requireAdmin, errorResponse, moneyNumber } from '../../../lib/api';

export async function GET() {
  const blocked = requireAdmin();
  if (blocked) return blocked;

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ sales: data || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
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
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ sale: data });
  } catch (error) {
    return errorResponse(error);
  }
}
