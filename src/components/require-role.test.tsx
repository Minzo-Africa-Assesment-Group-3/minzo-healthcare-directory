import { render, screen, waitFor } from '@testing-library/react';
import { RequireRole } from './require-role';
import { UserRole } from '@/lib/types';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ replace: mockReplace }),
}));

const mockNotifyError = jest.fn();
jest.mock('@/lib/toast', () => ({
    notify: { error: (msg: string) => mockNotifyError(msg) },
}));

let mockAuthState: { hydrated: boolean; hasRole: (r: UserRole) => boolean };
jest.mock('@/hooks/use-auth', () => ({
    useAuth: () => mockAuthState,
}));

describe('RequireRole', () => {
    beforeEach(() => {
        mockReplace.mockClear();
        mockNotifyError.mockClear();
    });

    it('shows a loading state before auth has hydrated', () => {
        mockAuthState = { hydrated: false, hasRole: () => false };

        render(
            <RequireRole roles={[UserRole.ADMIN]}>
                <div>Protected content</div>
            </RequireRole>,
        );

        expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    });

    it('renders children when the user has an allowed role', () => {
        mockAuthState = { hydrated: true, hasRole: (r) => r === UserRole.ADMIN };

        render(
            <RequireRole roles={[UserRole.ADMIN]}>
                <div>Protected content</div>
            </RequireRole>,
        );

        expect(screen.getByText('Protected content')).toBeInTheDocument();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects and shows an error toast when the user lacks any allowed role', async () => {
        mockAuthState = { hydrated: true, hasRole: () => false };

        render(
            <RequireRole roles={[UserRole.ADMIN]}>
                <div>Protected content</div>
            </RequireRole>,
        );

        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/dashboard'));
        expect(mockNotifyError).toHaveBeenCalled();
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    });
});