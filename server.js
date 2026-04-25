/**
 * Rapid Crisis Response System - Backend Server
 * SMS Alert Handler using Twilio
 * 
 * Install dependencies:
 * npm install express twilio dotenv cors body-parser
 */

require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 7000;
app.use(express.static('public'));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Twilio Configuration
// Get these from your Twilio account: https://www.twilio.com/console
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890'; // Your Twilio phone number

// Initialize Twilio client
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Alert storage (in-memory, use database in production)
const emergencyAlerts = [];

/**
 * POST /api/send-emergency-sms
 * Sends emergency SMS to responder number
 */
app.post('/api/send-emergency-sms', async (req, res) => {
    try {
        const {
            to,
            emergencyType,
            senderName,
            senderPhone,
            senderEmail,
            location,
            message,
            timestamp
        } = req.body;

        // Validation
        if (!to || !emergencyType || !senderName || !senderPhone) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, emergencyType, senderName, senderPhone'
            });
        }

        // Format phone number (ensure it starts with +91 for India)
        let formattedPhone = to;
        if (!formattedPhone.startsWith('+')) {
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '+91' + formattedPhone.substring(1);
            } else if (formattedPhone.length === 10) {
                formattedPhone = '+91' + formattedPhone;
            } else if (!formattedPhone.startsWith('91')) {
                formattedPhone = '+91' + formattedPhone;
            } else {
                formattedPhone = '+' + formattedPhone;
            }
        }

        // Create alert object
        const alertRecord = {
            id: Date.now(),
            to: formattedPhone,
            emergencyType,
            senderName,
            senderPhone,
            senderEmail,
            location,
            timestamp,
            status: 'Processing',
            smsStatus: null,
            errorMessage: null
        };

        console.log('📱 Processing Emergency SMS:');
        console.log('  Emergency Type:', emergencyType);
        console.log('  Responder Number:', formattedPhone);
        console.log('  Sender:', senderName, '(' + senderPhone + ')');
        console.log('  Location:', location);

        // Send SMS via Twilio
        try {
            const smsResponse = await twilioClient.messages.create({
                body: message || createSMSMessage(emergencyType, senderName, senderPhone, location),
                from: TWILIO_PHONE_NUMBER,
                to: formattedPhone
            });

            alertRecord.smsStatus = 'Sent';
            alertRecord.status = 'Delivered';
            alertRecord.messageId = smsResponse.sid;
            alertRecord.sentAt = new Date().toISOString();

            // Store alert
            emergencyAlerts.push(alertRecord);

            console.log('✅ SMS Sent Successfully!');
            console.log('   Message SID:', smsResponse.sid);
            console.log('   Status:', smsResponse.status);

            return res.json({
                success: true,
                message: 'Emergency SMS sent successfully',
                messageId: smsResponse.sid,
                status: smsResponse.status,
                to: formattedPhone,
                emergencyType: emergencyType,
                sentAt: new Date().toISOString()
            });

        } catch (twilioError) {
            alertRecord.status = 'Failed';
            alertRecord.smsStatus = 'Error';
            alertRecord.errorMessage = twilioError.message;
            emergencyAlerts.push(alertRecord);

            console.error('❌ SMS Send Failed:');
            console.error('   Error:', twilioError.message);

            return res.status(500).json({
                success: false,
                error: 'Failed to send SMS',
                details: twilioError.message,
                alertStored: true
            });
        }

    } catch (error) {
        console.error('❌ Server Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * GET /api/alerts
 * Retrieve all emergency alerts (for admin dashboard)
 */
app.get('/api/alerts', (req, res) => {
    try {
        const alerts = emergencyAlerts.sort((a, b) => b.id - a.id); // Most recent first
        return res.json({
            success: true,
            totalAlerts: alerts.length,
            alerts: alerts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve alerts'
        });
    }
});

/**
 * GET /api/alerts/:id
 * Retrieve specific alert
 */
app.get('/api/alerts/:id', (req, res) => {
    try {
        const alertId = parseInt(req.params.id);
        const alert = emergencyAlerts.find(a => a.id === alertId);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        return res.json({
            success: true,
            alert: alert
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve alert'
        });
    }
});

/**
 * POST /api/alerts/acknowledge/:id
 * Mark alert as acknowledged
 */
app.post('/api/alerts/acknowledge/:id', (req, res) => {
    try {
        const alertId = parseInt(req.params.id);
        const alert = emergencyAlerts.find(a => a.id === alertId);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        alert.acknowledged = true;
        alert.acknowledgedAt = new Date().toISOString();

        return res.json({
            success: true,
            message: 'Alert acknowledged',
            alert: alert
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to acknowledge alert'
        });
    }
});

/**
 * DELETE /api/alerts/:id
 * Delete an alert
 */
app.delete('/api/alerts/:id', (req, res) => {
    try {
        const alertId = parseInt(req.params.id);
        const index = emergencyAlerts.findIndex(a => a.id === alertId);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        const deletedAlert = emergencyAlerts.splice(index, 1);

        return res.json({
            success: true,
            message: 'Alert deleted',
            deletedAlert: deletedAlert[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to delete alert'
        });
    }
});

/**
 * GET /api/stats
 * Get emergency statistics
 */
app.get('/api/stats', (req, res) => {
    try {
        const stats = {
            totalAlerts: emergencyAlerts.length,
            sentAlerts: emergencyAlerts.filter(a => a.smsStatus === 'Sent').length,
            failedAlerts: emergencyAlerts.filter(a => a.smsStatus === 'Error').length,
            percentageSuccess: emergencyAlerts.length > 0 
                ? Math.round((emergencyAlerts.filter(a => a.smsStatus === 'Sent').length / emergencyAlerts.length) * 100)
                : 0,
            alertsByType: {},
            alertsByStatus: {}
        };

        // Count by type
        emergencyAlerts.forEach(alert => {
            stats.alertsByType[alert.emergencyType] = (stats.alertsByType[alert.emergencyType] || 0) + 1;
            stats.alertsByStatus[alert.smsStatus] = (stats.alertsByStatus[alert.smsStatus] || 0) + 1;
        });

        return res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve stats'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    return res.json({
        success: true,
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        twilio: {
            configured: TWILIO_ACCOUNT_SID !== 'your_account_sid'
        }
    });
});

/**
 * Helper function to create SMS message
 */
function createSMSMessage(emergencyType, senderName, senderPhone, location) {
    return `🚨 EMERGENCY ALERT 🚨
Type: ${emergencyType}
Name: ${senderName}
Phone: ${senderPhone}
Lat: ${location.latitude.toFixed(4)}
Lng: ${location.longitude.toFixed(4)}
Map: ${location.url}`;
}
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  Rapid Crisis Response System - Backend Server        ║');
    console.log('║  SMS Alert Handler with Twilio Integration            ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('API Endpoints:');
    
    console.log('  POST   /api/send-emergency-sms  - Send emergency SMS');
    console.log('  GET    /api/alerts              - Get all alerts');
    console.log('  GET    /api/alerts/:id          - Get specific alert');
    console.log('  POST   /api/alerts/acknowledge/:id - Mark as acknowledged');
    console.log('  DELETE /api/alerts/:id          - Delete alert');
    console.log('  GET    /api/stats               - Get statistics');
    console.log('  GET    /api/health              - Health check');
    console.log('');
    
    // Check Twilio configuration
    if (TWILIO_ACCOUNT_SID === 'your_account_sid') {
        console.warn('⚠️  WARNING: Twilio credentials not configured!');
        console.warn('   Please set environment variables:');
        console.warn('   - TWILIO_ACCOUNT_SID');
        console.warn('   - TWILIO_AUTH_TOKEN');
        console.warn('   - TWILIO_PHONE_NUMBER');
    } else {
        console.log('✅ Twilio configured and ready');
    }
    console.log('');
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

module.exports = app;
