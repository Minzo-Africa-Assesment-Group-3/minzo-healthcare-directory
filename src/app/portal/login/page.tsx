import { Suspense } from 'react';
import PortalLoginForm from './portal-login-form';
import Loading from '@/components/Loading';

export default function LoginPage() {
    return (
        <Suspense fallback={<Loading message="Loading portal login page" />}>
            <PortalLoginForm />
        </Suspense>
    );
}
