'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const variantSchema = z
  .object({ size: z.string().optional(), strength: z.string().optional(), price: z.number().optional() })
  .optional();

const shippingAddressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().min(5).max(5),
  country: z.string(),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().positive(),
        variant: variantSchema,
      })
    )
    .min(1),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['midtrans', 'qris']),
});

export async function createOrder(input: z.infer<typeof createOrderSchema>) {
  const { items, shippingAddress, paymentMethod } = createOrderSchema.parse(input);
  const supabase = await createClient();

  // Price is recomputed server-side inside create_order() — the client-submitted
  // items only carry product_id/quantity/variant, never a trusted price/total.
  const { data, error } = await supabase.rpc('create_order', {
    p_items: items,
    p_shipping_address: shippingAddress,
    p_payment_method: paymentMethod,
  });

  if (error) throw new Error(error.message);
  return data as { id: string; total_price: number };
}

export async function createPaymentToken(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();
  if (orderError || !order) throw new Error('Order not found');

  const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const authHeader = Buffer.from(`${serverKey}:`).toString('base64');

  const payload = {
    transaction_details: {
      order_id: order.id,
      gross_amount: Number(order.total_price),
    },
    customer_details: {
      first_name: profile?.name ?? 'Customer',
      email: user.email ?? '',
    },
    item_details: order.order_items.map((item) => ({
      id: item.product_id ?? item.id,
      price: Number(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    })),
    enabled_payments: ['credit_card', 'bca_va', 'bni_va', 'bri_va', 'gopay', 'shopeepay', 'qris'],
  };

  const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${authHeader}` },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error_messages?.join(', ') ?? 'Midtrans error');

  return { token: data.token as string, redirectUrl: data.redirect_url as string };
}
