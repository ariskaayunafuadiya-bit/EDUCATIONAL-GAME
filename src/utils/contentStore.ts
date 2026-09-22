import {
  ClassGrade,
  SubjectItem,
  MateriItem,
  GameItem,
  MisiItem,
  BadgeItem,
  TeacherAccount,
  StudentProgress,
} from '../types';

export const CLASS_GRADES: { grade: ClassGrade; label: string; icon: string; description: string }[] = [
  { grade: 1, label: 'Kelas 1', icon: '🌱', description: 'Tahap Pengenalan & Petualangan Awal' },
  { grade: 2, label: 'Kelas 2', icon: '🌿', description: 'Langkah Awal Membaca & Menghitung Ceria' },
  { grade: 3, label: 'Kelas 3', icon: '🌳', description: 'Menjelajah Ragam Pengetahuan Baru' },
  { grade: 4, label: 'Kelas 4', icon: '🌲', description: 'Petualang Cerdas Eksplorasi Sains & Logika' },
  { grade: 5, label: 'Kelas 5', icon: '🏔️', description: 'Tantangan Penyelidikan Konsep Mandiri' },
  { grade: 6, label: 'Kelas 6', icon: '🏰', description: 'Master Eduverse & Kesiapan Lanjutan' },
];

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  {
    id: 'ipas',
    name: 'IPAS',
    emoji: '🔬',
    color: 'emerald',
    description: 'Ilmu Pengetahuan Alam dan Sosial di sekitar kita',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'matematika',
    name: 'Matematika',
    emoji: '📐',
    color: 'blue',
    description: 'Belajar berhitung, logika pecahan, dan geometri seru',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'bahasa_indonesia',
    name: 'Bahasa Indonesia',
    emoji: '📖',
    color: 'amber',
    description: 'Membaca, menulis, struktur kalimat, dan bercerita',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'pai',
    name: 'PAI',
    emoji: '🕌',
    color: 'teal',
    description: 'Pendidikan Agama Islam, budi pekerti, dan ibadah',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'akidah_akhlak',
    name: 'Akidah Akhlak',
    emoji: '🕊️',
    color: 'cyan',
    description: 'Menanamkan keyakinan kokoh dan perilaku mulia',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'fikih',
    name: 'Fikih',
    emoji: '📜',
    color: 'indigo',
    description: 'Tata cara ibadah salat, wudu, dan hukum Islam',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'quran_hadis',
    name: "Qur'an Hadis",
    emoji: '📗',
    color: 'emerald',
    description: 'Membaca, menghafal, dan memahami firman Allah',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'ski',
    name: 'SKI',
    emoji: '🏺',
    color: 'stone',
    description: 'Sejarah Kebudayaan Islam dan kisah para sahabat',
    availableGrades: [3, 4, 5, 6],
  },
  {
    id: 'bahasa_arab',
    name: 'Bahasa Arab',
    emoji: '🕋',
    color: 'orange',
    description: 'Kosakata bahasa surga dan percakapan harian',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'bahasa_inggris',
    name: 'Bahasa Inggris',
    emoji: '🌍',
    color: 'purple',
    description: 'English vocabulary and interactive daily phrases',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'seni',
    name: 'Seni Budaya',
    emoji: '🎨',
    color: 'rose',
    description: 'Menggambar, melipat, musik, dan karya kreatif',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'pjok',
    name: 'PJOK',
    emoji: '⚽',
    color: 'red',
    description: 'Pendidikan Jasmani, Olahraga, dan Kesehatan tubuh',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'bahasa_jawa',
    name: 'Bahasa Jawa',
    emoji: '🎭',
    color: 'yellow',
    description: 'Unggah-ungguh basa lan kabudayan nusantara',
    availableGrades: [1, 2, 3, 4, 5, 6],
  },
];

export const DEFAULT_BADGES: BadgeItem[] = [
  {
    id: 'badge_pemula',
    title: 'Penjelajah Pemula',
    description: 'Memulai langkah petualangan pertama di EDUVERSE',
    icon: '🌱',
    category: 'Eksplorasi',
  },
  {
    id: 'badge_detektif_energi',
    title: 'Detektif Energi',
    description: 'Menemukan dan mengklasifikasi benda berenergi listrik dengan tepat',
    icon: '🔎',
    category: 'IPAS',
  },
  {
    id: 'badge_matematika',
    title: 'Master Matematika',
    description: 'Menyelesaikan tantangan operasi pecahan dengan nilai sempurna',
    icon: '⭐',
    category: 'Matematika',
  },
  {
    id: 'badge_bahasa',
    title: 'Detektif Bahasa',
    description: 'Menganalisis kalimat transitif dan intransitif dengan cermat',
    icon: '📚',
    category: 'Bahasa Indonesia',
  },
  {
    id: 'badge_akhlak',
    title: 'Bintang Akhlak',
    description: 'Memahami nilai kejujuran dan amanah dalam kehidupan sehari-hari',
    icon: '🕌',
    category: 'PAI',
  },
  {
    id: 'badge_rajin',
    title: 'Rajin Belajar',
    description: 'Mempelajari 3 materi pelajaran berbeda di Hutan Pengetahuan',
    icon: '📖',
    category: 'Umum',
  },
  {
    id: 'badge_juara_misi',
    title: 'Juara Misi',
    description: 'Menyelesaikan seluruh misi petualangan dengan gemilang',
    icon: '🏆',
    category: 'Misi',
  },
  {
    id: 'badge_petualang_hebat',
    title: 'Petualang Hebat',
    description: 'Mencapai lebih dari 100 XP di dunia EDUVERSE',
    icon: '👑',
    category: 'Pencapaian',
  },
];

