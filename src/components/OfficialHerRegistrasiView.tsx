import React from 'react';
import { Recipient, HonorRole } from '../types';
import { HONOR_ROLES_CONFIG } from '../data/mockRecipients';
import { Printer, Download, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface OfficialHerRegistrasiViewProps {
  recipient: Recipient;
  onClose?: () => void;
  isPrintOnly?: boolean;
}

export const OfficialHerRegistrasiView: React.FC<OfficialHerRegistrasiViewProps> = ({
  recipient,
  onClose,
  isPrintOnly = false,
}) => {
  const roleConfig = HONOR_ROLES_CONFIG[recipient.kategori] || HONOR_ROLES_CONFIG.GURU_TPQ;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-black font-serif text-[13px] leading-relaxed max-w-2xl mx-auto p-8 border border-slate-300 shadow-sm rounded-lg print:border-none print:shadow-none print:p-0 print:max-w-none">
      {/* Action Header in screen mode */}
      {!isPrintOnly && (
        <div className="no-print mb-6 pb-4 border-b border-slate-200 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-teal-50 text-[#0f766e] px-2.5 py-1 rounded border border-teal-200">
              Format Dokumen Resmi Pemkot Malang
            </span>
            <span className="text-xs text-slate-500 font-mono">Tahun Anggaran 2027</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#0f766e] hover:bg-[#0d9488] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Document Header matching official PDF */}
      <div className="text-center font-bold tracking-wide uppercase space-y-1 pb-6 border-b-2 border-black/80">
        <h2 className="text-[17px] leading-tight">FORM HER REGISTRASI</h2>
        <h3 className="text-[16px] leading-tight text-slate-900">{roleConfig.categoryName}</h3>
        <h4 className="text-[15px] leading-tight text-slate-900">KELURAHAN BANDULAN</h4>
        <p className="text-[14px] font-semibold text-slate-800">(TAHUN ANGGARAN 2027)</p>
      </div>

      {/* Section A: DATA DIRI */}
      <div className="mt-5 space-y-2.5">
        <h5 className="font-bold text-[14px] uppercase tracking-wide">A. DATA DIRI</h5>

        <div className="grid grid-cols-[180px_15px_1fr] gap-y-2 items-baseline text-[13px]">
          <div>1. Nama Lengkap</div>
          <div>:</div>
          <div className="font-semibold">{recipient.nama} {recipient.gelar ? `(${recipient.gelar})` : ''}</div>

          <div>2. Tempat Tanggal Lahir</div>
          <div>:</div>
          <div>{recipient.tempatTanggalLahir || 'Malang, -'}</div>

          <div>3. NIK</div>
          <div>:</div>
          <div className="font-mono font-bold tracking-wider">{recipient.nik}</div>

          <div>4. Jenis Kelamin</div>
          <div>:</div>
          <div>{recipient.jenisKelamin || 'Laki-laki'}</div>

          <div>5. Alamat Rumah</div>
          <div>:</div>
          <div>
            {recipient.alamatRumah || recipient.alamatLembaga}
            <div className="mt-0.5 text-slate-800 font-medium">
              RT : <span className="font-bold underline px-1">{recipient.rtRumah || recipient.rt}</span> &nbsp;&nbsp;&nbsp;&nbsp; RW : <span className="font-bold underline px-1">{recipient.rwRumah || recipient.rw}</span>
            </div>
          </div>

          <div>6. Nomor HP</div>
          <div>:</div>
          <div className="font-mono">{recipient.telepon}</div>

          <div>7. Pendidikan Terakhir</div>
          <div>:</div>
          <div>{recipient.pendidikanTerakhir || 'SMA / Sederajat'}</div>

          <div>8. Nomor Rekening</div>
          <div>:</div>
          <div>
            <span className="font-mono font-bold">{recipient.nomorRekening}</span>
            <div className="text-[12px] italic text-slate-700">({recipient.bankPenyalur} an. {recipient.namaPemilikRekening})</div>
          </div>

          <div>{roleConfig.durationLabel}</div>
          <div>:</div>
          <div className="font-semibold">{recipient.lamaBertugas || `${recipient.masaKerjaTahun} Tahun`}</div>
        </div>
      </div>

      {/* Section B: DATA TEMPAT TUGAS */}
      <div className="mt-6 space-y-2.5 pt-3 border-t border-slate-300">
        <h5 className="font-bold text-[14px] uppercase tracking-wide">{roleConfig.sectionBTitle}</h5>

        <div className="grid grid-cols-[180px_15px_1fr] gap-y-2 items-baseline text-[13px]">
          {/* Specific fields based on role */}
          {recipient.kategori === 'GURU_TPQ' && (
            <>
              <div>1. Nama TPQ</div>
              <div>:</div>
              <div className="font-semibold">{recipient.namaLembaga}</div>

              <div>2. NSPQ (*bagi TPQ jika ada)</div>
              <div>:</div>
              <div>
                <span className="font-mono font-semibold">{recipient.nspqOrNsm || '-'}</span>
                <div className="text-[11px] italic text-slate-600">(Nomor Statistik Pendidikan Al-Qur’an)</div>
              </div>

              <div>3. Alamat TPQ</div>
              <div>:</div>
              <div>
                {recipient.alamatLembaga}
                <div className="mt-0.5">
                  RT : <span className="font-bold underline px-1">{recipient.rt}</span> &nbsp;&nbsp;&nbsp;&nbsp; RW : <span className="font-bold underline px-1">{recipient.rw}</span>
                </div>
              </div>
            </>
          )}

          {recipient.kategori === 'GURU_SEKOLAH_MINGGU' && (
            <>
              <div>1. Nama Sekolah Minggu</div>
              <div>:</div>
              <div className="font-semibold">{recipient.namaLembaga}</div>

              <div>2. Nama Kepala Sekolah</div>
              <div>:</div>
              <div className="font-semibold">{recipient.pimpinanNama || 'Kepala Sekolah Minggu'}</div>

              <div>3. Alamat Sekolah Minggu</div>
              <div>:</div>
              <div>
                {recipient.alamatLembaga}
                <div className="mt-0.5">
                  RT : <span className="font-bold underline px-1">{recipient.rt}</span> &nbsp;&nbsp;&nbsp;&nbsp; RW : <span className="font-bold underline px-1">{recipient.rw}</span>
                </div>
              </div>
            </>
          )}

          {recipient.kategori === 'PENJAGA_TEMPAT_IBADAH' && (
            <>
              <div>1. Nama Masjid / Mushollah</div>
              <div>:</div>
              <div className="font-semibold">{recipient.namaLembaga}</div>

              <div>2. Nama Takmir Masjid</div>
              <div>:</div>
              <div className="font-semibold">{recipient.pimpinanNama || 'Ketua Takmir'}</div>

              <div>3. NSM (*bagi Masjid jika ada)</div>
              <div>:</div>
              <div>
                <span className="font-mono font-semibold">{recipient.nspqOrNsm || '-'}</span>
                <div className="text-[11px] italic text-slate-600">(Nomor Sertifikat Masjid/Mushollah)</div>
              </div>

              <div>4. Alamat Masjid</div>
              <div>:</div>
              <div>
                {recipient.alamatLembaga}
                <div className="mt-0.5">
                  RT : <span className="font-bold underline px-1">{recipient.rt}</span> &nbsp;&nbsp;&nbsp;&nbsp; RW : <span className="font-bold underline px-1">{recipient.rw}</span>
                </div>
              </div>
            </>
          )}

          {recipient.kategori === 'PERAWAT_JENAZAH' && (
            <>
              <div>1. Wilayah Kerja</div>
              <div>:</div>
              <div className="font-semibold">{recipient.namaLembaga}</div>

              <div>2. Nama Ketua RW</div>
              <div>:</div>
              <div className="font-semibold">{recipient.pimpinanNama || `Ketua ${recipient.rw}`}</div>

              <div>3. Alamat Wilayah Kerja</div>
              <div>:</div>
              <div>
                {recipient.alamatLembaga}
                <div className="mt-0.5">
                  RT : <span className="font-bold underline px-1">{recipient.rt}</span> &nbsp;&nbsp;&nbsp;&nbsp; RW : <span className="font-bold underline px-1">{recipient.rw}</span>
                </div>
              </div>
            </>
          )}

          {recipient.kategori === 'PENJAGA_MAKAM' && (
            <>
              <div>1. Nama Makam</div>
              <div>:</div>
              <div className="font-semibold">{recipient.namaLembaga}</div>

              <div>2. Nama Ketua RW</div>
              <div>:</div>
              <div className="font-semibold">{recipient.pimpinanNama || `Ketua ${recipient.rw}`}</div>

              <div>3. Alamat Lengkap Makam</div>
              <div>:</div>
              <div>
                {recipient.alamatLembaga}
                <div className="mt-0.5">
                  RT : <span className="font-bold underline px-1">{recipient.rt}</span> &nbsp;&nbsp;&nbsp;&nbsp; RW : <span className="font-bold underline px-1">{recipient.rw}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-12 pt-6 grid grid-cols-2 text-center text-[13px] gap-6">
        <div>
          <p>Mengetahui,</p>
          <p className="font-semibold">{roleConfig.pimpinanTitle}</p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[11px] text-slate-400 italic">(Stempel & Tanda Tangan)</span>
          </div>
          <p className="font-bold underline">({recipient.pimpinanNama || '...........................................'})</p>
          <p className="text-[11px] text-slate-600">(Nama Lengkap dan Stempel)</p>
        </div>

        <div>
          <p>Malang, ............................. 2027</p>
          <p className="font-semibold">{roleConfig.participantTitle}</p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[11px] text-slate-400 italic">(Tanda Tangan)</span>
          </div>
          <p className="font-bold underline">({recipient.nama})</p>
          <p className="text-[11px] text-slate-600">(Nama Lengkap)</p>
        </div>
      </div>

      {/* NB Section */}
      <div className="mt-10 pt-4 border-t border-slate-400 text-[12px] leading-relaxed">
        <p className="font-bold italic">NB :</p>
        <ol className="list-decimal pl-5 space-y-0.5 text-slate-800">
          {roleConfig.attachments.map((att, idx) => (
            <li key={idx}>{att.replace(/^\d+\.\s*/, '')}</li>
          ))}
        </ol>
        <p className="font-semibold italic mt-1.5 text-slate-700">
          (Lampiran di klip jadi 1 dengan Form Her Registrasi)
        </p>
      </div>
    </div>
  );
};
