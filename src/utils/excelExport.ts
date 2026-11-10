import * as XLSX from 'xlsx';
import { Recipient, HonorRole } from '../types';
import { HONOR_ROLES_CONFIG } from '../data/mockRecipients';

/**
 * Utility to export recipients data into authentic .XLSX (Microsoft Excel) workbook
 * Compliant with Pemkot Malang Kesra reporting and Indonesian administrative standards.
 */

export interface ExportXlsxOptions {
  period?: string;
  filterTitle?: string;
  includeSummarySheet?: boolean;
  includeRwSheet?: boolean;
}

export function exportRecipientsToXLSX(
  recipients: Recipient[],
  filenamePrefix: string = 'Daftar_Penerima_Insentif_Bandulan',
  options?: ExportXlsxOptions
) {
  const period = options?.period || 'November 2026';
  const wb = XLSX.utils.book_new();

  // ==========================================
  // SHEET 1: DATA MASTER PENERIMA INSENTIF
  // ==========================================
  const headers = [
    'No',
    'NIK (Dukcapil)',
    'NIK Terproteksi (UU PDP)',
    'Nama Lengkap',
    'Gelar',
    'Kategori Peran',
    'Jenis Kelamin',
    'Tempat Tanggal Lahir',
    'Alamat Rumah',
    'RT Rumah',
    'RW Rumah',
    'No. HP / WA',
    'Pendidikan Terakhir',
    'Tempat Tugas / Lembaga',
    'Alamat Lokasi Tugas',
    'Wilayah Tugas (RW)',
    'Wilayah Tugas (RT)',
    'NSPQ / NSM',
    'Nama Pimpinan Lembaga',
    'Jabatan Pimpinan',
    'Masa Pengabdian',
    'Bank Penyalur',
    'Nomor Rekening',
    'Nama Pemilik Rekening',
    'Nominal Insentif (Rp)',
    'Status Penyaluran',
    'Verifikasi Dukcapil',
    'Presensi / Sesi Dilaksanakan',
    'Target Sesi / Tugas',
    'No. Referensi / Batch',
  ];

  const dataRows = recipients.map((r, index) => [
    index + 1,
    `'${r.nik}`, // Single quote to force Excel to treat 16 digits as string without scientific notation
    r.maskedNik,
    r.nama,
    r.gelar || '-',
    r.kategoriLabel,
    r.jenisKelamin,
    r.tempatTanggalLahir,
    r.alamatRumah,
    r.rtRumah,
    r.rwRumah,
    r.telepon,
    r.pendidikanTerakhir,
    r.namaLembaga,
    r.alamatLembaga,
    r.rw,
    r.rt,
    r.nspqOrNsm || '-',
    r.pimpinanNama,
    r.pimpinanJabatan,
    r.lamaBertugas,
    r.bankPenyalur,
    `'${r.nomorRekening}`, // String to prevent leading zeros from being dropped
    r.namaPemilikRekening,
    r.nominalPerBulan,
    r.status === 'TERSALURKAN' ? 'Tersalurkan (Selesai SPJ)' :
    r.status === 'SIAP_SALUR' ? 'Siap Salur (Batch Payroll)' :
    r.status === 'MENUNGGU_VERIFIKASI' ? 'Menunggu Verifikasi Berkas' : 'Perlu Revisi Dokumen',
    r.dukcapilVerified ? 'Terverifikasi Valid' : 'Menunggu Sinkronisasi',
    r.attendance.sessionsHeld,
    r.attendance.targetSessions,
    r.referenceNumber || '-',
  ]);

  // Create worksheet with title banner rows
  const ws1Data = [
    ['PEMERINTAH KOTA MALANG - KECAMATAN SUKUN - KELURAHAN BANDULAN'],
    ['DAFTAR PENERIMA HONORARIUM / INSENTIF 5 PERAN PELAYAN MASYARAKAT'],
    [`Periode Pelaksanaan: ${period} | Tahun Anggaran 2027`],
    [`Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} | Total: ${recipients.length} Orang`],
    [], // Blank row
    headers,
    ...dataRows,
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);

  // Set column widths for Sheet 1
  ws1['!cols'] = [
    { wch: 5 },  // No
    { wch: 20 }, // NIK
    { wch: 20 }, // NIK Masked
    { wch: 28 }, // Nama
    { wch: 10 }, // Gelar
    { wch: 32 }, // Kategori Peran
    { wch: 14 }, // JK
    { wch: 24 }, // TTL
    { wch: 30 }, // Alamat
    { wch: 8 },  // RT
    { wch: 8 },  // RW
    { wch: 16 }, // Telepon
    { wch: 18 }, // Pendidikan
    { wch: 30 }, // Lembaga
    { wch: 28 }, // Alamat Lembaga
    { wch: 12 }, // Wilayah RW
    { wch: 10 }, // Wilayah RT
    { wch: 16 }, // NSPQ
    { wch: 24 }, // Pimpinan
    { wch: 20 }, // Jabatan Pimpinan
    { wch: 16 }, // Masa Pengabdian
    { wch: 16 }, // Bank
    { wch: 20 }, // No Rekening
    { wch: 26 }, // Pemilik Rekening
    { wch: 18 }, // Nominal
    { wch: 24 }, // Status
    { wch: 18 }, // Dukcapil
    { wch: 14 }, // Presensi
    { wch: 14 }, // Target
    { wch: 22 }, // Ref No
  ];

  XLSX.utils.book_append_sheet(wb, ws1, 'Data Penerima Insentif');

  // ==========================================
  // SHEET 2: REKAPITULASI PENYALURAN 5 PERAN
  // ==========================================
  const roleKeys: HonorRole[] = [
    'GURU_TPQ',
    'GURU_SEKOLAH_MINGGU',
    'PENJAGA_TEMPAT_IBADAH',
    'PERAWAT_JENAZAH',
    'PENJAGA_MAKAM',
  ];

  const summaryHeaders = [
    'No',
    'Kategori Peran Pelayan Masyarakat',
    'Target Kuota (Orang)',
    'Tersalurkan (Orang)',
    'Menunggu Salur / Siap (Orang)',
    'Perlu Revisi (Orang)',
    'Pagu Anggaran (Rp)',
    'Realisasi Tersalurkan (Rp)',
    'Sisa Anggaran (Rp)',
    'Persentase Capaian (%)',
  ];

  let totalTarget = 0;
  let totalDisbursed = 0;
  let totalPending = 0;
  let totalRevisi = 0;
  let totalPagu = 0;
  let totalRealisasi = 0;

  const summaryRows = roleKeys.map((key, idx) => {
    const list = recipients.filter((r) => r.kategori === key);
    const target = list.length;
    const disbursed = list.filter((r) => r.status === 'TERSALURKAN').length;
    const pending = list.filter((r) => r.status === 'MENUNGGU_VERIFIKASI' || r.status === 'SIAP_SALUR').length;
    const revisi = list.filter((r) => r.status === 'PERLU_REVISI').length;
    const pagu = target * 500000;
    const realisasi = disbursed * 500000;
    const sisa = pagu - realisasi;
    const pct = pagu > 0 ? ((realisasi / pagu) * 100).toFixed(1) : '0';

    totalTarget += target;
    totalDisbursed += disbursed;
    totalPending += pending;
    totalRevisi += revisi;
    totalPagu += pagu;
    totalRealisasi += realisasi;

    const cfg = HONOR_ROLES_CONFIG[key];
    return [
      idx + 1,
      cfg?.roleName || key,
      target,
      disbursed,
      pending,
      revisi,
      pagu,
      realisasi,
      sisa,
      `${pct}%`,
    ];
  });

  const totalSisa = totalPagu - totalRealisasi;
  const totalPct = totalPagu > 0 ? ((totalRealisasi / totalPagu) * 100).toFixed(1) : '0';

  const ws2Data = [
    ['PEMERINTAH KOTA MALANG - KECAMATAN SUKUN - KELURAHAN BANDULAN'],
    ['REKAPITULASI REALISASI ANGGARAN HONORARIUM BULANAN PER KATEGORI PERAN'],
    [`Periode: ${period} | Standar Honor: Rp 500.000 / Orang / Bulan`],
    [],
    summaryHeaders,
    ...summaryRows,
    [
      '',
      'TOTAL KESELURUHAN (5 PERAN)',
      totalTarget,
      totalDisbursed,
      totalPending,
      totalRevisi,
      totalPagu,
      totalRealisasi,
      totalSisa,
      `${totalPct}%`,
    ],
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!cols'] = [
    { wch: 6 },  // No
    { wch: 36 }, // Kategori
    { wch: 20 }, // Target
    { wch: 20 }, // Tersalur
    { wch: 24 }, // Menunggu
    { wch: 20 }, // Revisi
    { wch: 22 }, // Pagu
    { wch: 24 }, // Realisasi
    { wch: 20 }, // Sisa
    { wch: 22 }, // %
  ];

  XLSX.utils.book_append_sheet(wb, ws2, 'Rekapitulasi 5 Peran');

  // ==========================================
  // SHEET 3: SEBARAN WILAYAH 9 RW BANDULAN
  // ==========================================
  const rwHeaders = [
    'Wilayah RW',
    'Guru TPQ',
    'Guru Sekolah Minggu',
    'Marbot Tempat Ibadah',
    'Perawat Jenazah',
    'Penjaga Makam',
    'Total Penerima (Orang)',
    'Total Honorarium (Rp)',
  ];

  const rwList = ['RW 01', 'RW 02', 'RW 03', 'RW 04', 'RW 05', 'RW 06', 'RW 07', 'RW 08', 'RW 09'];
  const rwRows = rwList.map((rw) => {
    const tpq = recipients.filter((r) => r.rw === rw && r.kategori === 'GURU_TPQ').length;
    const sm = recipients.filter((r) => r.rw === rw && r.kategori === 'GURU_SEKOLAH_MINGGU').length;
    const marbot = recipients.filter((r) => r.rw === rw && r.kategori === 'PENJAGA_TEMPAT_IBADAH').length;
    const perawat = recipients.filter((r) => r.rw === rw && r.kategori === 'PERAWAT_JENAZAH').length;
    const makam = recipients.filter((r) => r.rw === rw && r.kategori === 'PENJAGA_MAKAM').length;
    const total = tpq + sm + marbot + perawat + makam;
    const nominal = total * 500000;

    return [rw, tpq, sm, marbot, perawat, makam, total, nominal];
  });

  const ws3Data = [
    ['PEMERINTAH KOTA MALANG - KELURAHAN BANDULAN'],
    ['SEBARAN PENERIMA HONORARIUM PER WILAYAH RW (9 RW BANDULAN)'],
    [`Periode: ${period}`],
    [],
    rwHeaders,
    ...rwRows,
    [
      'TOTAL KELURAHAN',
      recipients.filter((r) => r.kategori === 'GURU_TPQ').length,
      recipients.filter((r) => r.kategori === 'GURU_SEKOLAH_MINGGU').length,
      recipients.filter((r) => r.kategori === 'PENJAGA_TEMPAT_IBADAH').length,
      recipients.filter((r) => r.kategori === 'PERAWAT_JENAZAH').length,
      recipients.filter((r) => r.kategori === 'PENJAGA_MAKAM').length,
      recipients.length,
      recipients.length * 500000,
    ],
  ];

  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  ws3['!cols'] = [
    { wch: 16 }, // RW
    { wch: 16 }, // TPQ
    { wch: 20 }, // SM
    { wch: 22 }, // Marbot
    { wch: 18 }, // Perawat
    { wch: 18 }, // Makam
    { wch: 22 }, // Total
    { wch: 24 }, // Nominal
  ];

  XLSX.utils.book_append_sheet(wb, ws3, 'Sebaran 9 RW');

  // Trigger file download
  const cleanPeriod = period.replace(/\s+/g, '_');
  const finalFilename = `${filenamePrefix}_${cleanPeriod}.xlsx`;
  XLSX.writeFile(wb, finalFilename);
}
