# Firebase Online Storage Setup Guide

This DigiDebt app is currently configured to store data locally in the browser using Zustand with persistence. To enable **online data storage** and sync across devices, follow these steps:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `digidebt-app`
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Firebase Services

### Authentication
1. Go to **Authentication** → **Get Started**
2. Enable sign-in methods:
   - Email/Password
   - Phone (for OTP)
   - Google Sign-In

### Firestore Database
1. Go to **Firestore Database** → **Create Database**
2. Choose **Production mode** (we'll add security rules)
3. Select a location close to your users

### Storage
1. Go to **Storage** → **Get Started**
2. Use default security rules for now

## 3. Install Firebase SDK

```bash
pnpm add firebase
```

## 4. Configure Firebase

1. In Firebase Console, go to **Project Settings** → **Your Apps**
2. Click **Web** icon (`</>`)
3. Register app with name: `DigiDebt Web`
4. Copy the configuration object
5. Update `src/app/services/firebase.ts` with your config

## 5. Firestore Security Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Customers subcollection
      match /customers/{customerId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Debts subcollection
      match /debts/{debtId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Payments subcollection
      match /payments/{paymentId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Expenses subcollection
      match /expenses/{expenseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 6. Update Store to Use Firebase

Modify `src/app/store/useStore.ts` to:
- Call Firebase functions instead of local storage
- Use real-time listeners for automatic sync
- Handle user authentication state

Example:
```typescript
// When user logs in, load their data from Firebase
login: async (user) => {
  set({ user, isAuthenticated: true });
  
  // Load user's data from Firebase
  const customers = await getCustomersFromFirebase(user.id);
  const debts = await getDebtsFromFirebase(user.id);
  const payments = await getPaymentsFromFirebase(user.id);
  
  set({ customers, debts, payments });
}
```

## 7. Update Authentication Screens

Modify `LoginScreen.tsx` and `RegisterScreen.tsx` to:
- Use Firebase Authentication
- Handle phone OTP login
- Implement Google Sign-In

## 8. Data Structure in Firestore

```
users/
  {userId}/
    profile: { name, email, phone, settings }
    customers/
      {customerId}: { name, phone, address, notes, createdAt }
    debts/
      {debtId}: { customerId, totalAmount, paidAmount, remainingAmount, currency, dueDate, status }
    payments/
      {paymentId}: { debtId, customerId, amount, currency, paymentMethod, createdAt }
    expenses/
      {expenseId}: { amount, category, notes, createdAt }
```

## 9. Benefits of Firebase Integration

✅ **Multi-device sync** - Access data from any device
✅ **Real-time updates** - See changes instantly
✅ **Offline support** - Works without internet, syncs when online
✅ **Backup & Security** - Data stored securely in the cloud
✅ **Scalability** - Handles growing business needs
✅ **Customer Access** - Customers can log in to view their own debts/payments

## 10. Customer Portal Feature

Once Firebase is set up, you can enable a **Customer Portal** where customers can:
- Log in with their phone number
- View their own debts and payment history
- Make payment confirmations
- Download receipts

To implement:
1. Create a separate route `/customer-portal`
2. Add customer authentication
3. Filter data by `customerId` instead of business owner `userId`

## Current Status

🟡 **Local Storage Mode** - Data stored in browser
🔵 **Ready for Firebase** - Code structure prepared
🟢 **Easy Migration** - Follow steps above to enable cloud storage

---

For more information, see [Firebase Documentation](https://firebase.google.com/docs)