export const DEFAULT_TEACHERS: TeacherAccount[] = [
  {
    id: 'teacher_siti',
    name: 'Bu Siti Aminah, S.Pd.',
    email: 'siti.aminah@eduverse.mi.id',
    school: 'MI Unggulan Al-Fattah',
    subjectSpecialty: 'Guru Kelas 4 & Tematik IPAS',
    avatar: '👩‍🏫',
  },
  {
    id: 'teacher_ahmad',
    name: 'Pak Ahmad Fauzi, S.Pd.I.',
    email: 'ahmad.fauzi@eduverse.mi.id',
    school: 'MI Unggulan Al-Fattah',
    subjectSpecialty: 'Guru Matematika & PAI',
    avatar: '👨‍🏫',
  },
];

export const DEFAULT_MATERI: MateriItem[] = [
  // 1. KELAS 4 MATEMATIKA: Operasi Pecahan (CONTOH DEMO)
  {
    id: 'materi_mat_pecahan',
    contentId: 'materi_mat_pecahan',
    teacherId: 'teacher_siti',
    classGrade: 4,
    classId: 4,
    subjectId: 'matematika',
    title: 'Operasi Pecahan',
    description: 'Belajar konsep pembilang, penyebut, pecahan senilai, dan penjumlahan pecahan berpenyebut sama.',
    content: `Pecahan adalah bagian dari suatu kesatuan yang utuh.

1. Mengenal Pembilang dan Penyebut
Jika satu loyang pizza dipotong menjadi 4 bagian sama besar, maka 1 potong bernilai 1/4.
- Angka di atas (1) disebut Pembilang: menunjukkan jumlah bagian yang diambil.
- Angka di bawah (4) disebut Penyebut: menunjukkan total seluruh bagian utuh.

2. Pecahan Senilai
Pecahan senilai adalah pecahan yang memiliki nilai sama meski angka pembilang dan penyebutnya berbeda.
Contoh: 1/2 senilai dengan 2/4 dan 4/8.
Cara mudah mencari pecahan senilai: kalikan atau bagilah pembilang dan penyebut dengan angka yang sama!

3. Penjumlahan Pecahan Berpenyebut Sama
Jika penyebut kedua pecahan sudah sama, kita cukup menjumlahkan angka pembilangnya saja. Penyebutnya tetap!
Rumus: a/c + b/c = (a + b) / c
Contoh: 1/5 + 2/5 = (1 + 2) / 5 = 3/5.`,
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    xpReward: 20,
    status: 'Aktif',
    isDemo: true,
    order: 1,
    active: true,
    createdAt: '2026-09-01T08:00:00Z',
    cards: [
      {
        id: 'mat_c1',
        title: 'Mengenal Pembilang dan Penyebut Pecahan.',
        subtitle: 'Bagian 1 • Konsep Dasar Pecahan',
        emoji: '🍕',
        explanation: 'Pecahan adalah bagian dari kesatuan utuh. Jika satu loyang pizza dipotong menjadi 4 bagian sama besar, 1 potong bernilai 1/4.',
        points: [
          'Angka di atas disebut Pembilang (jumlah bagian yang diambil).',
          'Angka di bawah disebut Penyebut (jumlah seluruh bagian utuh).',
          'Contoh: Pada 3/4, pembilang adalah 3 dan penyebut adalah 4.',
        ],
      },
      {
        id: 'mat_c2',
        title: 'Memahami Pecahan Senilai.',
        subtitle: 'Bagian 2 • Pecahan yang Bernilai Sama',
        emoji: '⚖️',
        explanation: 'Pecahan senilai adalah pecahan yang memiliki nilai sama meski pembilang dan penyebutnya berbeda angka.',
        points: [
          '1/2 senilai dengan 2/4 dan 4/8.',
          'Cara mencari: Kalikan atau bagilah pembilang dan penyebut dengan angka yang sama!',
          'Contoh: (1 x 2) / (2 x 2) = 2/4.',
        ],
      },
      {
        id: 'mat_c3',
        title: 'Penjumlahan Pecahan Berpenyebut Sama.',
        subtitle: 'Bagian 3 • Operasi Penjumlahan',
        emoji: '➕',
        explanation: 'Jika penyebutnya sudah sama, kita cukup menjumlahkan angka pembilangnya saja. Penyebutnya tetap tidak dijumlahkan!',
        points: [
          'Rumus: a/c + b/c = (a + b) / c.',
          'Contoh: 1/5 + 2/5 = (1 + 2) / 5 = 3/5.',
          'Penyebut tetap 5, tidak dijumlahkan menjadi 10!',
        ],
      },
    ],
  },

  // 2. KELAS 4 IPAS: Energi di Sekitarku (CONTOH DEMO)
  {
    id: 'materi_ipas_energi',
    contentId: 'materi_ipas_energi',
    teacherId: 'teacher_siti',
    classGrade: 4,
    classId: 4,
    subjectId: 'ipas',
    title: 'Energi di Sekitarku',
    description: 'Mengenal bentuk-bentuk energi, perubahannya, dan pemanfaatannya dalam kehidupan sehari-hari.',
    content: `Energi adalah kemampuan untuk melakukan usaha atau kerja. Energi tidak dapat diciptakan atau dimusnahkan, tetapi dapat diubah dari satu bentuk ke bentuk yang lain.

1. Sumber Energi Utama di Bumi
Matahari adalah sumber energi terbesar bagi bumi. Cahaya dan panas matahari membantu fotosintesis tanaman, menerangi bumi, dan menjaga suhu kehidupan.

2. Ragam Bentuk Energi
- Energi Panas (Kalor): Dihasilkan dari api, sinar matahari, atau gesekan.
- Energi Gerak (Kinetik): Dimiliki benda yang bergerak seperti angin dan air mengalir.
- Energi Listrik: Mengalir melalui rangkaian kabel untuk menyalakan perangkat elektronik.
- Energi Kimia: Tersimpan dalam bahan makanan dan baterai.

3. Perubahan Bentuk Energi
- Listrik menjadi Gerak: Kipas angin dan blender.
- Listrik menjadi Panas: Setrika dan penanak nasi.
- Listrik menjadi Cahaya dan Suara: Televisi dan smartphone.
- Kimia menjadi Gerak: Makanan yang kita makan diubah menjadi tenaga untuk berjalan dan belajar.`,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    xpReward: 20,
    status: 'Aktif',
    isDemo: true,
    order: 2,
    active: true,
    createdAt: '2026-09-02T08:00:00Z',
    cards: [
      {
        id: 'c1',
        title: 'Matahari adalah sumber energi terbesar di bumi.',
        subtitle: 'Bagian 1 • Sumber Energi Utama',
        emoji: '☀️',
        explanation: 'Matahari memancarkan energi cahaya dan energi panas yang sangat melimpah bagi seluruh kehidupan makhluk hidup di bumi.',
        points: [
          'Membantu tumbuhan melakukan fotosintesis.',
          'Menerangi bumi di siang hari.',
          'Menghangatkan bumi dan mengeringkan pakaian.',
        ],
      },
      {
        id: 'c2',
        title: 'Bentuk-bentuk energi di sekitar kita.',
        subtitle: 'Bagian 2 • Ragam Energi',
        emoji: '⚡',
        explanation: 'Energi hadir dalam berbagai ragam bentuk yang bermanfaat untuk menopang kehidupan manusia.',
        points: [
          'Energi Panas: Api unggun, setrika, sinar mentari.',
          'Energi Gerak: Angin berhembus, aliran air terjun.',
          'Energi Listrik: Mengalir melalui kabel instalasi rumah.',
          'Energi Kimia: Baterai, makanan bergizi sehari-hari.',
        ],
      },
      {
        id: 'c3',
        title: 'Perubahan bentuk energi.',
        subtitle: 'Bagian 3 • Transformasi Energi',
        emoji: '🔄',
        explanation: 'Salah satu keajaiban sains adalah energi dapat berubah bentuk untuk membantu dan meringankan pekerjaan manusia.',
        points: [
          'Listrik ➔ Cahaya & Suara (Televisi).',
          'Listrik ➔ Gerak (Kipas angin, blender).',
          'Listrik ➔ Panas (Rice cooker, setrika).',
          'Kimia ➔ Gerak (Makanan menjadi energi tubuh kita).',
        ],
      },
    ],
  },

  // 3. KELAS 4 BAHASA INDONESIA: Kalimat Transitif dan Intransitif (CONTOH DEMO)
  {
    id: 'materi_bind_kalimat',
    contentId: 'materi_bind_kalimat',
    teacherId: 'teacher_siti',
    classGrade: 4,
    classId: 4,
    subjectId: 'bahasa_indonesia',
    title: 'Kalimat Transitif dan Intransitif',
    description: 'Mengenal struktur pola kalimat SPOK serta perbedaan kalimat yang membutuhkan objek dan tanpa objek.',
    content: `Dalam bahasa Indonesia, kalimat yang baik tersusun dari unsur Subjek (S), Predikat (P), Objek (O), dan Keterangan (K).

1. Kalimat Transitif
Kalimat transitif adalah kalimat yang predikatnya (kata kerja) MEMERLUKAN Objek (O).
Jika objek dihilangkan, kalimat tersebut menjadi rancu atau belum selesai.
Contoh:
- "Rafi membaca (P) buku cerita (O)." -> Tanpa 'buku cerita', kita bingung apa yang dibaca Rafi.
- "Ibu memasak (P) sayur bayam (O)."
- "Alya meminjam (P) penggaris (O)."

2. Kalimat Intransitif
Kalimat intransitif adalah kalimat yang kata kerjanya TIDAK MEMERLUKAN Objek. Maknanya sudah utuh dan jelas, biasanya dapat langsung diikuti keterangan tempat, waktu, atau cara.
Contoh:
- "Adik tertawa terbahak-bahak."
- "Burung dara terbang tinggi di angkasa."
- "Rafi tidur di kamar."

3. Tips Detektif Bahasa
Tanyakan "Apa?" atau "Siapa?" setelah kata kerja:
- Jika ada bendanya: Transitif! (Misal: "Alya menulis ... apa? Surat.")
- Jika tidak ada bendanya: Intransitif! (Misal: "Alya menangis ... menangis apa? Tidak ada bendanya.")`,
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    xpReward: 20,
    status: 'Aktif',
    isDemo: true,
    order: 3,
    active: true,
    createdAt: '2026-09-03T08:00:00Z',
    cards: [
      {
        id: 'bind_c1',
        title: 'Mengenal Pola Kalimat Lengkap (SPOK).',
        subtitle: 'Bagian 1 • Struktur Kalimat',
        emoji: '📝',
        explanation: 'Sebuah kalimat yang baik tersusun dari unsur Subjek (pelaku), Predikat (tindakan/kata kerja), Objek (yang dikenai tindakan), dan Keterangan.',
        points: [
          'Subjek (S): Siapa yang melakukan (Contoh: Alya).',
          'Predikat (P): Aktivitas yang dikerjakan (Contoh: membaca).',
          'Objek (O): Benda yang dikenai aktivitas (Contoh: buku cerita).',
          'Keterangan (K): Tempat atau waktu (Contoh: di perpustakaan).',
        ],
      },
      {
        id: 'bind_c2',
        title: 'Kalimat Transitif (Memerlukan Objek).',
        subtitle: 'Bagian 2 • Kalimat Berobjek',
        emoji: '🎯',
        explanation: 'Kalimat transitif adalah kalimat yang predikatnya berupa kata kerja yang WAJIB memiliki objek agar maknanya lengkap.',
        points: [
          'Contoh 1: "Rafi menendang bola." (Bola adalah Objek).',
          'Contoh 2: "Ibu memasak nasi goreng." (Nasi goreng adalah Objek).',
          'Jika objek dihilangkan ("Rafi menendang"), kalimat terasa tidak lengkap.',
        ],
      },
      {
        id: 'bind_c3',
        title: 'Kalimat Intransitif (Tanpa Objek).',
        subtitle: 'Bagian 3 • Kalimat Tanpa Objek',
        emoji: '🚶',
        explanation: 'Kalimat intransitif adalah kalimat yang kata kerjanya TIDAK memerlukan objek, maknanya sudah jelas dan dapat langsung diberi keterangan.',
        points: [
          'Contoh 1: "Adik menangis tersedu-sedu." (Tidak butuh objek).',
          'Contoh 2: "Burung merpati terbang tinggi." (Tinggi adalah Keterangan cara).',
          'Contoh 3: "Alya tersenyum ramah."',
        ],
      },
    ],
  },
];

