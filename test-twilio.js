// Test Twilio Configuration
require('dotenv').config();
const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

console.log('🔍 Testing Twilio Configuration...\n');
console.log('Account SID:', TWILIO_ACCOUNT_SID ? '✅ Found' : '❌ Missing');
console.log('Auth Token:', TWILIO_AUTH_TOKEN ? '✅ Found' : '❌ Missing');
console.log('Twilio Phone:', TWILIO_PHONE_NUMBER);

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Test sending SMS
const testPhoneNumber = '+919030774177';

console.log('\n📱 Attempting to send test SMS...');
console.log('From:', TWILIO_PHONE_NUMBER);
console.log('To:', testPhoneNumber);
console.log('Message: Test SMS from Emergency Response System\n');

client.messages.create({
    body: '🚨 Test SMS from Emergency Response System - If you receive this, your Twilio is working!',
    from: TWILIO_PHONE_NUMBER,
    to: testPhoneNumber
})
.then(message => {
    console.log('✅ SMS Sent Successfully!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    console.log('\n✅ Your Twilio credentials are working!');
    console.log('Check your phone for the test SMS at:', testPhoneNumber);
})
.catch(error => {
    console.log('❌ Error sending SMS:');
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('\n⚠️ Troubleshooting:');
    console.log('1. Verify Twilio Account SID is correct');
    console.log('2. Verify Twilio Auth Token is correct');
    console.log('3. Verify Twilio phone number is correct');
    console.log('4. Check if phone number is in Twilio Trial Mode whitelist');
    console.log('5. Ensure Twilio account has SMS capability enabled');
});
