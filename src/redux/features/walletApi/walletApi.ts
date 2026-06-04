import { api } from '@/redux/api/apiSlice';


export interface Transaction {
    _id?: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    reference: string;
    paymentMethod: 'paystack' | 'flutterwave' | 'wallet';
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface Wallet {
    _id: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    balance: number;
    formattedBalance?: string;
    transactionCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface WalletWithTransactions extends Wallet {
    transactions: Transaction[];
    totalTransactions: number;
}

interface GetAllWalletsResponse {
    success: boolean;
    message: string;
    data: {
        wallets: Wallet[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

interface GetUserWalletResponse {
    success: boolean;
    message: string;
    data: {
        wallet: Wallet;
        transactions: Transaction[];
        totalTransactions: number;
    };
}

interface ManualFundRequest {
    amount: number;
    description?: string;
    reference?: string;
}

interface ManualFundResponse {
    success: boolean;
    message: string;
    data: {
        wallet: Wallet;
        transaction: Transaction;
    };
}

export const walletApi = api.injectEndpoints({

    endpoints: (builder) => ({
        // Get all wallets with pagination and search
        getAllWallets: builder.query<
            GetAllWalletsResponse['data'],
            { page?: number; limit?: number; search?: string }
        >({
            query: ({ page = 1, limit = 20, search = '' }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (search) params.append('search', search);
                return `admin-wallets?${params.toString()}`;
            },
            transformResponse: (response: GetAllWalletsResponse) => response.data,

        }),

        // Get specific user wallet with transactions
        getUserWallet: builder.query<GetUserWalletResponse['data'], string>({
            query: (userId) => `admin-wallets/${userId}`,
            transformResponse: (response: GetUserWalletResponse) => response.data,
        }),

        // Manual fund by admin
        manualFundWallet: builder.mutation<
            ManualFundResponse['data'],
            { userId: string; body: ManualFundRequest }
        >({
            query: ({ userId, body }) => ({
                url: `admin-wallets/${userId}/fund`,
                method: 'POST',
                body,
            }),
            transformResponse: (response: ManualFundResponse) => response.data,
        }),
        // Add this new mutation endpoint
        manualDebitWallet: builder.mutation<
            ManualFundResponse['data'],  // same response shape as fund
            { userId: string; body: ManualFundRequest }
        >({
            query: ({ userId, body }) => ({
                url: `admin-wallets/${userId}/debit`,
                method: 'POST',
                body,
            }),
            transformResponse: (response: ManualFundResponse) => response.data,

        }),
    }),
});

export const {
    useGetAllWalletsQuery,
    useGetUserWalletQuery,
    useManualFundWalletMutation,
     useManualDebitWalletMutation, // add this
} = walletApi;