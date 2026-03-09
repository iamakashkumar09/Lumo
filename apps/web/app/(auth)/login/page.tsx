'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '@/lib/schemas';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  // 1. Add state to hold server errors
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null); // Clear any old errors when submitting again
    try {
      await api.auth.login(data);
      router.push('/'); 
    } catch (error: any) {
      // 2. Catch the error and display it on the UI
      console.error("Login failed:", error);
      setServerError(error.message || 'Invalid username or password');
    }
  };

  return (
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 rounded-[32px] p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">Welcome back</h2>
      <p className="text-center text-neutral-500 mb-8 text-sm">Enter your credentials to access your account</p>
      
      {/* 3. Show the red error box if login fails */}
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input 
          label="Username" 
          type="text"                // FIXED: 'username' is not a valid HTML type
          placeholder="@yourusername" // FIXED: placeholder
          {...register('username')} 
          error={errors.username?.message} 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          {...register('password')} 
          error={errors.password?.message} 
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-neutral-500">
        Don't have an account?{' '}
        <Link href="/signup" className="font-bold text-purple-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}