export const DEFAULT_GAMES: GameItem[] = [
  // 1. Game Detektif Energi (IPAS Kelas 4)
  {
    id: 'game_ipas_energi',
    teacherId: 'teacher_siti',
    classGrade: 4,
    subjectId: 'ipas',
    title: 'Detektif Energi',
    instruction: 'Penjaga Hutan Pengetahuan membutuhkan bantuanmu! Temukan 4 benda di bawah ini yang menggunakan energi listrik.',
    type: 'detective',
    xpReward: 30,
    badgeRewardId: 'badge_detektif_energi',
    difficulty: 'mudah',
    active: true,
    createdAt: '2026-09-01T08:00:00Z',
    detectiveItems: [
      {
        id: 'lampu',
        name: 'Lampu',
        emoji: '💡',
        isCorrect: true,
        explanation: 'Lampu menggunakan energi listrik dari aliran arus kabel untuk menyalakan filamen/LED dan menerangi ruangan.',
      },
      {
        id: 'kipas',
        name: 'Kipas',
        emoji: '🌀',
        isCorrect: true,
        explanation: 'Kipas menggunakan energi listrik untuk memutar motor dinamo baling-baling dan menghasilkan angin sejuk.',
      },
      {
        id: 'televisi',
        name: 'Televisi',
        emoji: '📺',
        isCorrect: true,
        explanation: 'Televisi membutuhkan energi listrik untuk menyalakan panel layar bergambar dan pengeras suara.',
      },
      {
        id: 'senter',
        name: 'Senter',
        emoji: '🔦',
        isCorrect: true,
        explanation: 'Senter menggunakan energi listrik kimia yang tersimpan di dalam batu baterai untuk menyalakan bohlam.',
      },
      {
        id: 'sepeda',
        name: 'Sepeda',
        emoji: '🚲',
        isCorrect: false,
        explanation: 'Sepeda bergerak menggunakan energi otot dari kayuhan kaki kita, bukan mengalirkan energi listrik!',
      },
      {
        id: 'buku',
        name: 'Buku',
        emoji: '📖',
        isCorrect: false,
        explanation: 'Buku adalah benda dari kertas yang kita baca dengan mata, tidak membutuhkan aliran energi listrik.',
      },
    ],
  },

  // 2. Game Kuis Pecahan Juara (Matematika Kelas 4)
  {
    id: 'game_mat_pecahan',
    teacherId: 'teacher_ahmad',
    classGrade: 4,
    subjectId: 'matematika',
    title: 'Kuis Tantangan Pecahan Juara',
    instruction: 'Bantu para penjelajah memecahkan teka-teki pecahan untuk membuka gerbang misteri matematika!',
    type: 'quiz',
    xpReward: 30,
    badgeRewardId: 'badge_matematika',
    difficulty: 'sedang',
    active: true,
    createdAt: '2026-09-02T08:00:00Z',
    questions: [
      {
        id: 'q_mat_1',
        question: 'Pada pecahan 3/8, angka 3 berkedudukan sebagai apa?',
        options: ['Penyebut', 'Pembilang', 'Pangkat', 'Pengali'],
        correctIndex: 1,
        explanation: 'Angka di atas tanda garis pecahan adalah Pembilang, sedangkan angka di bawahnya adalah Penyebut.',
      },
      {
        id: 'q_mat_2',
        question: 'Pecahan berikut yang senilai dengan 1/2 adalah ...',
        options: ['2/3', '3/6', '2/5', '1/4'],
        correctIndex: 1,
        explanation: '1/2 jika dikalikan 3 pada pembilang dan penyebut menjadi: (1x3)/(2x3) = 3/6. Jadi 3/6 senilai dengan 1/2.',
      },
      {
        id: 'q_mat_3',
        question: 'Berapakah hasil dari 2/7 + 3/7 ?',
        options: ['5/14', '6/7', '5/7', '1/7'],
        correctIndex: 2,
        explanation: 'Pada penjumlahan pecahan berpenyebut sama, cukup jumlahkan pembilangnya: 2 + 3 = 5, penyebut tetap 7, sehingga hasilnya 5/7.',
      },
      {
        id: 'q_mat_4',
        question: 'Ibu membagi martabak manis menjadi 8 potong sama besar. Alya mengambil 2 potong. Bagian yang diambil Alya adalah ...',
        options: ['1/8', '2/8', '2/4', '8/2'],
        correctIndex: 1,
        explanation: '2 potong yang diambil dari 8 potongan keseluruhan bernilai pecahan 2/8 (dapat disederhanakan menjadi 1/4).',
      },
    ],
  },

  // 3. Game Kuis Detektif Bahasa (Bahasa Indonesia Kelas 4)
  {
    id: 'game_bind_kalimat',
    teacherId: 'teacher_siti',
    classGrade: 4,
    subjectId: 'bahasa_indonesia',
    title: 'Kuis Detektif Kalimat',
    instruction: 'Pilihlah analisis yang tepat untuk setiap kalimat agar menjadi ahli tata bahasa madrasah!',
    type: 'quiz',
    xpReward: 30,
    badgeRewardId: 'badge_bahasa',
    difficulty: 'sedang',
    active: true,
    createdAt: '2026-09-03T08:00:00Z',
    questions: [
      {
        id: 'q_bind_1',
        question: 'Kalimat manakah di bawah ini yang merupakan contoh KALIMAT TRANSITIF (memerlukan objek)?',
        options: ['Rafi tertawa terbahak-bahak.', 'Alya meminjam buku ensiklopedia.', 'Kucing itu tidur lelap.', 'Hujan turun dengan deras.'],
        correctIndex: 1,
        explanation: 'Kalimat "Alya meminjam buku ensiklopedia" memiliki Objek yaitu "buku ensiklopedia" yang dikenai kata kerja "meminjam".',
      },
      {
        id: 'q_bind_2',
        question: 'Pada kalimat "Adik menangis di kamar tidur", kata "di kamar tidur" berfungsi sebagai ...',
        options: ['Subjek', 'Predikat', 'Objek', 'Keterangan Tempat'],
        correctIndex: 3,
        explanation: '"di kamar tidur" menunjukkan lokasi tempat terjadinya peristiwa, sehingga berfungsi sebagai Keterangan Tempat.',
      },
      {
        id: 'q_bind_3',
        question: 'Ciri utama dari kalimat intransitif adalah ...',
        options: ['Tidak memerlukan objek', 'Wajib mempunyai objek', 'Harus sangat panjang', 'Tidak boleh ada kata kerja'],
        correctIndex: 0,
        explanation: 'Kalimat intransitif menggunakan kata kerja yang maknanya sudah utuh tanpa membutuhkan objek sasaran.',
      },
    ],
  },

  // 4. Game Kuis Bintang Akhlak (PAI Kelas 4)
  {
    id: 'game_pai_akhlak',
    teacherId: 'teacher_ahmad',
    classGrade: 4,
    subjectId: 'pai',
    title: 'Kuis Bintang Akhlak Mulia',
    instruction: 'Uji pemahamanmu tentang akhlak terpuji jujur dan amanah dalam kehidupan sehari-hari!',
    type: 'quiz',
    xpReward: 30,
    badgeRewardId: 'badge_akhlak',
    difficulty: 'mudah',
    active: true,
    createdAt: '2026-09-04T08:00:00Z',
    questions: [
      {
        id: 'q_pai_1',
        question: 'Gelar "Al-Amin" yang diberikan oleh penduduk Makkah kepada Nabi Muhammad SAW memiliki arti ...',
        options: ['Yang gagah perkasa', 'Orang yang jujur dan dapat dipercaya', 'Raja yang adil', 'Pemimpin yang kaya'],
        correctIndex: 1,
        explanation: 'Al-Amin artinya orang yang jujur, amanah, dan dapat dipercaya dalam segala ucapan dan tindakannya.',
      },
      {
        id: 'q_pai_2',
        question: 'Jika kamu meminjam buku cerita milik teman dan tidak sengaja terlipat, tindakan yang paling jujur dan amanah adalah ...',
        options: [
          'Menyembunyikannya dan pura-pura lupa',
          'Mengembalikan sambil berkata jujur, meminta maaf, dan merapikannya',
          'Menyalahkan teman lain',
          'Membeli buku baru diam-diam tanpa bilang',
        ],
        correctIndex: 1,
        explanation: 'Mengakui keadaan yang sebenarnya, meminta maaf secara tulus, dan berusaha bertanggung jawab adalah cermin sikap jujur dan amanah.',
      },
      {
        id: 'q_pai_3',
        question: 'Salah satu manfaat membiasakan perilaku jujur sejak kecil adalah ...',
        options: ['Disukai banyak teman dan disayangi Allah SWT', 'Menjadi sombong', 'Dijauhi keluarga', 'Mudah berbohong'],
        correctIndex: 0,
        explanation: 'Kejujuran membawa keberkahan, membuat hati tenang, dan mendatangkan cinta dari Allah SWT serta sesama manusia.',
      },
    ],
  },
];

