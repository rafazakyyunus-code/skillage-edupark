/**
 * seedFirebaseUsers.js
 * 
 * Jalankan script ini SEKALI SAJA untuk membuat akun pengguna awal di Firebase.
 * Setelah itu, tambahkan user langsung dari Firebase Console.
 * 
 * Cara pakai:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key dari:
 *    Firebase Console > Project Settings > Service accounts > Generate new private key
 * 3. Simpan file JSON tersebut sebagai serviceAccountKey.json di root project
 * 4. Jalankan: node seedFirebaseUsers.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// Daftar user yang akan dibuat
const users = [
  {
    email: 'admin@skillage-edupark.com',
    password: 'Admin@12345',
    displayName: 'Administrator',
    role: 'admin',
  },
  {
    email: 'editor@skillage-edupark.com',
    password: 'Editor@12345',
    displayName: 'Editor Utama',
    role: 'editor',
  },
  {
    email: 'writer@skillage-edupark.com',
    password: 'Writer@12345',
    displayName: 'Penulis Konten',
    role: 'writer',
  },
];

async function seedUsers() {
  console.log('Membuat user di Firebase...\n');

  for (const user of users) {
    try {
      // Buat user di Firebase Authentication
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });

      // Simpan role di Firestore collection 'users'
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ ${user.role.toUpperCase()} berhasil dibuat: ${user.email}`);
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        console.log(`⚠️  Email sudah ada: ${user.email} — dilewati`);
      } else {
        console.error(`❌ Gagal membuat ${user.email}:`, err.message);
      }
    }
  }

  console.log('\nSelesai!');
  process.exit(0);
}

seedUsers();
