'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { accountingService, AccountType } from '@/services/accounting.service';
import { CreateAccountDialog } from './create-account-dialog';
import { RequireRole } from '@/components/require-role';
import { UserRole } from '@/lib/types';
import { EditAccountDialog } from './edit-account-dialog';

const typeColor: Record<AccountType, string> = {
    ASSET: 'bg-blue-100 text-blue-800',
    LIABILITY: 'bg-red-100 text-red-800',
    EQUITY: 'bg-purple-100 text-purple-800',
    INCOME: 'bg-green-100 text-green-800',
    EXPENSE: 'bg-orange-100 text-orange-800',
};

export default function AccountsPage() {
    return (
        <RequireRole roles={[UserRole.ADMIN]}>
            <AccountsContent />
        </RequireRole>
    );
}

function AccountsContent() {
    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountingService.getAllAccounts,
    });

    const grouped = (accounts ?? []).reduce<Record<AccountType, typeof accounts>>(
        (acc, account) => {
            (acc[account.type] ??= []).push(account);
            return acc;
        },
        {} as Record<AccountType, typeof accounts>,
    );

    return (
        <div>
            <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
                    <p className="text-sm text-gray-500">
                        The cooperative&rsquo;s general ledger accounts, grouped by type
                    </p>
                </div>
                <CreateAccountDialog />
            </div>

            {isLoading ? (
                <p className="text-sm text-gray-500">Loading…</p>
            ) : (
                <div className="space-y-8">
                    {(['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'] as AccountType[]).map((type) => (
                        <div key={type}>
                            <div className="mb-2 flex items-center gap-2">
                                <Badge className={typeColor[type]} variant="secondary">
                                    {type}
                                </Badge>
                            </div>
                            <div className="rounded-md border bg-white">
                                {(grouped[type] ?? []).length === 0 ? (
                                    <p className="p-4 text-sm text-gray-400">No accounts of this type yet.</p>
                                ) : (
                                    grouped[type]!.map((account) => (
                                        <div
                                            key={account._id}
                                            className="flex items-center justify-between border-b px-4 py-3 text-sm last:border-0"
                                        >
                                            <div className="flex-flex-col">
                                                <div>
                                                    <span className="font-mono text-gray-500">{account.code}</span>
                                                    <span className="ml-3 font-medium">{account.name}</span>
                                                </div>
                                                {account.description && (
                                                    <span className="text-xs text-gray-400">{account.description}</span>
                                                )}
                                            </div>

                                            <EditAccountDialog account={account} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}