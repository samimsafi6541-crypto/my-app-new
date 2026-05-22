# DigiDebt - Smart Bookkeeping & Debt Management

A modern, production-ready bookkeeping and debt management application for small businesses, shops, and personal finances.

## 🌟 Features

### Core Functionality
- ✅ **Customer Management** - Add, edit, delete customers with contact details
- ✅ **Debt Tracking** - Track debts with partial payments and status updates
- ✅ **Payment Processing** - Record payments and auto-calculate remaining balances
- ✅ **Expense Management** - Categorized expense tracking
- ✅ **Dashboard Analytics** - Visual charts and KPI cards by currency
- ✅ **Reports** - Generate daily, weekly, monthly reports

### Multi-Currency Support
- 💰 USD (US Dollar) - $
- 💰 EUR (Euro) - €
- 💰 AFN (Afghan Afghani) - ؋
- 💰 PKR (Pakistani Rupee) - ₨

### Communication & Export
- 📱 **WhatsApp Integration** - Send debt reminders and payment receipts
- 📄 **PDF Export** - Customer statements and reports
- 📊 **Excel Export** - Detailed financial data
- 🔔 **Notifications** - Payment reminders and alerts

### Localization
- 🌐 **5 Languages** - English, Pashto (پښتو), Dari (دری), Urdu (اردو), Arabic (العربية)
- 🎨 **RTL Support** - Right-to-left layout for Arabic, Urdu, Pashto, Dari
- 🌓 **Dark Mode** - Full dark theme with system preference detection

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router 7
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **PDF/Excel**: jsPDF, xlsx
- **Build Tool**: Vite

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
# (Server is already running in Figma Make environment)
```

## 🎯 Usage

### Login
- Use any email/password to login (demo authentication)
- Default user: Demo User

### Quick Start
1. **Add Customers** - Navigate to Customers page
2. **Create Debts** - Add debts with currency and due dates
3. **Record Payments** - Track payments against debts
4. **View Dashboard** - See analytics by currency
5. **Generate Reports** - Export PDF/Excel reports

### WhatsApp Features
- **Send Debt Reminders** - Click WhatsApp button on debt cards
- **Send Payment Receipts** - Share payment confirmations via WhatsApp
- **Customer Statements** - Export and share customer statements

### Export Options
- **Customer Statements** - Detailed PDF with debts and payments
- **Business Reports** - PDF/Excel with currency filtering
- **All Data** - Complete export of debts and payments

## 🏗️ Project Structure

```
src/app/
├── components/        # Reusable UI components
├── layouts/          # Page layouts (RootLayout)
├── screens/          # Page components
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── CustomersScreen.tsx
│   ├── DebtsScreen.tsx
│   ├── PaymentsScreen.tsx
│   ├── ExpensesScreen.tsx
│   ├── ReportsScreen.tsx
│   └── SettingsScreen.tsx
├── store/            # Zustand state management
├── types/            # TypeScript interfaces
├── utils/            # Utility functions
│   ├── currency.ts   # Currency formatting
│   ├── i18n.ts       # Internationalization
│   ├── export.ts     # PDF/Excel/WhatsApp
│   └── seedData.ts   # Sample data
└── services/         # External services (Firebase ready)
```

## 🔧 Configuration

### Change Currency
Navigate to Settings → Currency Selection

### Change Language
Navigate to Settings → Language Selection

### Toggle Dark Mode
Navigate to Settings → Theme

## 📱 Online Storage (Firebase Ready)

The app is currently in **local storage mode** but is fully prepared for Firebase integration. See `FIREBASE_SETUP.md` for detailed instructions on:
- Setting up Firebase project
- Configuring Firestore database
- Enabling user authentication
- Implementing real-time sync
- Creating customer portal

## 🌍 Market Focus

Optimized for:
- 🇦🇫 Afghanistan (AFN currency, Pashto/Dari languages)
- 🇵🇰 Pakistan (PKR currency, Urdu language)
- 🇮🇳 India (multi-language support)
- 🌐 International (USD, EUR support)

## 📊 Sample Data

The app includes realistic demo data:
- 5 sample customers
- 8 sample debts (across all currencies)
- 6 sample payments
- Transaction history

## 🔐 Security Features (When Using Firebase)

- User authentication (Email, Phone, Google)
- Role-based access control
- Secure Firestore rules
- Data encryption
- Customer data isolation

## 📝 Feature Roadmap

### Phase 1 (Current) ✅
- Core debt management
- Multi-currency support
- PDF/Excel exports
- WhatsApp integration
- Multi-language support
- Dark mode

### Phase 2 (Firebase Integration)
- [ ] Online data storage
- [ ] Multi-device sync
- [ ] Customer portal login
- [ ] Real-time notifications
- [ ] Cloud backup

### Phase 3 (Advanced Features)
- [ ] QR code payments
- [ ] Barcode scanner
- [ ] Voice notes
- [ ] Multi-shop support
- [ ] Team member accounts
- [ ] Inventory management

## 🤝 Support

For issues or questions:
1. Check `FIREBASE_SETUP.md` for online storage setup
2. Review sample data in `src/app/utils/seedData.ts`
3. Examine component structure in `src/app/screens/`

## 📄 License

Production-ready code for small business bookkeeping.

---

**Built with ❤️ for small businesses worldwide**