export const DEFAULT_MISI: MisiItem[] = [
  {
    id: 'misi_ipas_1',
    teacherId: 'teacher_siti',
    classGrade: 4,
    subjectId: 'ipas',
    title: 'Misi Detektif Energi Listrik',
    description: 'Bantu Penjaga Hutan Pengetahuan mengidentifikasi dan mengelompokkan peralatan listrik di sekitarmu.',
    challenge: 'Kunjungi Pos Detektif dan pilih 4 benda yang membutuhkan energi listrik untuk bekerja.',
    xpReward: 30,
    badgeRewardId: 'badge_detektif_energi',
    active: true,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'misi_mat_1',
    teacherId: 'teacher_ahmad',
    classGrade: 4,
    subjectId: 'matematika',
    title: 'Misi Pecahan Juara',
    description: 'Taklukkan tantangan teka-teki pecahan senilai di Arena Game.',
    challenge: 'Jawab benar seluruh soal pecahan senilai dan penjumlahan pecahan berpenyebut sama.',
    xpReward: 30,
    badgeRewardId: 'badge_matematika',
    active: true,
    createdAt: '2026-09-02T08:00:00Z',
  },
  {
    id: 'misi_bind_1',
    teacherId: 'teacher_siti',
    classGrade: 4,
    subjectId: 'bahasa_indonesia',
    title: 'Misi Analisis Kalimat Santun',
    description: 'Analisis kalimat berobjek dan tanpa objek pada petualangan membaca.',
    challenge: 'Selesaikan Kuis Detektif Kalimat dan raih lencana Detektif Bahasa.',
    xpReward: 30,
    badgeRewardId: 'badge_bahasa',
    active: true,
    createdAt: '2026-09-03T08:00:00Z',
  },
  {
    id: 'misi_pai_1',
    teacherId: 'teacher_ahmad',
    classGrade: 4,
    subjectId: 'pai',
    title: 'Misi Teladan Al-Amin',
    description: 'Pahami makna kejujuran dan amanah dalam interaksi harian.',
    challenge: 'Pelajari kartu teladan Rasulullah di Pondok Materi dan selesaikan kuis Bintang Akhlak.',
    xpReward: 30,
    badgeRewardId: 'badge_akhlak',
    active: true,
    createdAt: '2026-09-04T08:00:00Z',
  },
];

