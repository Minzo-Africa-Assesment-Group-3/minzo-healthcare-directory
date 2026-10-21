import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
    useSearchParams: () => ({ get: () => null }),
}));

jest.mock('@/store/auth-store', () => ({
    useAuthStore: (selector: (state: { setUser: jest.Mock }) => unknown) =>
        selector({ setUser: jest.fn() }),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        mockPush.mockClear();
        mockRefresh.mockClear();
        global.fetch = jest.fn();
    });

    it('shows validation errors when submitted empty', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        await user.click(screen.getByRole('button', { name: /log in/i }));

        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('submits credentials and redirects on success', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: { id: '1', email: 'admin', fullName: 'Admin User', roles: ['ADMIN'] } }),
        });

        const user = userEvent.setup();
        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
        await user.type(screen.getByLabelText('Password'), 'password');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/otp'));
        expect(global.fetch).toHaveBeenCalledWith(
            '/api/v1/auth/login',
            expect.objectContaining({ method: 'POST' }),
        );
    });

    it('shows a server error message on failed login', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Invalid email or password' }),
        });

        const user = userEvent.setup();
        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
        await user.type(screen.getByLabelText('Password'), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
    });
});