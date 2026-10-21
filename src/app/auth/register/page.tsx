'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container, Card, CardContent, Typography, TextField, Button,
  Box, Alert, Link, CircularProgress, Divider,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });

    if (signUpError) {
      setError(
        signUpError.message === 'User already registered'
          ? 'Email sudah terdaftar'
          : 'Registrasi gagal, coba lagi.'
      );
      setLoading(false);
      return;
    }

    router.push('/auth/login?registered=1');
  };

  return (
    <Container maxWidth="xs" className="py-12 md:py-20">
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1">
              Buat akun baru
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Simpan alamat dan lihat riwayat pesanan di satu tempat.</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('name')}
              label="Nama Lengkap"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password')}
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              {...register('confirmPassword')}
              label="Konfirmasi Password"
              type="password"
              fullWidth
              sx={{ mb: 3 }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={18} color="inherit" />}
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

 <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Sudah punya akun?{' '}
            <Link href="/auth/login" sx={{ fontWeight: 600 }}>Masuk</Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
