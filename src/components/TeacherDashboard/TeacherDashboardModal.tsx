import React, { useState } from 'react';
import {
  TeacherAccount,
  ClassGrade,
  SubjectItem,
  MateriItem,
} from '../../types';
import { ContentStore, CLASS_GRADES } from '../../utils/contentStore';
import { sounds } from '../../utils/audio';
import {
  X,
  Plus,
  BookOpen,
  Gamepad2,
  Search,
  Users,
  Award,
  BarChart3,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Video,
  Sparkles,
  ArrowLeft,
  Compass,
  Play,
  Image as ImageIcon,
  Tag,
  Check,
} from 'lucide-react';

interface TeacherDashboardModalProps {
  teacher: TeacherAccount;
  onClose: () => void;
  onLogout: () => void;
  onPreviewMateri?: (materi: MateriItem) => void;
  onStartStudentLesson?: (materi: MateriItem) => void;
  onContentUpdated?: () => void;
}

type DashboardTab = 'MATERI' | 'GAME' | 'MISI' | 'SISWA' | 'BADGE' | 'PROGRESS';

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  teacher,
  onClose,
  onLogout,
  onPreviewMateri,
  onStartStudentLesson,
  onContentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('MATERI');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Data lists
  const [materiList, setMateriList] = useState<MateriItem[]>(() =>
    ContentStore.getMateriByTeacher(teacher.id)
  );
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => ContentStore.getSubjects());
  const students = ContentStore.getStudents();

  // Filters for Materi tab
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingMateriId, setEditingMateriId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    classGrade: 4 as ClassGrade,
    subjectId: 'matematika',
    description: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    xpReward: 20,
    status: 'Aktif' as 'Aktif' | 'Draft',
  });

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    classGrade?: string;
    subjectId?: string;
    content?: string;
  }>({});

  // New Custom Subject inline state
  const [isAddingNewSubject, setIsAddingNewSubject] = useState<boolean>(false);
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [newSubjectEmoji, setNewSubjectEmoji] = useState<string>('📚');

  // Delete Confirmation state
  const [deletingMateri, setDeletingMateri] = useState<MateriItem | null>(null);

  // Preview Modal state
  const [previewMateri, setPreviewMateri] = useState<MateriItem | null>(null);

  // Trigger temporary feedback message
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  // Reload Materi list
  const refreshMateriList = () => {
    const updated = ContentStore.getMateriByTeacher(teacher.id);
    setMateriList(updated);
    setSubjects(ContentStore.getSubjects());
    if (onContentUpdated) {
      onContentUpdated();
    }
  };

  // Open Form: Add New
  const handleOpenAdd = () => {
    sounds.playPop();
    setEditingMateriId(null);
    setFormData({
      title: '',
      classGrade: (filterClass !== 'all' ? (filterClass as ClassGrade) : 4) as ClassGrade,
      subjectId: filterSubject !== 'all' ? filterSubject : (subjects[0]?.id || 'matematika'),
      description: '',
      content: '',
      imageUrl: '',
      videoUrl: '',
      xpReward: 20,
      status: 'Aktif',
    });
    setFormErrors({});
    setIsAddingNewSubject(false);
    setIsFormOpen(true);
  };

  // Open Form: Edit
  const handleOpenEdit = (materi: MateriItem) => {
    sounds.playPop();
    setEditingMateriId(materi.id);
    setFormData({
      title: materi.title,
      classGrade: materi.classGrade,
      subjectId: materi.subjectId,
      description: materi.description || '',
      content: materi.content || (materi.cards && materi.cards[0] ? materi.cards[0].explanation : ''),
      imageUrl: materi.imageUrl || '',
      videoUrl: materi.videoUrl || '',
      xpReward: materi.xpReward || 20,
      status: materi.status || 'Aktif',
    });
    setFormErrors({});
    setIsAddingNewSubject(false);
    setIsFormOpen(true);
  };

  // Handle Save Materi
  const handleSaveMateri = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: { title?: string; classGrade?: string; subjectId?: string; content?: string } = {};

    if (!formData.title.trim()) {
      errors.title = 'Judul materi wajib diisi!';
    }
    if (!formData.classGrade) {
      errors.classGrade = 'Kelas wajib dipilih!';
    }
    if (!formData.subjectId) {
      errors.subjectId = 'Mata pelajaran wajib dipilih!';
    }
    if (!formData.content.trim()) {
      errors.content = 'Isi materi pembelajaran wajib diisi!';
    }

    if (Object.keys(errors).length > 0) {
      sounds.playError();
      setFormErrors(errors);
      return;
    }

    // Save
    sounds.playCorrect();
    ContentStore.saveMateri({
      id: editingMateriId || undefined,
      contentId: editingMateriId || undefined,
      teacherId: teacher.id,
      classGrade: formData.classGrade,
      classId: formData.classGrade,
      subjectId: formData.subjectId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      content: formData.content.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      videoUrl: formData.videoUrl.trim() || undefined,
      xpReward: Number(formData.xpReward) || 20,
      status: formData.status,
      isDemo: false,
      active: true,
      order: 1,
    });

    setIsFormOpen(false);
    setEditingMateriId(null);
    refreshMateriList();
    showFeedback('Materi berhasil disimpan! Materi otomatis muncul di daftar guru dan sisi petualangan siswa.');
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingMateri) return;
    sounds.playTrash();
    ContentStore.deleteMateri(deletingMateri.id, teacher.id);
    setDeletingMateri(null);
    refreshMateriList();
    showFeedback(`Materi "${deletingMateri.title}" berhasil dihapus.`);
  };

  // Handle Add Custom Subject inline
  const handleCreateNewSubject = () => {
    if (!newSubjectName.trim()) return;
    sounds.playCorrect();
    const created = ContentStore.addSubject(
      newSubjectName.trim(),
      newSubjectEmoji || '📚',
      'indigo',
      `Mata pelajaran ${newSubjectName.trim()}`,
      [1, 2, 3, 4, 5, 6]
    );
    setSubjects(ContentStore.getSubjects());
    setFormData((prev) => ({ ...prev, subjectId: created.id }));
    setIsAddingNewSubject(false);
    setNewSubjectName('');
    showFeedback(`Mata pelajaran "${created.name}" berhasil ditambahkan!`);
  };

  // Filtered Materi List
  const filteredMateri = materiList.filter((m) => {
    if (filterClass !== 'all' && Number(m.classGrade) !== Number(filterClass)) {
      return false;
    }
    if (filterSubject !== 'all' && m.subjectId !== filterSubject) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = (m.description || '').toLowerCase().includes(q);
      const matchContent = (m.content || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchContent) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-6xl max-h-[95vh] bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 flex flex-col overflow-hidden text-slate-800">
        {/* ========================================================= */}
        {/* 1. TOP HEADER: DASHBOARD GURU                             */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-300/30">
                  Dashboard Guru
                </span>
                <span className="text-xs text-indigo-200 font-bold hidden sm:inline">
                  • Manajemen Pembelajaran MI
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif] tracking-wide text-white">
                Selamat datang di EDUVERSE
              </h3>
              <p className="text-xs text-indigo-100 font-medium">
                {teacher.name} • {teacher.school} • {teacher.subjectSpecialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer transition transform hover:scale-105"
              title="Kembali ke Peta Petualangan Siswa"
            >
              <Compass size={16} />
              <span>Ke Petualangan Siswa 🎮</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onLogout();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1 border border-white/20 transition cursor-pointer"
              title="Keluar dari akun guru"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MENU BAR                                               */}
        {/* ========================================================= */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'MATERI', label: '📚 Materi', count: materiList.length },
            { id: 'GAME', label: '🎮 Game', count: null },
            { id: 'MISI', label: '🔎 Misi', count: null },
            { id: 'SISWA', label: '👨‍🎓 Siswa', count: students.length },
            { id: 'BADGE', label: '🏅 Badge', count: null },
            { id: 'PROGRESS', label: '📊 Progress', count: null },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id as DashboardTab);
                }}
                className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className="bg-emerald-50 border-b-2 border-emerald-300 px-4 py-2.5 text-xs sm:text-sm font-black text-emerald-800 flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Main Body Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ======================================================= */}
          {/* TAB 1: MATERI (FOKUS UTAMA)                             */}
          {/* ======================================================= */}
          {activeTab === 'MATERI' && (
            <div className="space-y-4">
              {/* Header Info & Add Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-4 rounded-2xl border-2 border-indigo-100 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg sm:text-xl font-black text-indigo-950 font-['Fredoka',sans-serif]">
                      Materi Pembelajaran Saya
                    </h4>
                    <span className="text-[11px] font-black bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {materiList.length} Materi Tersedia
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    Kelola materi pembelajaran untuk semua guru MI Kelas 1–6. Materi yang dibuat di sini otomatis tersimpan dan langsung tampil di petualangan siswa sesuai Kelas dan Mata Pelajaran.
                  </p>
                </div>

                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-md cursor-pointer transition transform hover:scale-105"
                >
                  <Plus size={18} />
                  <span>+ TAMBAH MATERI</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Kelas */}
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                    <span>Kelas:</span>
                    <select
                      value={filterClass}
                      onChange={(e) => {
                        sounds.playPop();
                        const val = e.target.value;
                        setFilterClass(val === 'all' ? 'all' : Number(val));
                      }}
                      className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="all">Semua Kelas</option>
                      {CLASS_GRADES.map((g) => (
                        <option key={g} value={g}>
                          Kelas {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Mapel */}
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                    <span>Mapel:</span>
                    <select
                      value={filterSubject}
                      onChange={(e) => {
                        sounds.playPop();
                        setFilterSubject(e.target.value);
                      }}
                      className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="all">Semua Mata Pelajaran</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.emoji} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari judul materi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-black cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Materi Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMateri.map((m) => {
                  const subject = subjects.find((s) => s.id === m.subjectId);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 bg-white shadow-xs space-y-3 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                      <div className="space-y-2">
                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                              Kelas {m.classGrade}
                            </span>
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center gap-1">
                              <span>{subject?.emoji || '📚'}</span>
                              <span>{subject?.name || m.subjectId}</span>
                            </span>
                          </div>

                          <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            ⭐ +{m.xpReward} XP
                          </span>
                        </div>

                        {/* Title & Status */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-base font-black text-slate-900 font-['Fredoka',sans-serif] line-clamp-1">
                              {m.title}
                            </h5>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            {m.isDemo && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-300 uppercase">
                                Contoh Demo
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                m.status === 'Draft'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              Status: {m.status || 'Aktif'}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        {m.description && (
                          <p className="text-xs font-bold text-slate-600 line-clamp-2">
                            {m.description}
                          </p>
                        )}

                        {/* Snippet Content */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-600 line-clamp-2">
                          {m.content || 'Isi materi tersedia.'}
                        </div>

                        {/* Media Indicators */}
                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                          {m.imageUrl && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <ImageIcon size={12} /> Gambar
                            </span>
                          )}
                          {m.videoUrl && (
                            <span className="flex items-center gap-1 text-purple-600">
                              <Video size={12} /> Video
                            </span>
                          )}
                          <span className="text-slate-400 ml-auto text-[10px]">
                            ID: {m.id.slice(0, 14)}...
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            sounds.playPop();
                            setPreviewMateri(m);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer transition"
                          title="Pratinjau tampilan siswa"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1 cursor-pointer transition"
                          title="Edit materi"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            sounds.playPop();
                            setDeletingMateri(m);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black flex items-center gap-1 cursor-pointer transition"
                          title="Hapus materi"
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredMateri.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                    <span className="text-4xl">📚</span>
                    <h5 className="text-base font-black text-slate-800 mt-2 font-['Fredoka',sans-serif]">
                      Tidak ada materi yang sesuai
                    </h5>
                    <p className="text-xs text-slate-500 font-bold max-w-md mx-auto mt-1">
                      {searchQuery || filterClass !== 'all' || filterSubject !== 'all'
                        ? 'Coba sesuaikan filter kelas, mata pelajaran, atau kata kunci pencarian Anda.'
                        : 'Belum ada materi yang dibuat. Klik "+ TAMBAH MATERI" untuk menambahkan materi baru.'}
                    </p>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} />
                      <span>+ Tambah Materi Baru</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2: GAME (MODUL GAME EDUKASI)                        */}
          {/* ======================================================= */}
          {activeTab === 'GAME' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 p-5 rounded-3xl border-2 border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm">
                    🎮
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-emerald-950 font-['Fredoka',sans-serif]">
                      Modul Game Pembelajaran
                    </h4>
                    <p className="text-xs font-bold text-emerald-800">
                      Arena tantangan game interaktif untuk mengasah pemahaman siswa secara menyenangkan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 text-center space-y-3">
                <span className="text-3xl">🧩</span>
                <h5 className="text-base font-black text-slate-800 font-['Fredoka',sans-serif]">
                  Fokus Pengujian: Modul Materi Guru → Siswa
                </h5>
                <p className="text-xs font-bold text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Sesuai instruksi pengembangan, tahap ini berfokus penuh untuk membuktikan alur:
                  <br />
                  <span className="font-black text-indigo-700">
                    GURU MEMBUAT MATERI ➔ MATERI TERSIMPAN ➔ MATERI MUNCUL DI SISI SISWA.
                  </span>
                  <br />
                  Modul game yang sudah ada di Arena Game tetap berfungsi untuk siswa.
                </p>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('MATERI');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-indigo-700"
                >
                  <BookOpen size={14} />
                  <span>Buka Kelola Materi Guru</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: MISI (MODUL MISI PETUALANGAN)                     */}
          {/* ======================================================= */}
          {activeTab === 'MISI' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 p-5 rounded-3xl border-2 border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm">
                    🔎
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-amber-950 font-['Fredoka',sans-serif]">
                      Modul Misi Petualangan Siswa
                    </h4>
                    <p className="text-xs font-bold text-amber-800">
                      Rangkaian misi bertahap (Quest) di Hutan Pengetahuan dan Desa Petualangan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 text-center space-y-3">
                <span className="text-3xl">🗺️</span>
                <h5 className="text-base font-black text-slate-800 font-['Fredoka',sans-serif]">
                  Misi Petualangan Aktif Sesuai Mata Pelajaran
                </h5>
                <p className="text-xs font-bold text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Siswa menjelajahi misi sesuai topik materi yang guru tentukan. Kelola materi terlebih dahulu pada tab Materi agar quest siswa terarah dengan baik.
                </p>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('MATERI');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-indigo-700"
                >
                  <BookOpen size={14} />
                  <span>Kembali ke Menu Materi</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: SISWA (DAFTAR & PROGRES SISWA)                   */}
          {/* ======================================================= */}
          {activeTab === 'SISWA' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-sky-100 p-5 rounded-3xl border-2 border-sky-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-2xl shadow-sm">
                    👨‍🎓
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-sky-950 font-['Fredoka',sans-serif]">
                      Data Siswa & Aktivitas Belajar
                    </h4>
                    <p className="text-xs font-bold text-sky-800">
                      Daftar siswa MI yang menjelajah di EDUVERSE.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black bg-white px-3 py-1.5 rounded-xl border border-sky-300 text-sky-900">
                  Total: {students.length} Siswa
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl">
                        {st.avatar || '🎒'}
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-slate-900 font-['Fredoka',sans-serif]">
                          {st.studentName}
                        </h5>
                        <p className="text-[11px] font-bold text-slate-500">
                          Kelas {st.classGrade} • Level {st.level}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ⭐ {st.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 5: BADGE                                            */}
          {/* ======================================================= */}
          {activeTab === 'BADGE' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-100 p-5 rounded-3xl border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-sm">
                    🏅
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-purple-950 font-['Fredoka',sans-serif]">
                      Koleksi Lencana & Prestasi
                    </h4>
                    <p className="text-xs font-bold text-purple-800">
                      Lencana penghargaan yang dapat diraih siswa setelah menyelesaikan materi dan misi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ContentStore.getBadges().map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center gap-3 shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 font-['Fredoka',sans-serif]">
                        {b.title}
                      </h5>
                      <p className="text-[11px] font-bold text-slate-500 line-clamp-2">
                        {b.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 6: PROGRESS                                         */}
          {/* ======================================================= */}
          {activeTab === 'PROGRESS' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-rose-50 via-orange-50 to-rose-100 p-5 rounded-3xl border-2 border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-sm">
                    📊
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-rose-950 font-['Fredoka',sans-serif]">
                      Statistik & Analisis Pembelajaran
                    </h4>
                    <p className="text-xs font-bold text-rose-800">
                      Ringkasan aktivitas dan partisipasi belajar siswa di seluruh kelas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center">
                  <span className="text-xs font-black text-indigo-700 block uppercase">Total Materi</span>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-950 font-['Fredoka',sans-serif]">
                    {materiList.length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
                  <span className="text-xs font-black text-emerald-700 block uppercase">Siswa Terdaftar</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Fredoka',sans-serif]">
                    {students.length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center">
                  <span className="text-xs font-black text-amber-700 block uppercase">Mata Pelajaran</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-950 font-['Fredoka',sans-serif]">
                    {subjects.length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-center">
                  <span className="text-xs font-black text-purple-700 block uppercase">Lencana Tersedia</span>
                  <span className="text-2xl sm:text-3xl font-black text-purple-950 font-['Fredoka',sans-serif]">
                    {ContentStore.getBadges().length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* MODAL FORM: TAMBAH / EDIT MATERI                          */}
        {/* ========================================================= */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 flex flex-col overflow-hidden text-slate-800">
              {/* Form Header */}
              <div className="bg-indigo-600 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    {editingMateriId ? '✏️' : '➕'}
                  </div>
                  <div>
                    <h4 className="text-lg font-black font-['Fredoka',sans-serif] text-white">
                      {editingMateriId ? 'Edit Materi Pembelajaran' : 'Tambah Materi Pembelajaran'}
                    </h4>
                    <p className="text-xs text-indigo-100 font-medium">
                      Isi data materi pembelajaran untuk ditampilkan pada petualangan siswa MI.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsFormOpen(false);
                  }}
                  className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSaveMateri} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* 1. Judul Materi */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span>Judul Materi <span className="text-rose-500">*</span></span>
                    {formErrors.title && (
                      <span className="text-[11px] font-black text-rose-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.title}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Operasi Pecahan / Siklus Air di Sekitarku"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition ${
                      formErrors.title ? 'border-rose-400 bg-rose-50' : 'border-slate-300 focus:border-indigo-500'
                    }`}
                  />
                </div>

                {/* 2. Kelas & Mata Pelajaran */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Pilihan Kelas */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>Kelas <span className="text-rose-500">*</span></span>
                      {formErrors.classGrade && (
                        <span className="text-[11px] font-black text-rose-600">
                          {formErrors.classGrade}
                        </span>
                      )}
                    </label>
                    <select
                      value={formData.classGrade}
                      onChange={(e) => {
                        sounds.playPop();
                        setFormData({
                          ...formData,
                          classGrade: Number(e.target.value) as ClassGrade,
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs sm:text-sm font-bold bg-white focus:outline-none"
                    >
                      {CLASS_GRADES.map((g) => (
                        <option key={g} value={g}>
                          Kelas {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pilihan Mata Pelajaran */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700">
                        Mata Pelajaran <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setIsAddingNewSubject(!isAddingNewSubject);
                        }}
                        className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        {isAddingNewSubject ? 'Batal Tambah Mapel' : '+ Tambah Mapel Baru'}
                      </button>
                    </div>

                    {!isAddingNewSubject ? (
                      <select
                        value={formData.subjectId}
                        onChange={(e) => {
                          sounds.playPop();
                          setFormData({ ...formData, subjectId: e.target.value });
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs sm:text-sm font-bold bg-white focus:outline-none"
                      >
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.emoji} {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-300 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Nama Mata Pelajaran Baru (misal: Robotika MI)"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Emoji"
                            value={newSubjectEmoji}
                            onChange={(e) => setNewSubjectEmoji(e.target.value)}
                            className="w-14 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-center font-bold"
                          />
                        </div>
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setIsAddingNewSubject(false)}
                            className="px-2.5 py-1 text-xs font-bold text-slate-600 cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateNewSubject}
                            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-black cursor-pointer shadow-xs"
                          >
                            Simpan Mapel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Deskripsi Singkat */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">
                    Deskripsi Ringkas (Rangkuman untuk Kartu Materi)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan gambaran umum materi secara singkat..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs sm:text-sm font-bold focus:outline-none resize-none"
                  />
                </div>

                {/* 4. Isi Materi (WAJIB) */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span>Isi Materi Pembelajaran <span className="text-rose-500">*</span></span>
                    {formErrors.content && (
                      <span className="text-[11px] font-black text-rose-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.content}
                      </span>
                    )}
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tuliskan isi materi lengkap yang akan dibaca siswa. Jelaskan konsep, langkah-langkah, rumus, atau contoh-contoh dalam kehidupan sehari-hari..."
                    value={formData.content}
                    onChange={(e) => {
                      setFormData({ ...formData, content: e.target.value });
                      if (formErrors.content) setFormErrors({ ...formErrors, content: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-medium focus:outline-none transition ${
                      formErrors.content ? 'border-rose-400 bg-rose-50' : 'border-slate-300 focus:border-indigo-500'
                    }`}
                  />
                  <p className="text-[11px] font-bold text-slate-400">
                    Tips: Gunakan nomor poin atau paragraf pendek agar siswa MI nyaman membaca di petualangan.
                  </p>
                </div>

                {/* 5. URL Gambar & URL Video */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <ImageIcon size={13} className="text-blue-600" />
                      <span>URL Gambar (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <Video size={13} className="text-purple-600" />
                      <span>URL Video (Opsional, YouTube embed/link)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/embed/..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6. XP Reward & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">
                      XP Reward untuk Siswa (Default: 20 XP)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      step={5}
                      value={formData.xpReward}
                      onChange={(e) => setFormData({ ...formData, xpReward: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs sm:text-sm font-black focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">
                      Status Materi
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'Aktif' | 'Draft',
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 focus:border-indigo-500 text-xs sm:text-sm font-black bg-white focus:outline-none"
                    >
                      <option value="Aktif">Aktif (Tampil di Sisi Siswa)</option>
                      <option value="Draft">Draft (Disimpan Sementara)</option>
                    </select>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setIsFormOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-black cursor-pointer transition"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer transition transform hover:scale-105"
                  >
                    <Save size={16} />
                    <span>💾 SIMPAN MATERI</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL KONFIRMASI HAPUS                                    */}
        {/* ========================================================= */}
        {deletingMateri && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-rose-300 p-6 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto border-2 border-rose-200">
                🗑️
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900 font-['Fredoka',sans-serif]">
                  Konfirmasi Hapus Materi
                </h4>
                <p className="text-xs font-bold text-slate-600">
                  Yakin ingin menghapus materi ini?
                </p>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 mt-2">
                  <p className="text-sm font-black text-indigo-900">
                    "{deletingMateri.title}"
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                    Kelas {deletingMateri.classGrade} • {deletingMateri.subjectId}
                  </p>
                </div>
                <p className="text-[11px] font-bold text-rose-600 pt-1">
                  Materi yang dihapus tidak akan lagi tampil di petualangan siswa.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setDeletingMateri(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-black cursor-pointer transition"
                >
                  BATAL
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-black shadow-md cursor-pointer transition"
                >
                  YA, HAPUS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL PREVIEW PENGALAMAN SISWA                            */}
        {/* ========================================================= */}
        {previewMateri && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl max-h-[92vh] bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden text-slate-800">
              {/* Preview Header Banner */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-3.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👁️</span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md">
                      Pratinjau Pengalaman Siswa
                    </span>
                    <h4 className="text-sm sm:text-base font-black font-['Fredoka',sans-serif]">
                      Seperti yang dilihat siswa di Pondok Materi
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setPreviewMateri(null);
                  }}
                  className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Preview Content Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Subject & Grade Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-200 text-amber-950 border border-amber-300">
                      Kelas {previewMateri.classGrade}
                    </span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-orange-200 text-orange-950 border border-orange-300">
                      {subjects.find((s) => s.id === previewMateri.subjectId)?.emoji || '📚'}{' '}
                      {subjects.find((s) => s.id === previewMateri.subjectId)?.name || previewMateri.subjectId}
                    </span>
                  </div>

                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shadow-xs">
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>Hadiah: +{previewMateri.xpReward} XP</span>
                  </span>
                </div>

                {/* Judul Materi */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-950 font-['Fredoka',sans-serif] leading-tight">
                    {previewMateri.title}
                  </h3>
                  {previewMateri.description && (
                    <p className="text-xs sm:text-sm font-bold text-amber-900/80 mt-1">
                      {previewMateri.description}
                    </p>
                  )}
                </div>

                {/* Gambar Materi jika ada */}
                {previewMateri.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm max-h-56">
                    <img
                      src={previewMateri.imageUrl}
                      alt={previewMateri.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Video Pembelajaran jika ada */}
                {previewMateri.videoUrl && (
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-purple-900">
                      <Video size={14} className="text-purple-600" />
                      <span>Video Pembelajaran Siswa</span>
                    </div>
                    {previewMateri.videoUrl.includes('embed') ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5">
                        <iframe
                          src={previewMateri.videoUrl}
                          title={previewMateri.title}
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-purple-50 rounded-xl text-xs font-bold text-purple-800 flex items-center justify-between">
                        <span>Link Video: {previewMateri.videoUrl}</span>
                        <a
                          href={previewMateri.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-purple-600 text-white font-black text-[11px]"
                        >
                          Buka Video
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Isi Materi Lengkap */}
                <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-200/80 shadow-xs space-y-3">
                  <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-amber-700" />
                    <span>Isi Materi Pembelajaran:</span>
                  </h5>
                  <div className="text-xs sm:text-sm font-medium text-slate-700 whitespace-pre-line leading-relaxed">
                    {previewMateri.content || previewMateri.description || 'Belum ada uraian isi materi.'}
                  </div>
                </div>

                {/* Kartu Belajar Poin (jika ada) */}
                {previewMateri.cards && previewMateri.cards.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                      Rangkuman Poin Belajar:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewMateri.cards.map((c, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1 shadow-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{c.emoji || '📖'}</span>
                            <span className="font-black text-slate-800">{c.title}</span>
                          </div>
                          <p className="text-slate-600 font-medium text-[11px] line-clamp-2">
                            {c.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Footer Actions */}
              <div className="p-4 bg-amber-100/80 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setPreviewMateri(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-slate-700 text-xs font-black hover:bg-amber-50 cursor-pointer"
                >
                  Tutup Pratinjau
                </button>

                <button
                  onClick={() => {
                    sounds.playCorrect();
                    const targetMateri = previewMateri;
                    setPreviewMateri(null);
                    onClose();
                    if (onStartStudentLesson) {
                      onStartStudentLesson(targetMateri);
                    } else if (onPreviewMateri) {
                      onPreviewMateri(targetMateri);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-md cursor-pointer transition transform hover:scale-105"
                >
                  <Play size={16} />
                  <span>Mulai Belajar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
