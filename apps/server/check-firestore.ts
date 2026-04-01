import { db } from './src/config/firebase';

async function listDocs() {
  try {
    const snapshot = await db.collection('userProgress').get();
    console.log(`Found ${snapshot.size} documents in userProgress collection`);
    snapshot.forEach(doc => console.log(doc.id));
  } catch (err) {
    console.error('Error:', err);
  }
}

listDocs();