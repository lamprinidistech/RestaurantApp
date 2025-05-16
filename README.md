#  Restaurant  App

Μια πλήρης εφαρμογή κρατήσεων εστιατορίων με Node.js στο backend και React Native (Expo) στο frontend. Οι χρήστες μπορούν να εγγραφούν, να συνδεθούν, να κάνουν κρατήσεις και να δουν το ιστορικό τους.

---

## 📽️ Βίντεο Παρουσίασης | Project Demo Video

[![Δείτε την παρουσίαση](https://img.youtube.com/vi/rPV9cfTbVoE/0.jpg)](https://youtube.com/shorts/rPV9cfTbVoE?feature=share)

▶️ Πατήστε στην εικόνα για να δείτε την παρουσίαση.

---

##  Τεχνολογίες

### Backend:
- Node.js + Express.js
- MariaDB
- JWT για authentication
- bcryptjs για κρυπτογράφηση
- dotenv για περιβαλλοντικές μεταβλητές

### Frontend (Expo App):
- React Native (Expo Router)
- Axios για API calls
- AsyncStorage για αποθήκευση token
- Animated API για UI transitions

---

## ⚙️ Οδηγίες Εγκατάστασης

### Backend

## 1. Δημιούργησε βάση δεδομένων `restaurant_booking` στη MySQL
 ## 2. Δημιούργησε `.env` αρχείο με:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin123
DB_PORT=3308
DB_NAME=restaurant_booking
JWT_SECRET=your_secret_key


### 3. Εγκατάσταση εξαρτήσεων και εκκίνηση:

```bash
npm install
node app.js
Frontend
Πήγαινε στον φάκελο frontend/

bash
Αντιγραφή
Επεξεργασία
cd frontend
npm install
npx expo start

2 Στο config.js, άλλαξε το LOCAL_IP με το IP του backend σου.

## Λειτουργικότητα
Login & Register
Φόρμα σύνδεσης και εγγραφής

Αποθήκευση JWT token

Πλοήγηση βάσει session

Κρατήσεις
Προβολή εστιατορίων

Αναζήτηση με βάση όνομα

Επιλογή ημερομηνίας, ώρας και ατόμων

Επιβεβαίωση κράτησης

Προφίλ
Προβολή ιστορικού κρατήσεων

Διαγραφή κράτησης

Διάκριση μελλοντικών και παρελθοντικών κρατήσεων

📂 Δομή Project
RestaurantApp/
├── app.js
├── db.js
├── .env
├── package.json
├── package-lock.json
├── middleware/
│ └── auth.js
├── routes/
│ ├── auth.js
│ ├── reservations.js
│ └── restaurants.js
└── frontend/
└── app/
├── restaurants/
│ ├── index.js
│ └── RestaurantsScreen.js
├── booking.js
├── config.js
├── index.js
├── login.js
├── LoginScreen.js
├── profile.js
├── _layout.tsx
└── +not-found.tsx
