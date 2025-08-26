// src/app/profile/page.tsx
'use client'

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import TextField from '@/components/atoms/TextField'
import TextArea from '@/components/atoms/TextArea'
import PrimaryButton from '@/components/atoms/PrimaryButton'
import RoleSegmentedControl from '@/components/atoms/RoleSegmentedControl'

type ProfileData = {
  name: string
  email: string
  bio: string
  phone: string
  schoolName: string
  studentId: string
  role: string
  major?: string
  yearOfStudy?: number
  skills?: string[]
  experience?: string
  hourlyRate?: number
  availability?: string[]
}

type TabType = 'basic' | 'mentor' | 'preferences' | 'security'

// Demo profile data
const initialProfile: ProfileData = {
  name: "Nguyen Van A",
  email: "nguyenvana@example.com",
  bio: "Passionate software engineer with 3+ years of experience in full-stack development.",
  phone: "+84 901 234 567",
  schoolName: "Đại học Bách Khoa Hà Nội",
  studentId: "20201234",
  role: "BOTH",
  major: "Computer Science",
  yearOfStudy: 3,
  skills: ["JavaScript", "React", "Node.js", "Python", "MySQL"],
  experience: "3+ years in web development, worked on e-commerce and fintech projects",
  hourlyRate: 45,
  availability: ["Monday", "Wednesday", "Friday", "Weekend"]
}

function ProfileHeader({ profile }: { profile: ProfileData }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg">
            <span className="text-2xl font-bold">{profile.name.charAt(0)}</span>
          </div>
          <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-indigo-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <div className="mt-2 flex items-center gap-4">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${profile.role === 'MENTOR' ? 'bg-blue-100 text-blue-800' :
              profile.role === 'MENTEE' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
              {profile.role === 'BOTH' ? 'Mentor & Mentee' : profile.role}
            </span>
            {profile.schoolName && (
              <span className="text-sm text-gray-500">🎓 {profile.schoolName}</span>
            )}
          </div>
          {profile.bio && (
            <p className="mt-3 text-gray-700">{profile.bio}</p>
          )}
        </div>
      </div>

      {(profile.role === 'MENTOR' || profile.role === 'BOTH') && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">${profile.hourlyRate}</p>
            <p className="text-sm text-gray-600">Hourly Rate</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">4.9</p>
            <p className="text-sm text-gray-600">Rating (127 reviews)</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">342</p>
            <p className="text-sm text-gray-600">Hours Taught</p>
          </div>
        </div>
      )}
    </div>
  )
}

function BasicInfoTab({ profile, onSave }: { profile: ProfileData; onSave: (data: ProfileData) => void }) {
  const [form, setForm] = useState(profile)
  const [editing, setEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Chỉnh sửa
          </button>
        </div>

        <dl className="divide-y divide-gray-100">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Họ tên</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.name}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.email}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.phone || 'Chưa cập nhật'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Trường học</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.schoolName || 'Chưa cập nhật'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Mã sinh viên</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.studentId || 'Chưa cập nhật'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.role}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Giới thiệu</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.bio || 'Chưa cập nhật'}</dd>
          </div>
        </dl>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin cơ bản</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          id="name"
          name="name"
          label="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          id="phone"
          name="phone"
          label="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          id="schoolName"
          name="schoolName"
          label="Trường học"
          value={form.schoolName}
          onChange={handleChange}
        />
        <TextField
          id="studentId"
          name="studentId"
          label="Mã sinh viên"
          value={form.studentId}
          onChange={handleChange}
        />
        <div>
          <RoleSegmentedControl
            value={form.role}
            onChange={(role) => setForm({ ...form, role })}
            label="Vai trò"
          />
        </div>
      </div>

      <TextArea
        id="bio"
        name="bio"
        label="Giới thiệu"
        rows={4}
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />

      <div className="flex items-center gap-3">
        <PrimaryButton type="submit" className="w-auto px-6">
          Lưu thay đổi
        </PrimaryButton>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}

