# 🚀 Quick Start: SMS Backend Setup

## 5 Minutes Setup

### Step 1️⃣: Get Twilio Credentials (2 minutes)

1. Go to **https://www.twilio.com/try-twilio**
2. Sign up → Verify phone → Confirm email
3. Go to **https://www.twilio.com/console**
4. Copy these 2 values:
   - **Account SID** (looks like: ACxxxxxxxx...)
   - **Auth Token** (looks like: your_token_here)
5. Buy a phone number: Phone Numbers → Buy → Choose country → Buy (costs ~$1)
6. Copy your new phone number (like: +1234567890)

### Step 2️⃣: Setup Server (3 minutes)

**Open PowerShell in your project folder and run:**

```powershell
npm install
```

Wait for it to finish...

### Step 3️⃣: Add Credentials

Open `.env` file in the editor and replace:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Save and close.

### Step 4️⃣: Start Server

In PowerShell, run:

```powershell
npm start
```

✅ You should see:
```
✅ Server running on http://localhost:5000
✅ Twilio configured and ready
```

## ✅ Now Test It!

### Test 1: Using PowerShell

```powershell
$body = @{
    "to" = "9030774177"
    "emergencyType" = "Fire Emergency"
    "senderName" = "Test User"
    "senderPhone" = "1234567890"
    "senderEmail" = "test@example.com"
    "location" = @{
        "latitude" = 40.7128
        "longitude" = -74.0060
        "url" = "https://maps.google.com?q=40.7128,-74.0060"
    }
    "message" = "Test SMS"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/send-emergency-sms" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Look for response: `"success": true`

### Test 2: Click SOS in Web App

1. Open your web app
2. Sign in 
3. Click "Emergency Help" → Select any emergency → Click SOS button
4. Check if you get an SMS!

## 🔧 Troubleshooting

**❌ "Can't connect to server"**
- Server not running? Run `npm start` again
- Wrong URL? Make sure it's `http://localhost:5000`

**❌ "SMS not sending but says 'Sent'"**
- Check `.env` file - are credentials correct?
- In Twilio Console, did you buy a phone number?
- Are you using trial account? Add recipient number as verified

**❌ "Module not found"**
- Run `npm install` again
- Make sure you're in the project folder

**❌ "Port 5000 already in use"**
- Run different port: `PORT=3001 npm start`

## 📱 Indian Numbers Format

For Indian phone numbers:
- ✅ Correct: `9030774177` or `+919030774177`
- ✅ Correct: `+91-9030774177`
- ❌ Wrong: `09030774177` or `919030774177` (missing +)

The backend automatically converts, but best to use `+91` format.

## 🎯 Next Steps

1. ✅ SMS working?
2. If yes → Celebrate! 🎉
3. Test all emergency types
4. Deploy to production

## Need Help?

Check the detailed guide: `TWILIO_SETUP.md`

Or visit: https://www.twilio.com/docs/sms/quickstart/node
