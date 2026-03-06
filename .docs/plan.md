aku ingin membuat aplikasi multi role

didalamnya terdapat 4 role

1. pendamping
2. admin universitas
3. pengawas universitas
4. super admin

### Tugas dan Fungsi

1. Pendamping
    - Melakukan pendampingan terhadap user dengan mengisi logbook harian
    
    ```jsx
    model Logbook {
      id                String               @id @default(cuid())
      date              DateTime
      deliveryMethod    DeliveryMethod
      meetingType       MeetingType          // INDIVIDUAL / GROUP
      visitType         String
      startTime         DateTime
      endTime           DateTime
      jpl               Int                  @default(0)
      material          String
      summary           String
      obstacle          String
      solution          String
      totalExpense      Decimal              @default(0)
      documentationUrls String[]             // Simpan path Minio
      expenseProofUrl   String?
      noExpenseReason   String?
    
      // === Relations ===
      logbookParticipants LogbookParticipant[]  // Many-to-many via join table
    
      createdAt         DateTime             @default(now())
    }
    
    enum DeliveryMethod {
      FACE_TO_FACE
      ONLINE
    }
    
    enum MeetingType {
      INDIVIDUAL
      GROUP
    }
    ```
    
    kadang logbook dilakukan berkelompok atau sendiri maka dibutuhkan tabel relasi
    
    ```jsx
    model LogbookParticipant {
      id            String      @id @default(cuid())
      logbookId     String
      logbook       Logbook     @relation(fields: [logbookId], references: [id], onDelete: Cascade)
      participantId String
      participant   Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
    
      @@unique([logbookId, participantId])  // Cegah duplikat
    }
    ```
    
    - capaian output sebanyak 4 kali yaitu Data Awal seperti apa, Bulan Pertama s/d Bulan Ketiga Seperti apa
    
    ```jsx
    model CapaianOutput {
      id                            String        @id @default(cuid())
      participantId                 String
      participant                   Participant   @relation(fields: [participantId], references: [id])
      reportMonth                   DateTime
      revenue                       Decimal
      salesVolume                   Float
      salesVolumeUnit               String
      productionCapacity            Float
      productionCapacityUnit        String
      workerConfirmation            String
      incomeProofUrl                String
      cashflowProofUrl              String
      obstacle                      String
      marketingArea                 String
      businessCondition             String
      lpjUrl                        String
      hasCashflowBookkeeping        Boolean
      hasIncomeStatementBookkeeping Boolean
      newEmployees                  Employee[]
      createdAt                     DateTime      @default(now())
    }
    
    model Employee {
      id               String        @id @default(cuid())
      capaianOutputId  String
      capaianOutput    CapaianOutput @relation(fields: [capaianOutputId], references: [id])
      nik              String        @unique
      name             String
      ktpUrl           String
      employmentStatus String
      hasBpjs          Boolean
      isDisabled       Boolean
      disabilityType   String?
      gender           String
      bpjsType         String?
      bpjsNumber       String?
      bpjsCardUrl      String?
      role             String
      salarySlipUrl    String
    }
    ```
    
    - Melakukan Update Data Peserta TKML
    
    ```jsx
    model Participant {
      id                     String               @id @default(cuid())
      idTkm                  String               @unique    // Header: id_tkm
    
      // === Data diisi oleh Pendamping ===
      communicationStatus    String?
      fundDisbursementStatus String?
      presenceStatus         String?
      isWillingToBeAssisted  Boolean?
      unwillingReason        String?
      status                 String               @default("active") // active / drop
      dropReason             String?
      googleMapsUrl          String?
      bmcUrl                 String?
      actionPlanUrl          String?
    
      // === Relations ===
      logbookParticipants    LogbookParticipant[]
      capaianOutputs         CapaianOutput[]
    
      createdAt              DateTime             @default(now())
      updatedAt              DateTime             @updatedAt
    }
    ```
    
2. Admin Universitas
    - User yang akan melakukan multi assign membagikan peserta kepada pendamping yang mereka miliki
    - konfirmasi pendamping yang mendaftar masuk ke aplikasi dan join dengan universitasnya di daftar user
    - konfirmasi logbook, accept, revisi dengan note, tolak.
    - konfirmasi capaian output, revisi dengan note, tolak.
    
3. Pengawas Universitas
    - Memantau perkembangan, logbook, capaian output, melihat inputan dan memberi pesan . terhadap inputan universitas yang dia pilih.

