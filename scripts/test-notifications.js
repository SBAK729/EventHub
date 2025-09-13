// Test script for notification system
const fetch = require('node-fetch');

const AI_WEBHOOK_URL = 'https://karanja-kariuki.app.n8n.cloud/webhook/90d9afd1-e9e1-4f79-ae14-aa3cde1d1247';
const ACCESS_PASS = process.env.KK_ACCESS_PASS || 'CFtMJFnPwxAT8EMI5aPOfS7fA4E9qA3dX';

async function testRSVPNotification() {
  console.log('Testing RSVP notification...');
  
  const testData = {
    name: "John Doe",
    email: "john.doe@example.com",
    event_title: "Test Event",
    event_date: "2024-01-15",
    event_time: "07:00 PM",
    event_place: "Test Location",
    reminder_type: "rsvp"
  };

  try {
    const response = await fetch(AI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'KK_ACCESS_PASS': ACCESS_PASS
      },
      body: JSON.stringify(testData)
    });

    console.log('RSVP Response status:', response.status);
    const result = await response.text();
    console.log('RSVP Response:', result);
  } catch (error) {
    console.error('RSVP Error:', error);
  }
}

async function testReminderNotification() {
  console.log('Testing Reminder notification...');
  
  const testData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    event_title: "Test Event Tomorrow",
    event_date: "2024-01-16",
    event_time: "06:00 PM",
    event_place: "Test Venue",
    reminder_type: "reminder"
  };

  try {
    const response = await fetch(AI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'KK_ACCESS_PASS': ACCESS_PASS
      },
      body: JSON.stringify(testData)
    });

    console.log('Reminder Response status:', response.status);
    const result = await response.text();
    console.log('Reminder Response:', result);
  } catch (error) {
    console.error('Reminder Error:', error);
  }
}

async function runTests() {
  console.log('Starting notification tests...\n');
  
  await testRSVPNotification();
  console.log('\n---\n');
  await testReminderNotification();
  
  console.log('\nTests completed!');
}

runTests();
