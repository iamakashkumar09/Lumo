'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema, SignupFormValues } from '@/lib/schemas';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react'; // Added an icon for the error message!

export default function SignupPage() {
  const router = useRouter();
  
  // 1. Destructure setError from useForm
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  });

 const onSubmit = async (values: SignupFormValues) => {
  try {
    const { confirmPassword, ...dataToSubmit } = values;

    await api.auth.signup(dataToSubmit);
    
    router.push('/login'); 
  } catch (error: any) {
    // 2. Catch the error from NestJS and set it as a global form error
    setError('root', {
        type: 'server',
        message: error.message || 'Something went wrong. Please try again.',
    });
  }
};

  return (
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 rounded-[32px] p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">Create an account</h2>
      <p className="text-center text-neutral-500 mb-8 text-sm">Join the Lumo community today</p>
      
      {/* 3. Display the backend error message if it exists */}
      {errors.root && (
        <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium text-red-600 dark:text-red-400 leading-snug">
                {errors.root.message}
            </p>
        </div>
      )}

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
          className="w-full mt-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
          ) : 'Sign Up'}
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