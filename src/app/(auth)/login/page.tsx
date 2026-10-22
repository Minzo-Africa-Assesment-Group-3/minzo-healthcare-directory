import { Suspense } from 'react';
import LoginForm from './login-form';
import Loading from '@/components/Loading';

export default function LoginPage() {
    return (
        <Suspense fallback={<Loading message="Loading login page" />}>
            <LoginForm />
        </Suspense>
    )
}
