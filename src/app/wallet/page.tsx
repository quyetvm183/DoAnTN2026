// src/app/wallet/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import PrimaryButton from '@/components/atoms/PrimaryButton'
import TextField from '@/components/atoms/TextField'

type Transaction = {
    id: string
    type: 'DEPOSIT' | 'PAYMENT' | 'EARNINGS' | 'REFUND'
    amount: number
    balanceAfter: number
    description: string
    createdAt: string
    bookingId?: string
    momoStatus?: 'PENDING' | 'SUCCESS' | 'FAILED'
}

type WalletStats = {
    currentBalance: number
    totalDeposited: number
    totalSpent: number
    totalEarned: number
    pendingAmount: number
}

// Demo data
const walletStats: WalletStats = {
    currentBalance: 1250.50,
    totalDeposited: 2000,
    totalSpent: 450,
    totalEarned: 750,
    pendingAmount: 150
}

const transactions: Transaction[] = [
    {
        id: '1',
        type: 'EARNINGS',
        amount: 90,
        balanceAfter: 1250.50,
        description: 'Thu nhập từ session React Development với John Doe',
        createdAt: '2024-01-22T14:30:00Z',
        bookingId: 'booking-123'
    },
    {
        id: '2',
        type: 'PAYMENT',
        amount: -45,
        balanceAfter: 1160.50,
        description: 'Thanh toán session Node.js với Sarah Martinez',
        createdAt: '2024-01-20T10:15:00Z',
        bookingId: 'booking-456'
    },
    {
        id: '3',
        type: 'DEPOSIT',
        amount: 500,
        balanceAfter: 1205.50,
        description: 'Nạp tiền qua MoMo',
        createdAt: '2024-01-18T16:45:00Z',
        momoStatus: 'SUCCESS'
    },
    {
        id: '4',
        type: 'REFUND',
        amount: 60,
        balanceAfter: 705.50,
        description: 'Hoàn tiền session bị hủy - UI/UX Design',
        createdAt: '2024-01-15T09:30:00Z',
        bookingId: 'booking-789'
    }
]

