// Firebase Configuration for Online Data Storage
// Uncomment and configure when ready to deploy with Firebase

/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
*/

// Example Firebase operations for when you're ready:
/*
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

// Add a customer
export async function addCustomerToFirebase(userId: string, customer: Customer) {
  const customersRef = collection(db, 'users', userId, 'customers');
  return await addDoc(customersRef, customer);
}

// Get all customers for a user
export async function getCustomersFromFirebase(userId: string) {
  const customersRef = collection(db, 'users', userId, 'customers');
  const snapshot = await getDocs(customersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add a debt
export async function addDebtToFirebase(userId: string, debt: Debt) {
  const debtsRef = collection(db, 'users', userId, 'debts');
  return await addDoc(debtsRef, debt);
}

// Add a payment
export async function addPaymentToFirebase(userId: string, payment: Payment) {
  const paymentsRef = collection(db, 'users', userId, 'payments');
  return await addDoc(paymentsRef, payment);
}

// Real-time listener example
export function listenToCustomers(userId: string, callback: (customers: Customer[]) => void) {
  const customersRef = collection(db, 'users', userId, 'customers');
  return onSnapshot(customersRef, (snapshot) => {
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(customers);
  });
}
*/

export {};
