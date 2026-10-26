
const shapeSelect = document.getElementById("shape");
const inputFields = document.getElementById("inputFields");
const calculatorForm = document.getElementById("calculatorForm");
const result = document.getElementById("result");

const shapes = {
    kubus: {
        name: "Kubus",
        fields: [
            ["sisi", "Panjang sisi (cm)"]
        ]
    },
    balok: {
        name: "Balok",
        fields: [
            ["panjang", "Panjang (cm)"],
            ["lebar", "Lebar (cm)"],
            ["tinggi", "Tinggi (cm)"]
        ]
    },
    tabung: {
        name: "Tabung",
        fields: [
            ["jari", "Jari-jari (cm)"],
            ["tinggi", "Tinggi (cm)"]
        ]
    },
    kerucut: {
        name: "Kerucut",
        fields: [
            ["jari", "Jari-jari (cm)"],
            ["tinggi", "Tinggi (cm)"]
        ]
    },
    bola: {
        name: "Bola",
        fields: [
            ["jari", "Jari-jari (cm)"]
        ]
    },
    limas: {
        name: "Limas Segi Empat Beraturan",
        fields: [
            ["sisi", "Panjang sisi alas (cm)"],
            ["tinggi", "Tinggi tegak limas (cm)"]
        ]
    },
    prisma: {
        name: "Prisma Segitiga Siku-siku",
        fields: [
            ["alas", "Sisi tegak segitiga (cm)"],
            ["tinggiSegitiga", "Sisi tegak segitiga lainnya (cm)"],
            ["panjangPrisma", "Panjang prisma (cm)"]
        ]
    },
    limasSegitiga: {
        name: "Limas Segitiga Beraturan",
        fields: [
            ["sisi", "Panjang sisi alas segitiga (cm)"],
            ["tinggi", "Tinggi tegak limas (cm)"]
        ]
    }
};

// Membuat input sesuai bangun ruang yang dipilih
function tampilkanInput() {
    const shape = shapes[shapeSelect.value];

    inputFields.innerHTML = shape.fields.map(([id, label]) => `
        <label for="${id}">${label}</label>
        <input
            type="number"
            id="${id}"
            min="0.01"
            step="any"
            placeholder="Masukkan ${label.toLowerCase()}"
            required
        >
    `).join("");
}

// Mengambil nilai input dan memvalidasinya
function ambilNilai(id) {
    const input = document.getElementById(id);
    const nilai = input.valueAsNumber;

    if (input.value.trim() === "" ||
        !Number.isFinite(nilai) ||
        nilai <= 0) {
        throw new Error("Semua ukuran harus diisi dengan angka lebih dari 0.");
    }

    return nilai;
}

// Menghitung volume dan luas permukaan
function hitungBangunRuang(jenis) {
    const v = Math.PI;
    let volume;
    let luas;
    let nama = shapes[jenis].name;

    switch (jenis) {
        case "kubus": {
            const s = ambilNilai("sisi");
            volume = s ** 3;
            luas = 6 * s ** 2;
            break;
        }

        case "balok": {
            const p = ambilNilai("panjang");
            const l = ambilNilai("lebar");
            const t = ambilNilai("tinggi");
            volume = p * l * t;
            luas = 2 * (p * l + p * t + l * t);
            break;
        }

        case "tabung": {
            const r = ambilNilai("jari");
            const t = ambilNilai("tinggi");
            volume = v * r ** 2 * t;
            luas = 2 * v * r * (r + t);
            break;
        }

        case "kerucut": {
            const r = ambilNilai("jari");
            const t = ambilNilai("tinggi");
            const garisPelukis = Math.sqrt(r ** 2 + t ** 2);
            volume = v * r ** 2 * t / 3;
            luas = v * r * (r + garisPelukis);
            break;
        }

        case "bola": {
            const r = ambilNilai("jari");
            volume = 4 / 3 * v * r ** 3;
            luas = 4 * v * r ** 2;
            break;
        }

        case "limas": {
            const s = ambilNilai("sisi");
            const t = ambilNilai("tinggi");
            const tinggiSisi = Math.sqrt(t ** 2 + (s / 2) ** 2);
            volume = s ** 2 * t / 3;
            luas = s ** 2 + 2 * s * tinggiSisi;
            break;
        }

        case "prisma": {
            const a = ambilNilai("alas");
            const b = ambilNilai("tinggiSegitiga");
            const p = ambilNilai("panjangPrisma");
            const sisiMiring = Math.sqrt(a ** 2 + b ** 2);
            const luasAlas = a * b / 2;
            volume = luasAlas * p;
            luas = 2 * luasAlas + (a + b + sisiMiring) * p;
            break;
        }

        case "limasSegitiga": {
            const s = ambilNilai("sisi");
            const t = ambilNilai("tinggi");
            const luasAlas = Math.sqrt(3) / 4 * s ** 2;
            const jarakPusat = s * Math.sqrt(3) / 6;
            const tinggiSisi = Math.sqrt(t ** 2 + jarakPusat ** 2);
            volume = luasAlas * t / 3;
            luas = luasAlas + 3 * (s * tinggiSisi / 2);
            break;
        }

        default:
            throw new Error("Bangun ruang tidak dikenali.");
    }

    return { nama, volume, luas };
}

// Menampilkan hasil di halaman dan alert
calculatorForm.addEventListener("submit", function(event) {
    event.preventDefault();

    try {
        const hasil = hitungBangunRuang(shapeSelect.value);
        const volume = hasil.volume.toLocaleString("id-ID", {
            maximumFractionDigits: 4
        });
        const luas = hasil.luas.toLocaleString("id-ID", {
            maximumFractionDigits: 4
        });

        const pesan =
            `Bangun Ruang: ${hasil.nama}\n` +
            `Volume: ${volume} cm³\n` +
            `Luas Permukaan: ${luas} cm²`;

        result.innerHTML = `
            <p><strong>Bangun Ruang:</strong> ${hasil.nama}</p>
            <p><strong>Volume:</strong> ${volume} cm³</p>
            <p><strong>Luas Permukaan:</strong> ${luas} cm²</p>
        `;

        alert(pesan);

    } catch (error) {
        alert(error.message);
    }
});

// Tampilkan input awal dan perbarui saat pilihan berubah
shapeSelect.addEventListener("change", tampilkanInput);
tampilkanInput();
