import {
    getFirestore,
    collection,
    getDocs,
    doc,
    addDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore'

import { app } from './firebaseApp'

// 初始化 Firestore Instance
// doc: https://firebase.google.com/docs/reference/js/firestore_#getfirestore
const db = getFirestore(app)

export {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    // ---- 上方為 firebase/firestore API  ----
    db,
}