1. Super Admin
    - Konfirmasi Admin universitas, dan pengawas universitas yang mendaftar di daftar user
    - membagikan peserta (bulk assign) kepada masing masing universitas
    - memantau perkembangan dashboard universitas

## Profile Peserta

aku memiliki data excel yang akan di upload untuk list peserta yang masuk ke event ini sebanyak 9000. dan memiliki header seperti di bawah

### 1. Informasi Sistem & Administrasi Pendaftaran

Data ini berkaitan dengan identitas unik di sistem dan status pengajuan.

- `id_tkm`
- `tanggal_daftar`

### 2. Identitas Pribadi Pendaftar

Informasi mendasar mengenai individu yang mengajukan pendaftaran.

- `nama_pendaftar`, `nik_pendaftar`
- `tempat_lahir`
- `pendidikan_terakhir`
- `aktivitas_saat_ini`
- `apakah_penyandang_disabilitas`, `jenis_disabilitas`

### 3. Data Alamat & Kontak

Kategori ini mencakup lokasi tempat tinggal (KTP & Domisili) serta jalur komunikasi.

- **Kontak & Sosmed:** `whatsapp`, `platform_media_sosial`, `akun_media_sosial`, `link_media_sosial`

### 4. Kontak Darurat (Kerabat)

Data orang terdekat yang bisa dihubungi jika pendaftar tidak dapat dijangkau.

- `nama_kerabat_1`, `telepon_kerabat_1`, `status_kerabat_1`
- `nama_kerabat_2`, `telepon_kerabat_2`, `status_kerabat_2`

### 5. Profil & Operasional Usaha

Detail mengenai bisnis yang dijalankan atau diajukan.

- `nama_usaha`, `sektor_usaha`, `jenis_usaha`, `deskripsi_usaha`, `produk_utama`
- **Lokasi Usaha:** `lokasi_usaha`, `kepemilikan_lokasi_usaha`, `alamat_usaha_dan_alamat_domisili_sama`, `alamat_usaha`, `provinsi_usaha`, `kota_usaha`, `kecamatan_usaha`, `kelurahan_usaha`, `kode_pos_usaha`
- **Pemasaran:** `saluran_pemasaran`, `wilayah_pemasaran`, `wilayah_negara_pemasaran`, `mitra_usaha`, `jumlah_mitra_usaha`
- **Keuangan & Produksi:** `omset_per_periode`, `laba_per_periode`, `jumlah_produk_per_periode`, `satuan_jumlah_produk_per_periode`

### 6. Berkas Unggahan & Proposal

Dokumen pendukung untuk syarat bantuan atau pengembangan usaha.

- `upload_ktp`, `upload_kartu_keluarga`, `upload_foto_diri`
- `dokumen_surat_permohonan_bantuan`, `dokumen_surat_pernyataan_kesanggupan`
- `dokumen_profil_usaha`, `dokumen_bmc_strategi_model_usaha`, `dokumen_rab`, `dokumen_rencana_pengembangan_usaha`
- `video_usaha`, `foto_usaha`, `dokumen_pencatatan_keuangan`

## Aku ingin Aplikasi ini berbasis workspace multi event

misalnya event ini TKML 2025, aku ingin nanti ditahun 2026, dibuat nama evennya TKM Lanjutan 2026, tanggal sekian sampai sekian.

tahapan aplikasi flow:

1.  super admin membuat workspace cth: tkml 2025
2.  Memasukan Semua Peserta dengan excel, input universitas pendamping terdaftar
3.  Admin dan pengawas Universitas Register Aplikasi mendaftar sebagai admin dan pengawas universitas A
4. Super admin konfirmasi admin / pengawas universitas
5. admin bulk assign peserta kepada universitas-universitas terdaftar contoh: 1000 peserta diberikan kepada 5 universitas 200 ini ke universitas A, sisanya ke B - E, sesuai dengan daftar di excel.
6. pendamping register aplikasi lalu mendaftarkan diri sebagai pendamping dan universitas yang dia pilih.
7. Admin Universitas Konfirmasi pendamping miliknya yang muncul di list user
8. Admin Universitas Memberikan multi assign peserta kepada pendamping berdasarkan alamat/kota/provinsi usaha/sektor bisnis.
9. pendamping login, mendapati daftar peserta yang harus ia lakukan dampingan dan mencatat capaian output 3 bulan dan data awalnya tadi.