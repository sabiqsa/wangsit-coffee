'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const updateOrderStatusSchema = z
  .object({
    orderId: z.string().uuid(),
    status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  })
  .strict();

export async function updateOrderStatus(input: z.infer<typeof updateOrderStatusSchema>) {
  const { orderId, status } = updateOrderStatusSchema.parse(input);
  const supabase = await createClient();
  // RLS + column-level GRANT restrict this to admins and to the `status` column only.
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
}
