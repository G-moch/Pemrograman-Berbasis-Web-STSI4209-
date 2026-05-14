var appTracking = new Vue({
    el: '#app-tracking',
    data: {
        trackingData: dummyData.tracking,
        pengirimanList: dummyData.pengirimanList,
        paketList: dummyData.paket,
        
        newDo: {
            nim: "",
            nama: "",
            ekspedisi: "",
            paketKode: "",
            tanggalKirim: new Date().toISOString().split('T')[0] 
        },

        searchQuery: "",
        trackedDo: null,
        isNotFound: false,
        searchStatusText: "Ketik nomor DO lalu tekan CARI."
    },
    computed: {
        generatedDO() {
            const tahun = new Date().getFullYear();
            const prefix = `DO${tahun}-`;
            
            let count = 0;
            for (let key in this.trackingData) {
                if (key.startsWith(prefix)) {
                    count++;
                }
            }
            
            const sequence = String(count + 1).padStart(3, '0');
            return prefix + sequence;
        },

        selectedPaketDetail() {
            if (!this.newDo.paketKode) return null;
            return this.paketList.find(p => p.kode === this.newDo.paketKode);
        },

        totalHarga() {
            return this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
        }
    },
    watch: {
        searchQuery(newVal) {
            this.searchQuery = newVal.toUpperCase();
            
            if (newVal === "") {
                this.trackedDo = null;
                this.isNotFound = false;
                this.searchStatusText = "Ketik nomor DO lalu tekan CARI.";
            } else {
                this.searchStatusText = "Siap mencari...";
            }
        },

        'newDo.paketKode': function(newVal) {
            if (newVal) {
                console.log("Paket dipilih:", newVal);
            }
        }
    },
    methods: {
        formatRupiah(angka) {
            return "Rp " + angka.toLocaleString('id-ID');
        },

        simpanDO() {
            if (!this.newDo.nim || !this.newDo.nama || !this.newDo.ekspedisi || !this.newDo.paketKode) {
                alert("Mohon lengkapi semua data form sebelum membuat DO!");
                return;
            }

            const newDoNumber = this.generatedDO;
            const newDoObj = {
                nim: this.newDo.nim,
                nama: this.newDo.nama,
                status: "Diproses",
                ekspedisi: this.newDo.ekspedisi,
                tanggalKirim: this.newDo.tanggalKirim,
                paket: this.newDo.paketKode,
                total: this.totalHarga,
                perjalanan: [
                    { 
                        waktu: new Date().toLocaleString('id-ID'), 
                        keterangan: "DO diterbitkan dan sedang dikemas oleh UPBJJ." 
                    }
                ]
            };

            // Tambah data ke objek global (Reaktif)
            this.$set(this.trackingData, newDoNumber, newDoObj);

            // Reset Form 
            this.newDo.nim = "";
            this.newDo.nama = "";
            this.newDo.ekspedisi = "";
            this.newDo.paketKode = "";

            alert(`Sukses! Nomor Delivery Order ${newDoNumber} berhasil dibuat.`);
        },

        lacakDO() {
            if (!this.searchQuery) return;
            
            const hasil = this.trackingData[this.searchQuery];
            
            if (hasil) {
                this.trackedDo = hasil;
                this.isNotFound = false;
                this.searchStatusText = "Data ditemukan!";
            } else {
                this.trackedDo = null;
                this.isNotFound = true;
                this.searchStatusText = "Pencarian gagal.";
            }
        }
    }
});