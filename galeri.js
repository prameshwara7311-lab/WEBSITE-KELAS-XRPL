// ===============================
// KONFIGURASI SUPABASE
// ===============================

const SUPABASE_URL = "https://ebnllywgzkeyjiwgyfwm.supabase.co";

const SUPABASE_KEY =
"sb_publishable_b_F-L_nut05K7fqWdmIEdw_ycpX-x6q";

const BUCKET = "galeri-kelas";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// ELEMENT HTML
// ===============================

const fileInput = document.getElementById("fileInput");
const gallery = document.getElementById("photo-list");
const statusText = document.getElementById("status");


// ===============================
// SAAT TOMBOL + DITEKAN
// ===============================

fileInput.addEventListener("change", async function () {

    const file = this.files[0];

    if (!file) return;

    statusText.textContent = "Mengupload foto...";

    // Nama file dibuat unik
    const fileName =
        Date.now() +
        "-" +
        Math.random().toString(36).substring(2) +
        "-" +
        file.name;


    // ===============================
    // UPLOAD FOTO
    // ===============================

    const { error } = await supabaseClient
        .storage
        .from(BUCKET)
        .upload(fileName, file);


    if (error) {

        console.error(error);

        statusText.textContent =
            "❌ Gagal upload: " + error.message;

        return;
    }


    // ===============================
    // AMBIL URL FOTO
    // ===============================

    const { data } = supabaseClient
        .storage
        .from(BUCKET)
        .getPublicUrl(fileName);


    // ===============================
    // TAMPILKAN FOTO
    // ===============================

    tambahFoto(data.publicUrl);

    statusText.textContent =
        "✅ Foto berhasil ditambahkan!";


    // Reset input
    fileInput.value = "";
});


// ===============================
// MENAMPILKAN FOTO
// ===============================

function tambahFoto(url) {

    const img = document.createElement("img");

    img.src = url;
    img.className = "gallery-photo";

    img.loading = "lazy";

    gallery.appendChild(img);
}


// ===============================
// LOAD FOTO YANG SUDAH ADA
// ===============================

async function loadPhotos() {

    statusText.textContent =
        "Memuat foto...";


    const { data, error } = await supabaseClient
        .storage
        .from(BUCKET)
        .list("", {
            limit: 100,
            sortBy: {
                column: "created_at",
                order: "desc"
            }
        });


    if (error) {

        console.error(error);

        statusText.textContent =
            "❌ Gagal mengambil foto: " +
            error.message;

        return;
    }


    if (!data || data.length === 0) {

        statusText.textContent =
            "Belum ada foto.";

        return;
    }


    data.forEach(file => {

        const { data: publicData } =
            supabaseClient
                .storage
                .from(BUCKET)
                .getPublicUrl(file.name);


        tambahFoto(publicData.publicUrl);

    });


    statusText.textContent = "";
}


// Jalankan saat halaman dibuka
loadPhotos();