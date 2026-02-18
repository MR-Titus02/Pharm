# 🚀 PharMS Quick Start Guide

## Starting the Application

### Step 1: Start Backend Server
```bash
cd D:\Pharmacy\server
npm start
```
✅ Backend runs on: **http://localhost:5001**  
✅ Watch for: "MongoDB Connected" message

### Step 2: Start Frontend Server  
```bash
cd D:\Pharmacy\client
npm run dev
```
✅ Frontend runs on: **http://localhost:5175**  
✅ Browser automatically opens to login page

---

## 🔐 How to Login

### Create New Account
1. Click "Don't have an account? Register" on login page
2. Fill in: Name, Email, NIC (test: 123456789V), Password
3. Click "Register"
4. Login with credentials

### Test Accounts (if database has seed data)
- **Admin**: admin@pharmacy.com / admin123
- **User**: user@test.com / user123

---

## 👤 User Features

### Browse Medicines
1. Click "Browse Medicines" on dashboard
2. Use search bar to find specific medicine
3. Click medicine card to view details
4. Check stock status and prescription requirement

### Create Request
1. Click "New Request" button
2. Select medicine from dropdown
3. If prescription required: Upload prescription file
4. Enter NIC (if required)
5. Click "Submit Request"

### Track Requests
1. Click "My Requests" to view all your requests
2. See status: Pending → Approved → Payment → Delivered
3. Click payment button for approved requests
4. View delivery status in the table

### Make Payment
1. After request approved, click "Pay"
2. Enter card details (test: 4111 1111 1111 1111, any expiry/CVC)
3. Click "Pay Now"
4. You receive order receipt

---

## 👨‍💼 Admin Features

### Admin Dashboard
- **Quick Stats**: Users, medicines, pending requests
- **Revenue**: Total money received
- **Pending Actions**: Requests waiting approval
- **Shipment Status**: Orders in transit

### Approve Requests
1. Click "Review Requests" from admin dashboard
2. See pending requests in table
3. Click "✓" to approve or "✕" to reject
4. Add optional note and submit

### Update Delivery Status
1. In requests table, click "Delivery" dropdown (for paid requests only)
2. Select: Pending → Shipped → Delivered → Cancelled
3. Status auto-updates in user's account

### Manage Medicines
1. Click "Manage Medicines"
2. **Add**: Click "Add New Medicine"
3. **Edit**: Click medicine row
4. **Delete**: Click delete icon (with confirmation)

### View Payments
1. Click "View Payments" from admin dashboard
2. See all completed transactions
3. Filter by: All, Paid, Pending, Failed
4. Summary cards show total revenue & average order value

### Manage Categories
1. Click "Manage Categories"
2. View, add, edit, delete medicine categories
3. Categories used for medicine organization

### Manage Users
1. Click "Manage Users"
2. View all registered users
3. See user details: name, email, NIC, registration date

---

## 📱 Key Pages

### User Pages
| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | / | Personal stats & quick actions |
| Browse Medicines | /medicines | Medicine catalog |
| Medicine Details | /medicines/:id | View full medicine info |
| My Requests | /requests | View all prescriptions |
| New Request | /requests/new | Submit new request |
| Payment | /payment | Pay for approved request |

### Admin Pages
| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | /admin | System metrics & quick actions |
| Review Requests | /admin/requests | Approve/reject prescriptions |
| Manage Medicines | /admin/medicines | CRUD medicines |
| Add Medicine | /admin/medicines/new | Add new medicine |
| Manage Categories | /admin/categories | CRUD categories |
| View Payments | /admin/payments | Transaction history |
| Manage Users | /admin/users | User management |

---

## 🔗 API Endpoints (Quick Reference)

### Authentication
```
POST /api/auth/register    - Create account
POST /api/auth/login       - User login
```

### Medicines
```
GET  /api/medicines?page=1&limit=10   - List with pagination
GET  /api/medicines/:id               - Get specific medicine
POST /api/medicines                   - Add (admin only)
PUT  /api/medicines/:id               - Edit (admin only)
DELETE /api/medicines/:id             - Delete (admin only)
```

### Requests
```
GET  /api/requests/user?page=1&limit=10  - User's requests
GET  /api/requests?page=1&limit=10       - All requests (admin)
POST /api/requests                       - Create request
PUT  /api/requests/:id                   - Approve/reject (admin)
PUT  /api/requests/:id/delivery          - Update delivery (admin)
```

### Payments
```
POST /api/payments/process           - Process payment
GET  /api/payments?page=1&limit=10   - Payment history (admin)
```

### Reports
```
GET /api/reports/user-stats  - User stats
GET /api/reports/admin       - Admin metrics
```

---

## 🛠️ Common Tasks

### Seed Database with Sample Data
```bash
# In server directory
# Create medicineSeeds.js with sample medicines
node scripts/seedDatabase.js
```

### Build for Production
```bash
cd client
npm run build
# Creates dist/ folder ready for deployment
```

### Check Logs
```bash
# Backend logs show in terminal where npm start runs
# Frontend logs show in browser console (F12)
```

---

## 🐛 Troubleshooting

### Frontend won't load
- ✓ Check backend is running (port 5001)
- ✓ Check frontend on correct port (5175)
- ✓ Clear browser cache (Ctrl+Shift+Delete)

### Can't login
- ✓ Verify user account exists
- ✓ Check Database connection (should see MongoDB Connected)
- ✓ Try creating new account

### Pagination not working
- ✓ Page should be 1+ and ≤ total pages
- ✓ Check Network tab (F12) for API response

### File upload fails
- ✓ File size must be < 5MB
- ✓ Only images & PDFs allowed
- ✓ Check file extension

### Delivery status locked
- ✓ Only shows dropdown if request status = "approved" AND payment = "paid"
- ✓ Admin use must approve request first, then user must pay

---

## 📊 System Status

### Health Check
```bash
# Backend is healthy if:
curl http://localhost:5001/api/reports/dashboard

# Frontend is healthy if:
http://localhost:5175 loads without errors
```

### Database Status
- Connected to: MongoDB Atlas
- Status shown on server startup
- If error: Check .env file for connection string

---

## 💾 Data Persistence

- All data stored in MongoDB Atlas
- No local database needed
- Data persists between server restarts
- Backups available in MongoDB Atlas console

---

## 🎓 Next Learning Steps

1. **Modify UI**: Edit TailwindCSS classes in React components
2. **Add Fields**: Modify MongoDB schema in model files
3. **Create Endpoint**: Add route + controller + service
4. **Deploy**: Use Vercel (frontend) + Heroku/Render (backend)

---

## 📞 Support

For issues:
1. Check error message in terminal/console
2. Look at Network tab (F12) for API errors
3. Check MongoDB connection
4. Review server logs in terminal
5. Check frontend console for React errors

---

**PharMS v1.0 - Production Ready**
