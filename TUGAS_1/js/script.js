// --- FUNGSI LOGIN ---
function handleLogin(event) {
    event.preventDefault(); // Mencegah form reload page
    const emailInput = document.getElementById('email').value;
    const passInput = document.getElementById('password').value;

    // Cek validasi dari data.js
    const userFound = dataPengguna.find(u => u.email === emailInput && u.password === passInput);

    if (userFound) {
        // Simpan sesi ke localStorage
        localStorage.setItem('sitta_user', userFound.nama);
        window.location.href = 'dashboard.html';
    } else {
        // Manipulasi DOM Alert Box jika salah
        alert("Email / Password yang Anda masukkan salah!");
    }
}

function logout() {
    localStorage.removeItem('sitta_user');
    window.location.href = 'index.html';
}

// --- FUNGSI MODAL ---
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// --- FUNGSI DASHBOARD GREETING ---
function setGreeting() {
    const greetingEl = document.getElementById('greetingText');
    if (!greetingEl) return; // Jika bukan di halaman dashboard, lewati

    const hour = new Date().getHours();
    let ucapan = "Selamat Malam";

    if (hour >= 5 && hour < 11) ucapan = "Selamat Pagi";
    else if (hour >= 11 && hour < 15) ucapan = "Selamat Siang";
    else if (hour >= 15 && hour < 18) ucapan = "Selamat Sore";

    const namaUser = localStorage.getItem('sitta_user') || 'Mahasiswa UT';
    greetingEl.innerText = `${ucapan}, ${namaUser}`;
}

// --- FUNGSI TRACKING DO DENGAN VALIDASI HAK AKSES  ---
function cariTracking() {
    const noDO = document.getElementById('inputDO').value;
    const container = document.getElementById('trackingResult');
    
    if (!noDO) {
        alert("Silakan masukkan Nomor DO terlebih dahulu.");
        return;
    }

    const data = dataTracking[noDO];
    const currentUser = localStorage.getItem('sitta_user');

    // LOGIKA KREATIVITAS: Cek apakah data ADA *DAN* (User adalah Admin ATAU pemilik DO)
    if (data && (currentUser === "Admin SITTA" || currentUser === data.nama)) {
        
        // DOM HTML generation jika data valid dan akses diizinkan
        let html = `
            <div class="result-header">
                <h3>${data.nama}</h3>
                <p>No. DO: <strong>${data.nomorDO}</strong></p>
                <p>Status: <span style="background:#f1c40f; color:#333; padding:2px 8px; border-radius:10px;">${data.status}</span> | Ekspedisi: ${data.ekspedisi} | Total: ${data.total}</p>
            </div>
            <h4>Perjalanan Paket</h4>
            <div class="timeline">
        `;

        // Looping data perjalanan
        data.perjalanan.forEach(item => {
            html += `
                <div class="timeline-item">
                    <span style="color: #666; font-size: 0.9em;">${item.waktu}</span>
                    <p><strong>${item.keterangan}</strong></p>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

    } else {
        // Pesan disamakan: Jika DO memang tidak ada, ATAU DO ada tapi bukan miliknya, 
        container.innerHTML = `<p style="color: red; font-weight: bold; padding: 20px; background: white; border-radius: 5px;">Data DO ${noDO} tidak ditemukan dalam sistem kami.</p>`;
    }
}

// --- FUNGSI STOK BAHAN AJAR ---
function loadStok() {
    const container = document.getElementById('stokContainer');
    if (!container) return;
    
    container.innerHTML = ''; // Bersihkan container

    // Menggunakan data dari data.js
    dataBahanAjar.forEach(item => {
        // Tangani gambar error jika tidak ada di folder (fallback)
        const imgSrc = item.cover ? item.cover : 'https://via.placeholder.com/300x200?text=No+Image';

        const card = `
            <div class="stok-card">
                <img src="${imgSrc}" alt="${item.namaBarang}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <h3 style="color: #00458b; margin-bottom:10px;">${item.namaBarang}</h3>
                <p>Kode Lokasi: <strong>${item.kodeLokasi || '-'}</strong></p>
                <p>Kode Barang: <strong>${item.kodeBarang}</strong></p>
                <p>Jenis: <span class="badge">${item.jenisBarang || 'N/A'}</span></p>
                <p>Edisi: <strong>${item.edisi || '-'}</strong></p>
                <p style="font-size: 16px; color: #d35400; font-weight: bold; margin-top: 10px;">Stok Tersedia: ${item.stok}</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

function tambahStok(event) {
    event.preventDefault();
    
    // Ambil data dari form modal
    const kode = document.getElementById('newKode').value;
    const nama = document.getElementById('newNama').value;
    const stok = document.getElementById('newStok').value;

    // Manipulasi Objek Array
    const newItem = {
        kodeLokasi: "BARU",
        kodeBarang: kode,
        namaBarang: nama,
        jenisBarang: "BMP",
        edisi: "1",
        stok: parseInt(stok),
        cover: "" // Tidak ada cover untuk input manual baru
    };

    dataBahanAjar.push(newItem); // Tambahkan ke variabel global
    
    closeModal('modalTambahStok'); // Tutup modal
    document.getElementById('formTambahStok').reset(); // Reset form
    loadStok(); // Render ulang DOM agar data baru muncul
    alert("Data bahan ajar berhasil ditambahkan sementara!");
}