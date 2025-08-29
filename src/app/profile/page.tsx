'use client'

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import TextField from '@/components/atoms/TextField'
import TextArea from '@/components/atoms/TextArea'
import PrimaryButton from '@/components/atoms/PrimaryButton'
import RoleSegmentedControl from '@/components/atoms/RoleSegmentedControl'

type ProfileData = {
  id: string
  name: string
  email: string
  bio: string
  phone: string
  schoolName: string
  studentId: string
  role: string
  avatarUrl?: string
  mentor?: {
    bio?: string
    major?: string
    yearOfStudy?: number
    subjects?: Array<{
      subjectId: string
      subject: { id: string; name: string }
      hourlyRate: number
      experienceDescription?: string
    }>
    totalSessions: number
    avgRating: number
    isApproved: boolean
  }
  wallet?: {
    balance: number
  }
}

type Subject = {
  id: string
  name: string
  code: string
  description?: string
}

type TabType = 'basic' | 'mentor' | 'preferences' | 'security'

function ProfileHeader({ profile }: { profile: ProfileData }) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        window.location.reload() // Simple reload to show new avatar
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      handleAvatarUpload(file)
    }
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold">{profile.name.charAt(0)}</span>
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-indigo-600 cursor-pointer">
            {uploadingAvatar ? (
              <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
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

      {(profile.role === 'MENTOR' || profile.role === 'BOTH') && profile.mentor && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">
              ${profile.mentor.subjects?.[0]?.hourlyRate || 0}
            </p>
            <p className="text-sm text-gray-600">Hourly Rate</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{profile.mentor.avgRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{profile.mentor.totalSessions}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
        </div>
      )}
    </div>
  )
}

function BasicInfoTab({ profile, onUpdate }: { profile: ProfileData; onUpdate: () => void }) {
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone || '',
    schoolName: profile.schoolName || '',
    studentId: profile.studentId || '',
    bio: profile.bio || ''
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...form, role: profile.role }) // Keep existing role
      })

      if (response.ok) {
        setEditing(false)
        onUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
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
        <PrimaryButton type="submit" className="w-auto px-6" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
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

function MentorProfileTab({ profile, onUpdate }: { profile: ProfileData; onUpdate: () => void }) {
  const [form, setForm] = useState({
    bio: profile.mentor?.bio || '',
    major: profile.mentor?.major || '',
    yearOfStudy: profile.mentor?.yearOfStudy || undefined
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [mentorSubjects, setMentorSubjects] = useState(profile.mentor?.subjects || [])
  const [showAddSubject, setShowAddSubject] = useState(false)
  const [newSubject, setNewSubject] = useState({
    subjectId: '',
    hourlyRate: 0,
    experienceDescription: ''
  })

  useEffect(() => {
    fetchSubjects()
    fetchMentorSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      if (response.ok) {
        const data = await response.json()
        setSubjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchMentorSubjects = async () => {
    try {
      const response = await fetch('/api/profile/mentor/subjects')
      if (response.ok) {
        const data = await response.json()
        setMentorSubjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching mentor subjects:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        setEditing(false)
        onUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update mentor profile')
      }
    } catch (error) {
      console.error('Error updating mentor profile:', error)
      alert('Failed to update mentor profile')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSubject = async (subjectId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa môn học này?')) return

    try {
      const response = await fetch(`/api/profile/mentor/subjects/${subjectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchMentorSubjects()
        onUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to remove subject')
      }
    } catch (error) {
      console.error('Error removing subject:', error)
      alert('Failed to remove subject')
    }
  }

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.subjectId || !newSubject.hourlyRate) return

    try {
      const response = await fetch('/api/profile/mentor/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSubject)
      })

      if (response.ok) {
        await fetchMentorSubjects()
        setNewSubject({ subjectId: '', hourlyRate: 0, experienceDescription: '' })
        setShowAddSubject(false)
        onUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add subject')
      }
    } catch (error) {
      console.error('Error adding subject:', error)
      alert('Failed to add subject')
    }
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

  return (
    <div className="space-y-8">
      {/* Basic mentor info */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {editing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField
                id="major"
                name="major"
                label="Chuyên ngành"
                value={form.major}
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
            </div>

            <TextArea
              id="bio"
              name="bio"
              label="Mô tả về bản thân"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Mô tả kinh nghiệm và kỹ năng của bạn..."
            />

            <PrimaryButton type="submit" className="w-auto px-6" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </PrimaryButton>
          </form>
        ) : (
          <dl className="divide-y divide-gray-100">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Chuyên ngành</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{form.major || 'Chưa cập nhật'}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Năm học</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {form.yearOfStudy ? `Năm ${form.yearOfStudy}` : 'Chưa cập nhật'}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{form.bio || 'Chưa cập nhật'}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* Subjects section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Môn học giảng dạy</h3>
          <button
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Thêm môn học
          </button>
        </div>

        {showAddSubject && (
          <form onSubmit={handleAddSubject} className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Môn học</label>
                <select
                  value={newSubject.subjectId}
                  onChange={(e) => setNewSubject({ ...newSubject, subjectId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  required
                >
                  <option value="">Chọn môn học</option>
                  {subjects.filter(s => !mentorSubjects.some(ms => ms.subject.id === s.id)).map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <TextField
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                label="Giá theo giờ ($)"
                value={newSubject.hourlyRate.toString()}
                onChange={(e) => setNewSubject({ ...newSubject, hourlyRate: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <TextArea
              id="experienceDescription"
              name="experienceDescription"
              label="Mô tả kinh nghiệm (tùy chọn)"
              rows={3}
              value={newSubject.experienceDescription}
              onChange={(e) => setNewSubject({ ...newSubject, experienceDescription: e.target.value })}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Thêm môn học
              </button>
              <button
                type="button"
                onClick={() => setShowAddSubject(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {mentorSubjects.length > 0 ? (
            mentorSubjects.map((mentorSubject) => (
              <div key={mentorSubject.subject.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{mentorSubject.subject.name}</h4>
                    <p className="text-sm text-gray-600">${mentorSubject.hourlyRate}/giờ</p>
                    {mentorSubject.experienceDescription && (
                      <p className="mt-2 text-sm text-gray-700">{mentorSubject.experienceDescription}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSubject(mentorSubject.subject.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Chưa có môn học nào. Hãy thêm môn học đầu tiên!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.newPassword !== form.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        alert('Đổi mật khẩu thành công')
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    } finally {
      setLoading(false)
    }
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
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            required
          />
          <TextField
            id="newPassword"
            name="newPassword"
            type="password"
            label="Mật khẩu mới"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu mới"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
          <PrimaryButton type="submit" className="w-auto px-6" disabled={loading}>
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
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

function PreferencesTab() {
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

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session])

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

  if (loading || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
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
              {activeTab === 'basic' && <BasicInfoTab profile={profile} onUpdate={fetchProfile} />}
              {activeTab === 'mentor' && <MentorProfileTab profile={profile} onUpdate={fetchProfile} />}
              {activeTab === 'preferences' && <PreferencesTab />}
              {activeTab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

