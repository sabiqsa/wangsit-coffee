'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const variantSchema = z.object({
  size: z.string().optional(),
  strength: z.string().optional(),
  price: z.number().optional(),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  category_id: z.string().uuid(),
  images: z.array(z.string()).default([]),
  variants: z.array(variantSchema).default([]),
});

export async function createProduct(input: z.infer<typeof productSchema>) {
  const data = productSchema.parse(input);
  const supabase = await createClient();
  const { error } = await supabase.from('products').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
}

export async function updateProduct(id: string, input: z.infer<typeof productSchema>) {
  const data = productSchema.parse(input);
  const supabase = await createClient();
  const { error } = await supabase.from('products').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
}
