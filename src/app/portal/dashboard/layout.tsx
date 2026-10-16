import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/lib/member-session';
import { MemberAuthHydrator } from '@/components/member-auth-hydrator';
import { PortalNav } from '@/components/portal-nav';

export default async function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
    const member = await getCurrentMember();
    if (!member) redirect('/portal/login');

    return (
        <div className="min-h-screen bg-gray-50">
            <MemberAuthHydrator member={member} />
            <PortalNav member={member} />
            <main className="mx-auto max-w-4xl p-6">{children}</main>
        </div>
    );
}