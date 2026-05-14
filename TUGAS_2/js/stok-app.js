var appStok = new Vue({
    el: '#app-stok',
    data: {
        stokList: dummyData.stok,
        upbjjList: dummyData.upbjjList,
        kategoriList: dummyData.kategoriList,
        
        filter: {
            upbjj: "",
            kategori: "",
            reorderOnly: false
        },
        sortKey: "judul",
        
        showAddForm: false,
        editIndex: -1,
        editData: {},
        
        newStok: {
            kode: "", 
            judul: "", 
            kategori: "", 
            upbjj: "", 
            lokasiRak: "", 
            qty: 0, 
            safety: 0, 
            harga: 0, 
            catatanHTML: "Baru ditambahkan"
        }
    },
    computed: {
        filteredAndSortedStok() {
            let result = this.stokList.filter(item => {
                let matchUpbjj = this.filter.upbjj === "" || item.upbjj === this.filter.upbjj;
                let matchKategori = this.filter.kategori === "" || item.kategori === this.filter.kategori;
                let matchReorder = !this.filter.reorderOnly || item.qty < item.safety;
                return matchUpbjj && matchKategori && matchReorder;
            });

            result = result.sort((a, b) => {
                if (this.sortKey === 'judul') {
                    return a.judul.localeCompare(b.judul);
                } else if (this.sortKey === 'qty') {
                    return a.qty - b.qty;
                } else if (this.sortKey === 'harga') {
                    return a.harga - b.harga;
                }
            });

            return result;
        }
    },
    watch: {
        'filter.upbjj': function(newVal, oldVal) {
            console.log(`UPBJJ Filter berubah dari ${oldVal} ke ${newVal}`);
            this.filter.kategori = ""; 
        }
    },
    methods: {
        resetFilter() {
            this.filter.upbjj = "";
            this.filter.kategori = "";
            this.filter.reorderOnly = false;
            this.sortKey = "judul";
        },
        mulaiEdit(index, item) {
            this.editIndex = index;
            this.editData = { qty: item.qty, safety: item.safety };
        },
        simpanEdit(index) {
            if(this.editData.qty < 0 || this.editData.safety < 0) {
                alert("Stok tidak boleh minus!"); return;
            }
            this.filteredAndSortedStok[index].qty = this.editData.qty;
            this.filteredAndSortedStok[index].safety = this.editData.safety;
            this.editIndex = -1;
        },
        batalEdit() {
            this.editIndex = -1;
        },
        tambahData() {
            if(!this.newStok.kode || !this.newStok.judul || !this.newStok.upbjj || !this.newStok.lokasiRak) {
                alert("Harap lengkapi semua isian wajib (Kode, Judul, UPBJJ, Lokasi Rak)!"); return;
            }
            
            this.stokList.push({...this.newStok});
            
            this.newStok = { 
                kode: "", 
                judul: "", 
                kategori: "", 
                upbjj: "", 
                lokasiRak: "", 
                qty: 0, 
                safety: 0, 
                harga: 0, 
                catatanHTML: "Baru ditambahkan" 
            };
            this.showAddForm = false;
            alert("Bahan ajar berhasil ditambahkan!");
        }
    }
});