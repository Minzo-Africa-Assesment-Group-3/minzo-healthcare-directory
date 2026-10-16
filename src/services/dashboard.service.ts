import { accountingService } from './accounting.service';

export interface FinancialSummary {
    cash: number;
    loansOutstanding: number;
    savingsTotal: number;
}

export const dashboardService = {
    getFinancialSummary: async (): Promise<FinancialSummary> => {
        const accounts = await accountingService.getAllAccounts();
        const findByCode = (code: string) => accounts.find((a) => a.code === code);

        const cashAccount = findByCode('1000');
        const loansAccount = findByCode('1100');
        const savingsAccount = findByCode('2000');

        const [cash, loans, savings] = await Promise.all([
            cashAccount ? accountingService.getBalance(cashAccount._id) : null,
            loansAccount ? accountingService.getBalance(loansAccount._id) : null,
            savingsAccount ? accountingService.getBalance(savingsAccount._id) : null,
        ]);

        return {
            cash: cash ? parseFloat(cash.balance) : 0,
            loansOutstanding: loans ? parseFloat(loans.balance) : 0,
            savingsTotal: savings ? parseFloat(savings.balance) : 0,
        };
    },
};