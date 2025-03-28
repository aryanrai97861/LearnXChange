const fetch = require('node-fetch');

async function testConnection() {
    try {
        // Test the backend API
        const response = await fetch('http://localhost:5000/api/test');
        const data = await response.json();
        
        console.log('Backend Connection Test:');
        console.log('Status:', response.status);
        console.log('Message:', data.message);
        console.log('Database Status:', data.dbStatus);
        
        if (response.status === 200) {
            console.log('\n✅ Backend is running and connected to MongoDB');
        } else {
            console.log('\n❌ Backend is not responding correctly');
        }
    } catch (error) {
        console.error('\n❌ Error connecting to backend:', error.message);
    }
}

testConnection(); 