function StatCard({ title, value, subtitle, icon, color }: {
    title: string
    value: string
    subtitle?: string
    icon: React.ReactNode
    color: string
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(Math.abs(amount) * 23000)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'EARNINGS':
                return 'text-green-600 bg-green-50'
            case 'DEPOSIT':
                return 'text-blue-600 bg-blue-50'
            case 'PAYMENT':
                return 'text-red-600 bg-red-50'
            case 'REFUND':
                return 'text-purple-600 bg-purple-50'
            default:
                return 'text-gray-600 bg-gray-50'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'EARNINGS':
                return '💰'
            case 'DEPOSIT':
                return '⬆️'
            case 'PAYMENT':
                return '⬇️'
            case 'REFUND':
                return '🔄'
            default:
                return '💳'
        }
    }

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(transaction.type)}`}>
                        <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {transaction.type === 'EARNINGS' ? 'Thu nhập' :
                                transaction.type === 'DEPOSIT' ? 'Nạp tiền' :
                                    transaction.type === 'PAYMENT' ? 'Thanh toán' : 'Hoàn tiền'}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(transaction.balanceAfter)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(transaction.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {transaction.momoStatus && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transaction.momoStatus === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                        transaction.momoStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {transaction.momoStatus}
                    </span>
                )}
                {transaction.bookingId && (
                    <button className="text-indigo-600 hover:text-indigo-900 text-xs">
                        Xem booking
                    </button>
                )}
            </td>
        </tr>
    )
}

function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [amount, setAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('momo')

    if (!isOpen) return null

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Deposit:', amount, paymentMethod)
        // Implement deposit logic
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Nạp tiền vào ví</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleDeposit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số tiền muốn nạp
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="0"
                                min="10000"
                                max="50000000"
                                step="1000"
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                VND
                            </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {[50000, 100000, 200000, 500000, 1000000].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset.toString())}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    {new Intl.NumberFormat('vi-VN').format(preset)}đ
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Phương thức thanh toán
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="momo"
                                    checked={paymentMethod === 'momo'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-indigo-600"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-pink-100 flex items-center justify-center">
                                        <span className="text-pink-600 font-bold text-sm">M</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">MoMo</p>
                                        <p className="text-xs text-gray-500">Ví điện tử MoMo</p>
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="banking"
                                    checked={paymentMethod === 'banking'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-indigo-600"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Internet Banking</p>
                                        <p className="text-xs text-gray-500">Chuyển khoản ngân hàng</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <div className="flex items-start gap-2">
                            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-700">
                                <p className="font-medium">Lưu ý quan trọng:</p>
                                <ul className="mt-1 list-disc list-inside space-y-1">
                                    <li>Số tiền tối thiểu: 50,000 VND</li>
                                    <li>Số tiền tối đa: 50,000,000 VND/ngày</li>
                                    <li>Phí giao dịch: Miễn phí</li>
                                    <li>Thời gian xử lý: Tức thì</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <PrimaryButton type="submit" className="flex-1">
                            Nạp tiền
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

function WithdrawModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [amount, setAmount] = useState('')
    const [bankAccount, setBankAccount] = useState('')
    const [bankName, setBankName] = useState('')

    if (!isOpen) return null

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Withdraw:', amount, bankAccount, bankName)
        // Implement withdraw logic
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Rút tiền</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Số dư khả dụng: <span className="font-semibold text-green-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(walletStats.currentBalance * 23000)}
                            </span>
                        </p>
                    </div>

                    <TextField
                        id="amount"
                        name="amount"
                        type="number"
                        label="Số tiền muốn rút"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Nhập số tiền"
                        required
                    />

                    <TextField
                        id="bankName"
                        name="bankName"
                        label="Tên ngân hàng"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="VD: Vietcombank, Techcombank..."
                        required
                    />

                    <TextField
                        id="bankAccount"
                        name="bankAccount"
                        label="Số tài khoản"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Nhập số tài khoản ngân hàng"
                        required
                    />

                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                        <div className="flex items-start gap-2">
                            <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="text-sm text-yellow-700">
                                <p className="font-medium">Điều khoản rút tiền:</p>
                                <ul className="mt-1 list-disc list-inside space-y-1">
                                    <li>Số tiền tối thiểu: 100,000 VND</li>
                                    <li>Phí giao dịch: 11,000 VND/lần</li>
                                    <li>Thời gian xử lý: 1-3 ngày làm việc</li>
                                    <li>Kiểm tra kỹ thông tin tài khoản</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <PrimaryButton type="submit" className="flex-1">
                            Rút tiền
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function WalletPage() {
    const { data: session } = useSession()
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [filterType, setFilterType] = useState<'all' | 'DEPOSIT' | 'PAYMENT' | 'EARNINGS' | 'REFUND'>('all')

    if (!session) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">Vui lòng đăng nhập để xem ví</p>
            </div>
        )
    }

    const filteredTransactions = filterType === 'all'
        ? transactions
        : transactions.filter(t => t.type === filterType)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount * 23000)
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Ví của tôi</h1>
                <p className="text-gray-600">Quản lý số dư và lịch sử giao dịch</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Số dư hiện tại"
                    value={formatCurrency(walletStats.currentBalance)}
                    subtitle="Có thể sử dụng"
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    }
                    color="bg-green-500"
                />
                <StatCard
                    title="Tổng nạp"
                    value={formatCurrency(walletStats.totalDeposited)}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                    }
                    color="bg-blue-500"
                />
                <StatCard
                    title="Tổng chi"
                    value={formatCurrency(walletStats.totalSpent)}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    }
                    color="bg-red-500"
                />
                <StatCard
                    title="Tổng thu nhập"
                    value={formatCurrency(walletStats.totalEarned)}
                    icon={
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                    color="bg-purple-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Hành động nhanh</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowDepositModal(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nạp tiền
                    </button>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Rút tiền
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="all">Tất cả</option>
                        <option value="DEPOSIT">Nạp tiền</option>
                        <option value="PAYMENT">Thanh toán</option>
                        <option value="EARNINGS">Thu nhập</option>
                        <option value="REFUND">Hoàn tiền</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Giao dịch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Số tiền</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Số dư sau GD</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Thời gian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <TransactionRow key={transaction.id} transaction={transaction} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-lg font-medium">Không có giao dịch nào</p>
                                            <p className="text-sm">
                                                {filterType === 'all'
                                                    ? 'Chưa có giao dịch nào trong ví của bạn'
                                                    : `Không có giao dịch loại ${filterType.toLowerCase()}`
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <DepositModal
                isOpen={showDepositModal}
                onClose={() => setShowDepositModal(false)}
            />
            <WithdrawModal
                isOpen={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
            />
        </div>
    )
}