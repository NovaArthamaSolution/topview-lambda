const handler = require('./index').handler; // Adjust path to your Lambda file

async function testLambda() {
  const event = {}; // Simulate an empty Lambda event
  const context = {}; // Optional: Add context if needed
  try {
    const result = await handler(event, context);
    console.log('Lambda Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testLambda();