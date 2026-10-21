import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { AuthHydrator } from '@/components/auth-hydrator';
import { Sidebar } from '@/components/sidebar';
import { SidebarMobile } from '@/components/sidebar-mobile';
import { TopbarMobile } from '@/components/top-bar-mobile';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    // if (!user) {
    //     redirect('/login');
    // }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
            {/* <AuthHydrator user={user} /> */}
            <TopbarMobile />
            {/* <div className="hidden md:block">
                <Sidebar />
            </div> */}
            <div className='block md:hidden'>
                <SidebarMobile />
            </div>
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
    );
}