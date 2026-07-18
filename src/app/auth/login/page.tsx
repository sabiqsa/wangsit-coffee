'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container, Card, CardContent, Typography, TextField, Button,
  Box, Alert, Link, CircularProgress, Divider,
} from '@mui/material';
import { Coffee } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError('Email atau password salah.');
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <Container maxWidth="xs" className="py-16">
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Coffee sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Masuk ke Akun
            </Typography>
            <Typography variant="body2" color="text.secondary">WangsitCoffee</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
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
              sx={{ mb: 3 }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={18} color="inherit" />}
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

 <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Belum punya akun?{' '}
            <Link href="/auth/register" sx={{ fontWeight: 600 }}>Daftar sekarang</Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
