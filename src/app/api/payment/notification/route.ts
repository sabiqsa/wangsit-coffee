import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    let newStatus: string | null = null;

    if (transaction_status === 'capture' && fraud_status === 'accept') {
      newStatus = 'paid';
    } else if (transaction_status === 'settlement') {
      newStatus = 'paid';
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      newStatus = 'cancelled';
    } else if (transaction_status === 'pending') {
      newStatus = 'pending';
    }

    if (newStatus) {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, midtrans_transaction_id: body.transaction_id })
        .eq('id', order_id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
