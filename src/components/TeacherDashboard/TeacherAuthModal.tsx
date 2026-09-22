import React, { useState } from 'react';
import { TeacherAccount } from '../../types';
import { ContentStore } from '../../utils/contentStore';
import { sounds } from '../../utils/audio';
import { X, UserCheck, PlusCircle, GraduationCap, School } from 'lucide-react';

interface TeacherAuthModalProps {
  onClose: () => void;
  onAuthenticated: (teacher: TeacherAccount) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  onClose,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const teachers = ContentStore.getTeachers();

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [subjectSpecialty, setSubjectSpecialty] = useState('');

  const handleSelectTeacher = (t: TeacherAccount) => {
    sounds.playPop();
    ContentStore.setCurrentTeacher(t.id);
    onAuthenticated(t);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    sounds.playUnlock();
    const newTeacher = ContentStore.registerTeacher(
      name.trim(),
      email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@eduverse.mi.id`,
      school.trim() || 'Madrasah Ibtidaiyah',
      subjectSpecialty.trim() || 'Guru Kelas'
    );
    onAuthenticated(newTeacher);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 px-5 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              👩‍🏫
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200 bg-indigo-900/40 px-2 py-0.5 rounded-full inline-block">
                Portal Guru MI
              </span>
              <h3 className="text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                {mode === 'LOGIN' ? 'Masuk Dashboard Guru' : 'Daftar Akun Guru Baru'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {mode === 'LOGIN' ? (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-bold text-slate-600">
                Pilih akun guru untuk mengelola materi, video, kuis interaktif, dan memantau progres petualangan siswa:
              </p>

              {/* Quick Teacher List */}
              <div className="space-y-2.5">
                {teachers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTeacher(t)}
                    className="w-full p-3.5 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 flex items-center justify-between text-left transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl shadow-xs">
                        {t.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
                          {t.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-500">
                          {t.subjectSpecialty} • {t.school}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-xl flex items-center gap-1">
                      <UserCheck size={14} />
                      <span>Masuk</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Register New Teacher Switcher */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">
                  Belum punya akun guru?
                </span>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setMode('REGISTER');
                  }}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>Daftar Guru Baru</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <p className="text-xs text-slate-600 font-bold">
                Daftarkan profil pendidik Anda untuk membuat kelas dan konten pembelajaran mandiri di Eduverse:
              </p>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bu Nurul Hidayah, S.Pd."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Nama Madrasah / Sekolah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MI Al-Ikhlas Surabaya"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    Mata Pelajaran / Spesialisasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Guru Kelas 4 / IPAS"
                    value={subjectSpecialty}
                    onChange={(e) => setSubjectSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    Email Kontak (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="nurul@madrasah.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-black text-slate-700 cursor-pointer"
                >
                  Kembali ke Pilihan Guru
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-black shadow-md cursor-pointer"
                >
                  Daftar & Masuk Dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