function MentorProfileTab({ profile, onSave }: { profile: ProfileData; onSave: (data: ProfileData) => void }) {
  const [form, setForm] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    setEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !form.skills?.includes(newSkill.trim())) {
      setForm({
        ...form,
        skills: [...(form.skills || []), newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setForm({
      ...form,
      skills: form.skills?.filter(skill => skill !== skillToRemove)
    })
  }

  if (profile.role === 'MENTEE') {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Thông tin Mentor</h3>
        <p className="text-gray-500">Bạn cần là Mentor hoặc Both để truy cập phần này</p>
      </div>
    )
  }

  if (!editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Hồ sơ Mentor</h3>
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Chỉnh sửa
          </button>
        </div>

        <dl className="divide-y divide-gray-100">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Chuyên ngành</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.major || 'Chưa cập nhật'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Năm học</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {profile.yearOfStudy ? `Năm ${profile.yearOfStudy}` : 'Chưa cập nhật'}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Giá theo giờ</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {profile.hourlyRate ? `${profile.hourlyRate}/giờ` : 'Chưa cập nhật'}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Kinh nghiệm</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.experience || 'Chưa cập nhật'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Kỹ năng</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-900">Chưa cập nhật</span>
              )}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Lịch trống</dt>
            <dd className="mt-1 sm:col-span-2 sm:mt-0">
              {profile.availability && profile.availability.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.availability.map(day => (
                    <span key={day} className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      {day}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-900">Chưa cập nhật</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa hồ sơ Mentor</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          id="major"
          name="major"
          label="Chuyên ngành"
          value={form.major || ''}
          onChange={(e) => setForm({ ...form, major: e.target.value })}
        />
        <TextField
          id="yearOfStudy"
          name="yearOfStudy"
          type="number"
          label="Năm học"
          value={form.yearOfStudy?.toString() || ''}
          onChange={(e) => setForm({ ...form, yearOfStudy: parseInt(e.target.value) || undefined })}
        />
        <TextField
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          label="Giá theo giờ ($)"
          value={form.hourlyRate?.toString() || ''}
          onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) || undefined })}
        />
      </div>

      <TextArea
        id="experience"
        name="experience"
        label="Kinh nghiệm"
        rows={4}
        value={form.experience || ''}
        onChange={(e) => setForm({ ...form, experience: e.target.value })}
        placeholder="Mô tả kinh nghiệm và thành tích của bạn..."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Thêm kỹ năng..."
            className="flex-1 rounded-lg border border-gray-200 bg-white/60 px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <button
            type="button"
            onClick={addSkill}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Thêm
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.skills?.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PrimaryButton type="submit" className="w-auto px-6">
          Lưu thay đổi
        </PrimaryButton>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}

function PreferencesTab({ profile, onSave }: { profile: ProfileData; onSave: (data: ProfileData) => void }) {
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailMarketing: false,
    pushBookings: true,
    pushMessages: true,
    pushMarketing: false
  })

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email về booking</p>
              <p className="text-sm text-gray-500">Nhận thông báo khi có booking mới</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailBookings}
              onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email về tin nhắn</p>
              <p className="text-sm text-gray-500">Nhận thông báo khi có tin nhắn mới</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailMessages}
              onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Push notification</p>
              <p className="text-sm text-gray-500">Nhận thông báo đẩy trên trình duyệt</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.pushBookings}
              onChange={(e) => setNotifications({ ...notifications, pushBookings: e.target.checked })}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quyền riêng tư</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Hiện thông tin công khai</p>
              <p className="text-sm text-gray-500">Cho phép người khác tìm thấy hồ sơ của bạn</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showProfile}
              onChange={(e) => setPrivacy({ ...privacy, showProfile: e.target.checked })}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Hiện email</p>
              <p className="text-sm text-gray-500">Hiển thị email trong hồ sơ công khai</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showEmail}
              onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Cho phép tin nhắn</p>
              <p className="text-sm text-gray-500">Người khác có thể gửi tin nhắn cho bạn</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.allowMessages}
              onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <PrimaryButton className="w-auto px-6">
          Lưu cài đặt
        </PrimaryButton>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }
    // Handle password change
    console.log('Password change requested')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <TextField
            id="currentPassword"
            name="currentPassword"
            type="password"
            label="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            id="newPassword"
            name="newPassword"
            type="password"
            label="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <PrimaryButton type="submit" className="w-auto px-6">
            Đổi mật khẩu
          </PrimaryButton>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phiên đăng nhập</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Chrome trên Windows</p>
              <p className="text-sm text-gray-500">Hiện tại • Hanoi, Vietnam</p>
            </div>
            <span className="text-sm text-green-600">Hiện tại</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Mobile Safari trên iPhone</p>
              <p className="text-sm text-gray-500">2 giờ trước • Hanoi, Vietnam</p>
            </div>
            <button className="text-sm text-red-600 hover:text-red-800">Đăng xuất</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xóa tài khoản</h3>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700 mb-3">
            Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
          </p>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [activeTab, setActiveTab] = useState<TabType>('basic')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('profile') : null
    if (saved) {
      try {
        setProfile(JSON.parse(saved))
      } catch { }
    }
  }, [])

  const handleSave = (data: ProfileData) => {
    setProfile(data)
    if (typeof window !== 'undefined') localStorage.setItem('profile', JSON.stringify(data))
  }

  const tabs = [
    { key: 'basic', label: 'Cơ bản', icon: '👤' },
    { key: 'mentor', label: 'Mentor', icon: '🎓' },
    { key: 'preferences', label: 'Cài đặt', icon: '⚙️' },
    { key: 'security', label: 'Bảo mật', icon: '🔒' }
  ] as const

  if (!session) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Vui lòng đăng nhập để xem profile</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ProfileHeader profile={profile} />

        <div className="mt-8 flex gap-8">
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
              {activeTab === 'basic' && <BasicInfoTab profile={profile} onSave={handleSave} />}
              {activeTab === 'mentor' && <MentorProfileTab profile={profile} onSave={handleSave} />}
              {activeTab === 'preferences' && <PreferencesTab profile={profile} onSave={handleSave} />}
              {activeTab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}