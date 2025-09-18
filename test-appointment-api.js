// Script de test pour diagnostiquer le problème de RDV
// À exécuter depuis la console du navigateur sur différents PC

async function testAppointmentAPI() {
  console.log('🔍 Testing appointment API...');
  
  const testAppointment = {
    id: `test_${Date.now()}`,
    nom: "Test",
    prenom: "User",
    telephone1: "123456789",
    telephone2: "",
    date: "2024-01-01",
    time: "10:00:00",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  try {
    console.log('📤 Sending test appointment:', testAppointment);
    
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAppointment),
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', [...response.headers.entries()]);
    
    const result = await response.text();
    console.log('📥 Response body:', result);
    
    if (response.ok) {
      console.log('✅ API test successful!');
      
      // Test GET pour vérifier si le RDV a été sauvegardé
      const getResponse = await fetch('/api/appointments');
      const appointments = await getResponse.json();
      console.log('📋 All appointments:', appointments);
      
      const testAppointmentExists = appointments.some(apt => apt.id === testAppointment.id);
      console.log('🔍 Test appointment exists in database:', testAppointmentExists);
      
    } else {
      console.log('❌ API test failed!');
      console.log('Error details:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    console.log('🔍 Error type:', error.name);
    console.log('🔍 Error message:', error.message);
  }
}

// Test de connectivité de base
async function testConnectivity() {
  console.log('🌐 Testing basic connectivity...');
  
  try {
    const response = await fetch('/api/appointments', {
      method: 'GET',
    });
    
    console.log('📊 GET /api/appointments status:', response.status);
    
    if (response.ok) {
      const appointments = await response.json();
      console.log('📊 Found', appointments.length, 'appointments in database');
    } else {
      console.log('❌ GET request failed');
    }
  } catch (error) {
    console.error('❌ Connectivity test failed:', error);
  }
}

// Exécuter les tests
console.log('🚀 Starting appointment API diagnostics...');
testConnectivity().then(() => {
  console.log('---');
  testAppointmentAPI();
});

