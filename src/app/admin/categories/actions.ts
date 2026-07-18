'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().min(1),
});

export async function createCategory(input: z.infer<typeof categorySchema>) {
  const data = categorySchema.parse(input);
  const supabase = await createClient();
  const { error } = await supabase.from('categories').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, input: z.infer<typeof categorySchema>) {
  const data = categorySchema.parse(input);
  const supabase = await createClient();
  const { error } = await supabase.from('categories').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
}
