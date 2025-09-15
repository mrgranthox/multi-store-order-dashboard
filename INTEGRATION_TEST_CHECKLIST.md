# MultiStore Admin Dashboard Integration Test Checklist

## 1. Environment Setup
- [ ] MultiStore Backend is running on port 4000
- [ ] Strapi CMS is running on port 1337
- [ ] Admin Dashboard is running on port 3000
- [ ] All environment variables are set correctly in `.env`

## 2. Authentication
- [ ] Login as Admin works
- [ ] Login as Store Manager works
- [ ] Invalid login shows error notification
- [ ] Token refresh works (wait for token expiry or force refresh)
- [ ] Logout clears session and redirects to login

## 3. Role-Based Access Control (RBAC)
- [ ] Admin sees all modules and settings
- [ ] Store Manager sees only assigned stores/products
- [ ] Manager cannot access admin-only pages (users, settings)
- [ ] Forbidden actions show error notification

## 4. CRUD Operations
### Stores
- [ ] Create, edit, delete store as Admin
- [ ] Store changes reflected in backend and dashboard

### Products & Categories
- [ ] Create, edit, delete product via dashboard (Strapi API)
- [ ] Create, edit, delete category via dashboard (Strapi API)
- [ ] Product/category changes reflected in dashboard and Strapi

### Orders
- [ ] Create, update, delete order via dashboard
- [ ] Order status updates reflected in backend and dashboard

### Users
- [ ] Admin can view, edit, deactivate users
- [ ] Manager cannot access users page

### Inventory
- [ ] Update inventory via dashboard and Strapi
- [ ] Low stock alerts appear in dashboard

### Promotions & Banners
- [ ] Create, edit, delete promotion
- [ ] Create, edit, delete banner

## 5. Real-Time Events (Socket.IO)
- [ ] Dashboard connects to backend in real time after login
- [ ] Creating/updating order triggers real-time update in dashboard
- [ ] Inventory update triggers real-time update in dashboard
- [ ] Product update triggers real-time update in dashboard
- [ ] Notification event triggers toast in dashboard
- [ ] Disconnecting backend shows warning notification

## 6. Webhook Integration
- [ ] Update product in Strapi triggers webhook to backend
- [ ] Backend emits real-time event to dashboard
- [ ] Dashboard receives and displays update

## 7. Error Handling & Notifications
- [ ] Invalid API requests show user-friendly error
- [ ] Network disconnect shows notification
- [ ] All real-time events show toast notifications
- [ ] Forbidden actions show error notification

## 8. Analytics & Dashboard
- [ ] KPI cards show correct stats
- [ ] Charts display sales and order data
- [ ] Recent orders and low stock alerts update in real time

## 9. UI/UX & Responsiveness
- [ ] Sidebar and topbar work on all screen sizes
- [ ] All pages are mobile-friendly
- [ ] Theme toggle (light/dark) works

## 10. Final Checks
- [ ] All features work as expected for both roles
- [ ] No console errors or unhandled exceptions
- [ ] Build passes with no TypeScript errors
- [ ] All environment variables are documented

---

**Result:**
- [ ] Integration is complete and production-ready
