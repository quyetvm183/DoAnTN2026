// src/app/settings/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import TextField from '@/components/atoms/TextField'
import PasswordField from '@/components/atoms/PasswordField'
import PrimaryButton from '@/components/atoms/PrimaryButton'

type NotificationSettings = {
    emailBookings: boolean
    emailMessages: boolean
    emailMarketing: boolean
    pushBookings: boolean
    pushMessages: boolean
    pushPromotions: boolean
    smsImportant: boolean
}

type PrivacySettings = {
    showProfile: boolean
    showEmail: boolean
    showPhone: boolean
    allowMessages: boolean
    showOnlineStatus: boolean
    allowReviews: boolean
}

type AccountSettings = {
    twoFactorEnabled: boolean
    sessionTimeout: number
    loginAlerts: boolean
}

// Demo settings
const initialNotifications: NotificationSettings = {
    emailBookings: true,
    emailMessages: true,
    emailMarketing: false,
    pushBookings: true,
    pushMessages: true,
    pushPromotions: false,
    smsImportant: true
}

const initialPrivacy: PrivacySettings = {
    showProfile: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
    allowReviews: true
}

const initialAccount: AccountSettings = {
    twoFactorEnabled: false,
    sessionTimeout: 60,
    loginAlerts: true
}

function NotificationTab() {
    const [settings, setSettings] = useState(initialNotifications)
    const [saved, setSaved] = useState(false)

    const handleToggle = (key: keyof NotificationSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSave = () => {
        // Save settings
        console.log('Saving notification settings:', settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo qua Email</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Booking mới</p>
                            <p className="text-sm text-gray-500">Nhận email khi có booking được tạo hoặc chấp nhận</p>
                        </div>
                        <button
                            onClick={() => handleToggle('emailBookings')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.emailBookings ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailBookings ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Tin nhắn mới</p>
                            <p className="text-sm text-gray-500">Nhận email khi có tin nhắn từ mentor hoặc mentee</p>
                        </div>
                        <button
                            onClick={() => handleToggle('emailMessages')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.emailMessages ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailMessages ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Marketing & Khuyến mãi</p>
                            <p className="text-sm text-gray-500">Nhận thông tin về tính năng mới và ưu đãi đặc biệt</p>
                        </div>
                        <button
                            onClick={() => handleToggle('emailMarketing')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.emailMarketing ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailMarketing ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Booking & Sessions</p>
                            <p className="text-sm text-gray-500">Nhận thông báo về lịch học và phiên dạy</p>
                        </div>
                        <button
                            onClick={() => handleToggle('pushBookings')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.pushBookings ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushBookings ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Tin nhắn</p>
                            <p className="text-sm text-gray-500">Thông báo khi có tin nhắn mới</p>
                        </div>
                        <button
                            onClick={() => handleToggle('pushMessages')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.pushMessages ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushMessages ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Khuyến mãi</p>
                            <p className="text-sm text-gray-500">Thông báo về ưu đãi và sự kiện đặc biệt</p>
                        </div>
                        <button
                            onClick={() => handleToggle('pushPromotions')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.pushPromotions ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushPromotions ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Thông báo quan trọng</p>
                            <p className="text-sm text-gray-500">Chỉ những thông báo bảo mật và quan trọng nhất</p>
                        </div>
                        <button
                            onClick={() => handleToggle('smsImportant')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.smsImportant ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.smsImportant ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                    {saved && (
                        <span className="text-green-600">✅ Đã lưu thay đổi</span>
                    )}
                </div>
                <PrimaryButton onClick={handleSave} className="w-auto px-6">
                    Lưu cài đặt
                </PrimaryButton>
            </div>
        </div>
    )
}

function PrivacyTab() {
    const [settings, setSettings] = useState(initialPrivacy)
    const [saved, setSaved] = useState(false)

    const handleToggle = (key: keyof PrivacySettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSave = () => {
        console.log('Saving privacy settings:', settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiển thị công khai</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Hồ sơ công khai</p>
                            <p className="text-sm text-gray-500">Cho phép người khác tìm thấy và xem hồ sơ của bạn</p>
                        </div>
                        <button
                            onClick={() => handleToggle('showProfile')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.showProfile ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showProfile ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Hiển thị email</p>
                            <p className="text-sm text-gray-500">Hiện email trong hồ sơ công khai</p>
                        </div>
                        <button
                            onClick={() => handleToggle('showEmail')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.showEmail ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showEmail ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Hiển thị số điện thoại</p>
                            <p className="text-sm text-gray-500">Hiện số điện thoại trong hồ sơ công khai</p>
                        </div>
                        <button
                            onClick={() => handleToggle('showPhone')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.showPhone ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showPhone ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Trạng thái online</p>
                            <p className="text-sm text-gray-500">Hiển thị khi bạn đang online</p>
                        </div>
                        <button
                            onClick={() => handleToggle('showOnlineStatus')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.showOnlineStatus ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tương tác</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Cho phép tin nhắn</p>
                            <p className="text-sm text-gray-500">Người khác có thể gửi tin nhắn riêng cho bạn</p>
                        </div>
                        <button
                            onClick={() => handleToggle('allowMessages')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.allowMessages ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowMessages ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Cho phép đánh giá</p>
                            <p className="text-sm text-gray-500">Học viên có thể đánh giá sau khi hoàn thành session</p>
                        </div>
                        <button
                            onClick={() => handleToggle('allowReviews')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.allowReviews ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowReviews ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                    {saved && (
                        <span className="text-green-600">✅ Đã lưu thay đổi</span>
                    )}
                </div>
                <PrimaryButton onClick={handleSave} className="w-auto px-6">
                    Lưu cài đặt
                </PrimaryButton>
            </div>
        </div>
    )
}

function SecurityTab() {
    const [accountSettings, setAccountSettings] = useState(initialAccount)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [saved, setSaved] = useState(false)

    const handleToggle = (key: keyof AccountSettings) => {
        setAccountSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp')
            return
        }
        console.log('Password change requested')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        alert('Mật khẩu đã được thay đổi thành công!')
    }

    const handleSaveAccount = () => {
        console.log('Saving account settings:', accountSettings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-8">
            {/* Change Password */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <PasswordField
                        id="currentPassword"
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                    />
                    <PasswordField
                        id="newPassword"
                        name="newPassword"
                        label="Mật khẩu mới"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        showStrength
                    />
                    <PasswordField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                    />
                    <PrimaryButton type="submit" className="w-auto px-6">
                        Đổi mật khẩu
                    </PrimaryButton>
                </form>
            </div>

            {/* Account Security */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật tài khoản</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Xác thực 2 bước (2FA)</p>
                            <p className="text-sm text-gray-500">Tăng cường bảo mật với xác thực qua SMS hoặc app</p>
                        </div>
                        <button
                            onClick={() => handleToggle('twoFactorEnabled')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${accountSettings.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountSettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Cảnh báo đăng nhập</p>
                            <p className="text-sm text-gray-500">Nhận thông báo khi có đăng nhập từ thiết bị mới</p>
                        </div>
                        <button
                            onClick={() => handleToggle('loginAlerts')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${accountSettings.loginAlerts ? 'bg-indigo-600' : 'bg-gray-200'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${accountSettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">Thời gian hết hạn session</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Tự động đăng xuất sau khoảng thời gian không hoạt động</p>
                        <select
                            value={accountSettings.sessionTimeout}
                            onChange={(e) => setAccountSettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                        >
                            <option value={15}>15 phút</option>
                            <option value={30}>30 phút</option>
                            <option value={60}>1 giờ</option>
                            <option value={120}>2 giờ</option>
                            <option value={-1}>Không giới hạn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Active Sessions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phiên đăng nhập</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Chrome trên Windows</p>
                                <p className="text-sm text-gray-500">Hiện tại • Hanoi, Vietnam</p>
                            </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Hiện tại</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Safari trên iPhone</p>
                                <p className="text-sm text-gray-500">2 giờ trước • Hanoi, Vietnam</p>
                            </div>
                        </div>
                        <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                    {saved && (
                        <span className="text-green-600">✅ Đã lưu thay đổi</span>
                    )}
                </div>
                <PrimaryButton onClick={handleSaveAccount} className="w-auto px-6">
                    Lưu cài đặt bảo mật
                </PrimaryButton>
            </div>

            {/* Danger Zone */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Vùng nguy hiểm</h3>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Xóa tài khoản</h4>
                    <p className="text-sm text-red-700 mb-4">
                        Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn bao gồm:
                        hồ sơ, lịch sử booking, tin nhắn và ví điện tử.
                    </p>
                    <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                        Xóa tài khoản vĩnh viễn
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function SettingsPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'security'>('notifications')

    if (!session) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">Vui lòng đăng nhập để truy cập cài đặt</p>
            </div>
        )
    }

    const tabs = [
        { key: 'notifications', label: 'Thông báo', icon: '🔔' },
        { key: 'privacy', label: 'Quyền riêng tư', icon: '🔒' },
        { key: 'security', label: 'Bảo mật', icon: '🛡️' }
    ] as const

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Cài đặt</h1>
                <p className="text-gray-600">Quản lý tùy chọn tài khoản và quyền riêng tư của bạn</p>
            </div>

            <div className="flex gap-8">
                {/* Sidebar */}
                <div className="hidden w-64 shrink-0 lg:block">
                    <nav className="sticky top-24 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${activeTab === tab.key
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Mobile tabs */}
                <div className="block w-full lg:hidden">
                    <div className="mb-6 flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${activeTab === tab.key
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                    <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm sm:p-8">
                        {activeTab === 'notifications' && <NotificationTab />}
                        {activeTab === 'privacy' && <PrivacyTab />}
                        {activeTab === 'security' && <SecurityTab />}
                    </div>
                </div>
            </div>
        </div>
    )
}