export const DEFAULT_STUDENTS: StudentProgress[] = [
  {
    id: 'stu_1',
    studentName: 'Alya Rahma',
    classGrade: 4,
    characterId: 'fatimah',
    xp: 90,
    level: 3,
    badges: ['badge_pemula', 'badge_detektif_energi'],
    completedMateriIds: ['materi_ipas_energi'],
    completedVideoIds: ['materi_ipas_energi'],
    completedGameIds: ['game_ipas_energi'],
    completedMisiIds: ['misi_ipas_1'],
    lastActive: '2026-09-21T05:30:00Z',
  },
  {
    id: 'stu_2',
    studentName: 'Rafi Al-Fatih',
    classGrade: 4,
    characterId: 'ali',
    xp: 120,
    level: 4,
    badges: ['badge_pemula', 'badge_matematika', 'badge_detektif_energi'],
    completedMateriIds: ['materi_ipas_energi', 'materi_mat_pecahan'],
    completedVideoIds: ['materi_ipas_energi'],
    completedGameIds: ['game_ipas_energi', 'game_mat_pecahan'],
    completedMisiIds: ['misi_ipas_1', 'misi_mat_1'],
    lastActive: '2026-09-21T06:00:00Z',
  },
  {
    id: 'stu_3',
    studentName: 'Fatimah Zahra',
    classGrade: 4,
    characterId: 'fatimah',
    xp: 60,
    level: 2,
    badges: ['badge_pemula', 'badge_bahasa'],
    completedMateriIds: ['materi_bind_kalimat'],
    completedVideoIds: ['materi_bind_kalimat'],
    completedGameIds: ['game_bind_kalimat'],
    completedMisiIds: ['misi_bind_1'],
    lastActive: '2026-09-20T04:15:00Z',
  },
  {
    id: 'stu_4',
    studentName: 'Bilal Habasyi',
    classGrade: 4,
    characterId: 'ali',
    xp: 50,
    level: 2,
    badges: ['badge_pemula', 'badge_akhlak'],
    completedMateriIds: ['materi_pai_akhlak'],
    completedVideoIds: ['materi_pai_akhlak'],
    completedGameIds: ['game_pai_akhlak'],
    completedMisiIds: ['misi_pai_1'],
    lastActive: '2026-09-19T08:20:00Z',
  },
];

