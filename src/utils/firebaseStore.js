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
    getDoc,
    setDoc,
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
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    // ---- 上方為 firebase/firestore API  ----
    db,
}
