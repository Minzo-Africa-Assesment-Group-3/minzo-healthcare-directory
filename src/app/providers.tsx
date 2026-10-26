'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssistantProvider } from '@/components/assistant/assistant-provider';
import Nprogressprovider from './providers/bprogress-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30 * 1000, // 30s — reasonable default, override per-query where needed
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Nprogressprovider>
            <AssistantProvider>{children}</AssistantProvider>
            </Nprogressprovider>
        </QueryClientProvider>
    );
}