// LocalStorage Keys
const KEYS = {
  TEACHERS: 'eduverse_platform_teachers_v1',
  CURRENT_TEACHER: 'eduverse_current_teacher_id_v1',
  SUBJECTS: 'eduverse_platform_subjects_v1',
  MATERI: 'eduverse_platform_materi_v1',
  GAMES: 'eduverse_platform_games_v1',
  MISI: 'eduverse_platform_misi_v1',
  BADGES: 'eduverse_platform_badges_v1',
  STUDENTS: 'eduverse_platform_students_v1',
};

// Storage Engine
export const ContentStore = {
  // --- Teachers ---
  getTeachers(): TeacherAccount[] {
    const raw = localStorage.getItem(KEYS.TEACHERS);
    if (!raw) {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
      return DEFAULT_TEACHERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TEACHERS;
    }
  },

  getCurrentTeacher(): TeacherAccount | null {
    const currentId = localStorage.getItem(KEYS.CURRENT_TEACHER);
    const teachers = this.getTeachers();
    if (!currentId) return teachers[0] || null; // default to first teacher for convenience
    return teachers.find((t) => t.id === currentId) || teachers[0] || null;
  },

  setCurrentTeacher(teacherId: string) {
    localStorage.setItem(KEYS.CURRENT_TEACHER, teacherId);
  },

  registerTeacher(name: string, email: string, school: string, subjectSpecialty: string): TeacherAccount {
    const teachers = this.getTeachers();
    const newTeacher: TeacherAccount = {
      id: `teacher_${Date.now()}`,
      name,
      email,
      school: school || 'Madrasah Ibtidaiyah',
      subjectSpecialty: subjectSpecialty || 'Guru Kelas',
      avatar: name.toLowerCase().includes('pak') ? '👨‍🏫' : '👩‍🏫',
    };
    teachers.push(newTeacher);
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
    this.setCurrentTeacher(newTeacher.id);
    return newTeacher;
  },

  // --- Subjects ---
  getSubjects(): SubjectItem[] {
    const raw = localStorage.getItem(KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
      return DEFAULT_SUBJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SUBJECTS;
    }
  },

  addSubject(name: string, emoji: string, color: string, description: string, availableGrades: ClassGrade[]): SubjectItem {
    const subjects = this.getSubjects();
    const id = `subj_${Date.now()}`;
    const newSubject: SubjectItem = {
      id,
      name,
      emoji: emoji || '📚',
      color: color || 'indigo',
      description,
      availableGrades: availableGrades.length ? availableGrades : [1, 2, 3, 4, 5, 6],
      isCustom: true,
    };
    subjects.push(newSubject);
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
    return newSubject;
  },

  // --- Materi ---
  getMateriList(): MateriItem[] {
    const raw = localStorage.getItem(KEYS.MATERI);
    if (!raw) {
      localStorage.setItem(KEYS.MATERI, JSON.stringify(DEFAULT_MATERI));
      return DEFAULT_MATERI;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(KEYS.MATERI, JSON.stringify(DEFAULT_MATERI));
        return DEFAULT_MATERI;
      }
      return parsed.map((m: any) => ({
        ...m,
        contentId: m.contentId || m.id,
        classId: m.classId || m.classGrade,
        status: m.status || 'Aktif',
        content: m.content || m.description || '',
      }));
    } catch {
      return DEFAULT_MATERI;
    }
  },

  getMateriByTeacher(teacherId: string): MateriItem[] {
    const all = this.getMateriList();
    // Return materials created by this teacher as well as demo examples
    return all.filter((m) => m.teacherId === teacherId || m.isDemo || m.teacherId === 'teacher_siti');
  },

  getMateriByClassAndSubject(classGrade: ClassGrade, subjectId: string): MateriItem[] {
    return this.getMateriList().filter(
      (m) => Number(m.classGrade) === Number(classGrade) && m.subjectId === subjectId && (m.active !== false)
    );
  },

  getMateriById(id: string): MateriItem | null {
    return this.getMateriList().find((m) => m.id === id) || null;
  },

  saveMateri(materi: Omit<MateriItem, 'id' | 'createdAt'> & { id?: string }): MateriItem {
    const list = this.getMateriList();
    const id = materi.id || `materi_${Date.now()}`;
    const itemToSave: MateriItem = {
      ...materi,
      id,
      contentId: materi.contentId || id,
      teacherId: materi.teacherId || 'teacher_siti',
      classGrade: Number(materi.classGrade) as ClassGrade,
      classId: Number(materi.classId || materi.classGrade) as ClassGrade,
      subjectId: materi.subjectId,
      title: materi.title.trim(),
      description: (materi.description || '').trim(),
      content: (materi.content || '').trim(),
      imageUrl: materi.imageUrl?.trim() || undefined,
      videoUrl: materi.videoUrl?.trim() || undefined,
      xpReward: Number(materi.xpReward) || 20,
      status: materi.status || 'Aktif',
      isDemo: Boolean(materi.isDemo),
      order: materi.order || 1,
      active: materi.active !== undefined ? materi.active : true,
      createdAt: (materi as any).createdAt || new Date().toISOString(),
      cards: materi.cards && materi.cards.length > 0 ? materi.cards : [
        {
          id: `c_${Date.now()}_1`,
          title: materi.title.trim(),
          subtitle: 'Materi Pembelajaran',
          emoji: '📖',
          explanation: (materi.content || materi.description || 'Pahami materi ini dengan cermat.').trim(),
          points: materi.description ? [materi.description.trim()] : ['Pahami konsep materi ini dengan seksama.'],
        },
      ],
    };

    if (materi.id) {
      const idx = list.findIndex((m) => m.id === materi.id);
      if (idx !== -1) {
        list[idx] = itemToSave;
        localStorage.setItem(KEYS.MATERI, JSON.stringify(list));
        return list[idx];
      }
    }
    list.unshift(itemToSave);
    localStorage.setItem(KEYS.MATERI, JSON.stringify(list));
    return itemToSave;
  },

  deleteMateri(id: string, _teacherId?: string): boolean {
    const list = this.getMateriList();
    const filtered = list.filter((m) => m.id !== id);
    localStorage.setItem(KEYS.MATERI, JSON.stringify(filtered));
    return true;
  },

  // --- Games ---
  getGames(classGrade?: ClassGrade, subjectId?: string): GameItem[] {
    const raw = localStorage.getItem(KEYS.GAMES);
    let all: GameItem[] = [];
    if (!raw) {
      localStorage.setItem(KEYS.GAMES, JSON.stringify(DEFAULT_GAMES));
      all = DEFAULT_GAMES;
    } else {
      try {
        all = JSON.parse(raw);
      } catch {
        all = DEFAULT_GAMES;
      }
    }
    if (classGrade !== undefined && subjectId !== undefined) {
      return all.filter((g) => g.classGrade === classGrade && g.subjectId === subjectId && g.active);
    }
    return all;
  },

  getGamesByTeacher(teacherId: string): GameItem[] {
    return this.getGames().filter((g) => g.teacherId === teacherId);
  },

  getGameByClassAndSubject(classGrade: ClassGrade, subjectId: string): GameItem | null {
    const games = this.getGames().filter(
      (g) => g.classGrade === classGrade && g.subjectId === subjectId && g.active
    );
    return games[0] || null;
  },

  getGameById(id: string): GameItem | null {
    return this.getGames().find((g) => g.id === id) || null;
  },

  saveGame(game: Omit<GameItem, 'id' | 'createdAt'> & { id?: string }): GameItem {
    const list = this.getGames();
    if (game.id) {
      const idx = list.findIndex((g) => g.id === game.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...game,
        };
        localStorage.setItem(KEYS.GAMES, JSON.stringify(list));
        return list[idx];
      }
    }
    const newItem: GameItem = {
      ...game,
      id: `game_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    localStorage.setItem(KEYS.GAMES, JSON.stringify(list));
    return newItem;
  },

  deleteGame(id: string, teacherId: string): boolean {
    const list = this.getGames();
    const filtered = list.filter((g) => !(g.id === id && g.teacherId === teacherId));
    localStorage.setItem(KEYS.GAMES, JSON.stringify(filtered));
    return true;
  },

  // --- Misi ---
  getMisiList(): MisiItem[] {
    const raw = localStorage.getItem(KEYS.MISI);
    if (!raw) {
      localStorage.setItem(KEYS.MISI, JSON.stringify(DEFAULT_MISI));
      return DEFAULT_MISI;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_MISI;
    }
  },

  getMisiByTeacher(teacherId: string): MisiItem[] {
    return this.getMisiList().filter((m) => m.teacherId === teacherId);
  },

  getMisiByClassAndSubject(classGrade: ClassGrade, subjectId: string): MisiItem | null {
    const list = this.getMisiList().filter(
      (m) => m.classGrade === classGrade && m.subjectId === subjectId && m.active
    );
    return list[0] || null;
  },

  saveMisi(misi: Omit<MisiItem, 'id' | 'createdAt'> & { id?: string }): MisiItem {
    const list = this.getMisiList();
    if (misi.id) {
      const idx = list.findIndex((m) => m.id === misi.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...misi,
        };
        localStorage.setItem(KEYS.MISI, JSON.stringify(list));
        return list[idx];
      }
    }
    const newItem: MisiItem = {
      ...misi,
      id: `misi_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    localStorage.setItem(KEYS.MISI, JSON.stringify(list));
    return newItem;
  },

  deleteMisi(id: string, teacherId: string): boolean {
    const list = this.getMisiList();
    const filtered = list.filter((m) => !(m.id === id && m.teacherId === teacherId));
    localStorage.setItem(KEYS.MISI, JSON.stringify(filtered));
    return true;
  },

  // --- Badges ---
  getBadges(): BadgeItem[] {
    const raw = localStorage.getItem(KEYS.BADGES);
    if (!raw) {
      localStorage.setItem(KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
      return DEFAULT_BADGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BADGES;
    }
  },

  // --- Students Progress ---
  getStudents(): StudentProgress[] {
    const raw = localStorage.getItem(KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_STUDENTS;
    }
  },

  saveStudentProgress(student: StudentProgress) {
    const list = this.getStudents();
    const idx = list.findIndex((s) => s.studentName.toLowerCase() === student.studentName.toLowerCase() && s.classGrade === student.classGrade);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...student, lastActive: new Date().toISOString() };
    } else {
      list.push({ ...student, lastActive: new Date().toISOString() });
    }
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
  },

  // --- Reset to initial demo content ---
  resetToDefaultData() {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
    localStorage.setItem(KEYS.MATERI, JSON.stringify(DEFAULT_MATERI));
    localStorage.setItem(KEYS.GAMES, JSON.stringify(DEFAULT_GAMES));
    localStorage.setItem(KEYS.MISI, JSON.stringify(DEFAULT_MISI));
    localStorage.setItem(KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
  },

  // --- Convenience helpers ---
  getMateri(classGrade?: ClassGrade, subjectId?: string): MateriItem[] {
    if (classGrade !== undefined && subjectId !== undefined) {
      return this.getMateriByClassAndSubject(classGrade, subjectId);
    }
    return this.getMateriList();
  },

  getMisi(classGrade?: ClassGrade, subjectId?: string): MisiItem[] {
    if (classGrade !== undefined && subjectId !== undefined) {
      const single = this.getMisiByClassAndSubject(classGrade, subjectId);
      return single ? [single] : [];
    }
    return this.getMisiList();
  },

  logoutTeacher() {
    localStorage.removeItem(KEYS.CURRENT_TEACHER);
  },
};
