import React from 'react'
import Navbar from './components/navbar'
import UserProfileSidebar from './components/user-profile-sidebar'

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            <Navbar />

            <main className="mx-auto max-w-336 px-4 pb-20 pt-8">
                <h1 className="font-(family-name:--font-roboto-slab) text-4xl font-semibold text-gray-950">
                    My profile
                </h1>
                <p className="mt-1 text-sm text-gray-900">
                    Manage your details, the businesses you follow and the reviews you’ve written.
                </p>

                <div className="mt-8 grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <UserProfileSidebar />
                    <div className="flex-1">{children}</div>
                </div>
            </main>
        </div>
    )
}

export default UserDashboardLayout