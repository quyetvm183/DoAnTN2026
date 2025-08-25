'use client'
import React, { useEffect, useState } from "react";
import TextField from '@/components/atoms/TextField'
import TextArea from '@/components/atoms/TextArea'
import PrimaryButton from '@/components/atoms/PrimaryButton'

// Dummy profile data
const initialProfile = {
  name: "Nguyen Van A",
  email: "nguyenvana@example.com",
  bio: "Mentor in software engineering.",
};

function ProfileView({ profile, onEdit }: { profile: any; onEdit: () => void }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M12 14c3.866 0 7-3.134 7-7S15.866 0 12 0 5 3.134 5 7s3.134 7 7 7Zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
          <p className="text-sm text-gray-500">Hồ sơ hiển thị công khai</p>
        </div>
      </div>

      <dl className="divide-y divide-gray-100">
        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-gray-500">Họ tên</dt>
          <dd className="max-w-[60%] text-sm font-medium text-gray-900">{profile.name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-gray-500">Email</dt>
          <dd className="max-w-[60%] text-sm font-medium text-gray-900">{profile.email}</dd>
        </div>
        <div className="py-3">
          <dt className="mb-1 text-sm text-gray-500">Giới thiệu</dt>
          <dd className="text-sm text-gray-900">{profile.bio || 'Chưa cập nhật'}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <PrimaryButton onClick={onEdit}>Chỉnh sửa</PrimaryButton>
      </div>
    </div>
  );
}

function ProfileEditForm({
  profile,
  onSave,
  onCancel,
}: {
  profile: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-sm sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Cập nhật thông tin</h2>
        <p className="text-sm text-gray-500">Chỉnh sửa các thông tin cơ bản của bạn</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          id="name"
          name="name"
          label="Họ tên"
          placeholder="Nhập họ tên"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        <TextArea
          id="bio"
          name="bio"
          label="Giới thiệu"
          placeholder="Một vài dòng về bạn..."
          rows={5}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <div className="flex items-center gap-3">
          <PrimaryButton type="submit" className="w-auto px-5">Lưu</PrimaryButton>
          <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">Hủy</button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('profile') : null
    if (saved) {
      try {
        setProfile(JSON.parse(saved))
      } catch { }
    }
  }, [])

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = (data: any) => {
    setProfile(data);
    if (typeof window !== 'undefined') localStorage.setItem('profile', JSON.stringify(data))
    setEditing(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {editing ? (
          <ProfileEditForm profile={profile} onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <ProfileView profile={profile} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}