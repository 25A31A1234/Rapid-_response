# Twilio SMS Setup Guide

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up with your email and phone number
3. Verify your phone number (you'll receive an SMS code)
4. Create your account

## Step 2: Get Your Twilio Credentials

1. Go to https://www.twilio.com/console
2. You'll see your **Account SID** and **Auth Token** on the dashboard
3. Copy both values (keep them safe - never share these!)

## Step 3: Get a Twilio Phone Number

1. In the Twilio Console, go to **Phone Numbers** (left menu)
2. Click **Buy a Number**
3. Select your country and area code
4. Purchase a phone number (usually $1/month)
5. You'll get a phone number that looks like: `+1234567890`

## Step 4: Setup Backend

### Install Dependencies

```bash
npm install express twilio cors dotenv body-parser
```

### Create .env File

1. In the `unnown` folder, create a file named `.env`
2. Copy this content and fill with YOUR values:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=5000
```

Replace:
- `ACxxxxxxxxxxxxxxxxxxxxx` with your Account SID from Twilio Console
- `your_auth_token_here` with your Auth Token
- `+1234567890` with your Twilio phone number

### Run the Server

```bash
node server.js
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║  Rapid Crisis Response System - Backend Server        ║
║  SMS Alert Handler with Twilio Integration            ║
╚════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:5000
✅ Twilio configured and ready
```

## Step 5: Test SMS Sending

### Using cURL (Windows PowerShell):

```powershell
$body = @{
    to = "9030774177"
    emergencyType = "Fire Emergency"
    senderName = "John Doe"
    senderPhone = "9876543210"
    senderEmail = "john@example.com"
    location = @{
        latitude = 40.7128
        longitude = -74.0060
        url = "https://maps.google.com?q=40.7128,-74.0060"
    }
    message = "Test SMS"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/send-emergency-sms" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Using Postman:

1. Open Postman
2. Create a new POST request
3. URL: `http://localhost:5000/api/send-emergency-sms`
4. Headers: `Content-Type: application/json`
5. Body (JSON):
```json
{
    "to": "9030774177",
    "emergencyType": "Fire Emergency",
    "senderName": "John Doe",
    "senderPhone": "9876543210",
    "senderEmail": "john@example.com",
    "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "url": "https://maps.google.com?q=40.7128,-74.0060"
    },
    "message": "🚨 EMERGENCY ALERT\nType: Fire Emergency\nName: John Doe\nPhone: 9876543210"
}
```

6. Click **Send**

## Step 6: Connect Frontend to Backend

Make sure your frontend is configured to:

1. Use correct backend URL (if not localhost, update in `uploadSOS()` function)
2. The frontend will automatically send SMS when SOS button is clicked

## Troubleshooting

### "SMS Send Failed" or Not Receiving SMS

**Issue 1: Invalid Twilio Credentials**
- Double-check your Account SID and Auth Token
- Make sure `.env` file has correct values
- Restart the server after changing `.env`

**Issue 2: Twilio Phone Number Not Verified**
- In Twilio Console, check if the phone number is in trial mode
- Trial accounts can only send SMS to verified numbers
- Add recipient phone number as a verified destination in Console

**Issue 3: Invalid Phone Number Format**
- Indian numbers: Use format `+919876543210` or `9876543210` 
- The backend will auto-format, but ensure it starts with +91 for India

**Issue 4: Backend Not Running**
- Ensure server is running: `node server.js`
- Check if port 5000 is not already in use
- Try different port: `PORT=3000 node server.js`

**Issue 5: CORS Errors**
- Frontend and backend must be on same/different domains with CORS enabled
- Ensure frontend calls the correct backend URL

## API Endpoints

After server starts, available endpoints:

```
POST   /api/send-emergency-sms       - Send SMS
GET    /api/alerts                   - Get all alerts
GET    /api/alerts/:id               - Get specific alert
POST   /api/alerts/acknowledge/:id   - Acknowledge alert
DELETE /api/alerts/:id               - Delete alert
GET    /api/stats                    - Get statistics
GET    /api/health                   - Health check
```

## Advanced: Trial vs Production

### Twilio Trial Account
- ✅ Free, easy to setup
- ✅ Good for testing
- ❌ Can only send SMS to verified numbers
- ❌ Limited messages

### Twilio Production Account
- ✅ Send SMS to any number
- ✅ Unlimited messages (pay per SMS)
- ❌ Costs money
- ❌ Need to verify identity

## Need Help?

- Twilio Docs: https://www.twilio.com/docs/sms
- Status Page: https://status.twilio.com
- Support: https://www.twilio.com/console/help
