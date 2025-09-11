# UptimeRobot Setup Guide for RentEasy

## 🎯 **Purpose**
UptimeRobot will ping your Render backend every 5 minutes to prevent it from sleeping, keeping your API always responsive.

## 📋 **Prerequisites**
- Your RentEasy app deployed on Render.com
- Backend URL (e.g., `https://renteasy-backend.onrender.com`)

## 🔧 **Setup Steps**

### **Step 1: Create UptimeRobot Account**
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Click "Sign Up" (free account)
3. Verify your email

### **Step 2: Add Your Backend Monitor**
1. **Login** to UptimeRobot dashboard
2. Click **"+ Add New Monitor"**
3. **Monitor Type**: HTTP(s)
4. **Friendly Name**: `RentEasy Backend API`
5. **URL**: `https://YOUR_BACKEND_URL.onrender.com/healthz`
6. **Monitoring Interval**: 5 minutes
7. **Monitor Timeout**: 30 seconds
8. **Click "Create Monitor"**

### **Step 3: Configure Notifications (Optional)**
1. Go to **"My Settings"** → **"Alert Contacts"**
2. Add your email for downtime notifications
3. Set up mobile app for instant alerts

## ✅ **What This Does**
- **Pings your backend** every 5 minutes
- **Prevents sleep mode** on Render free tier
- **Sends alerts** if your backend goes down
- **Tracks uptime** statistics

## 🔍 **Health Check Endpoint**
Your backend already has a health endpoint at `/healthz` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-11T18:30:00Z"
}
```

## 📊 **Expected Results**
- **Uptime**: 99.9%+
- **Response Time**: < 1 second
- **No Cold Starts**: Backend stays warm
- **Free Cost**: $0/month

## 🚨 **Troubleshooting**
- **Monitor shows "Down"**: Check if your backend URL is correct
- **Still sleeping**: Verify the health endpoint is accessible
- **False alerts**: Adjust timeout settings if needed

## 📱 **Mobile App**
Download UptimeRobot mobile app for instant notifications and monitoring on the go.

---
**Note**: This setup keeps your backend awake 24/7 without any cost, making it perfect for development and small production apps.
