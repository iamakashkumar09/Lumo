'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, SignupFormValues } from '@/lib/schemas';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await api.auth.signup(data);
      router.push('/'); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 rounded-[32px] p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">Create an account</h2>
      <p className="text-center text-neutral-500 mb-8 text-sm">Join the Luma community today</p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input 
          label="Username" 
          type="text" 
          placeholder="@username" 
          {...register('username')} 
          error={errors.username?.message} 
        />
        <Input 
          label="Email" 
          type="email" 
          placeholder="hello@example.com" 
          {...register('email')} 
          error={errors.email?.message} 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          {...register('password')} 
          error={errors.password?.message} 
        />
        <Input 
          label="Confirm Password" 
          type="password" 
          placeholder="••••••••" 
          {...register('confirmPassword')} 
          error={errors.confirmPassword?.message} 
        />
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-purple-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}