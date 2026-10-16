'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequireRole } from '@/components/require-role';
import { UserRole } from '@/lib/types';
import { ProfitAndLossTab } from './profit-and-loss-tab';
import { BalanceSheetTab } from './balance-sheet-tab';
import { SavingsRegisterTab } from './savings-register-tab';
import { CashBankTab } from './cash-bank-tab';
import { TransactionsTab } from './transactions-tab';

export default function ReportsPage() {
    return (
        <RequireRole roles={[UserRole.ADMIN, UserRole.CHECKER]}>
            <ReportsContent />
        </RequireRole>
    );
}

function ReportsContent() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-sm text-gray-500">Financial statements and registers</p>
            </div>

            <Tabs defaultValue="pl">
                <TabsList className="flex-wrap gap-2">
                    <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
                    <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
                    <TabsTrigger value="savings">Savings Register</TabsTrigger>
                    <TabsTrigger value="cash">Cash & Bank</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="pl" className="mt-16 sm:mt-4">
                    <ProfitAndLossTab />
                </TabsContent>
                <TabsContent value="bs" className="mt-16 sm:mt-4">
                    <BalanceSheetTab />
                </TabsContent>
                <TabsContent value="savings" className="mt-16 sm:mt-4">
                    <SavingsRegisterTab />
                </TabsContent>
                <TabsContent value="cash" className="mt-16 sm:mt-4">
                    <CashBankTab />
                </TabsContent>
                <TabsContent value="transactions" className="mt-16 sm:mt-4">
                    <TransactionsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}