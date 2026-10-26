export default function ProfileSkeleton() {
    const bar = 'rounded bg-gray-100';
    return (
        <div className="animate-pulse" aria-busy="true" aria-label="Loading business">
            <div className="h-36 rounded-2xl bg-gray-100 sm:h-48 lg:h-56" />
            <div className="px-1 sm:flex sm:gap-5 sm:px-5">
                <div className="-mt-10 h-20 w-20 shrink-0 rounded-full border-4 border-white bg-gray-200 sm:-mt-12 sm:h-28 sm:w-28" />
                <div className="mt-3 flex-1 space-y-3">
                    <div className={`${bar} h-6 w-2/3`} />
                    <div className={`${bar} h-4 w-1/4`} />
                    <div className={`${bar} h-4 w-1/2`} />
                </div>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
                <div className="space-y-6">
                    <div className="h-48 rounded-xl border border-gray-100" />
                    <div className="h-40 rounded-xl border border-gray-100" />
                </div>
                <div className="space-y-6">
                    <div className="h-56 rounded-2xl bg-gray-50" />
                    <div className="h-64 rounded-2xl bg-gray-50" />
                </div>
            </div>
        </div>
    );
}