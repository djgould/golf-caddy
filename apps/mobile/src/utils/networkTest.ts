import { API_URL, TRPC_ENDPOINT } from '../config/trpc';

export async function testNetworkConnection() {
  console.log('🧪 Testing network connection...');
  console.log('API_URL:', API_URL);
  console.log('TRPC_ENDPOINT:', TRPC_ENDPOINT);

  try {
    // Test tRPC health endpoint
    const healthUrl = `${TRPC_ENDPOINT}/health.check`;
    console.log('Testing URL:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.text();
      console.log('✅ API is reachable:', data);
      return true;
    } else {
      console.error('❌ API responded with error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Response body:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Network connection failed:', error);
    
    // Also try a simple connection test
    try {
      console.log('🔄 Trying simple connection test...');
      const simpleResponse = await fetch(API_URL, { method: 'GET' });
      console.log('Simple connection status:', simpleResponse.status);
    } catch (simpleError) {
      console.error('❌ Simple connection also failed:', simpleError);
    }
    
    return false;
  }
}

// Auto-run test in development
if (__DEV__) {
  setTimeout(() => {
    testNetworkConnection();
  }, 1000);
}