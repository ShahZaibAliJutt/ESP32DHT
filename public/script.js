// public/script.js

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const { accessToken } = await response.json();
      localStorage.setItem('accessToken', accessToken);
  
      // Fetch DHT data after successful login
      fetchDHTData();
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  });
  
  async function fetchDHTData() {
    const accessToken = localStorage.getItem('accessToken');
  
    try {
      const response = await fetch('/api/dht', {
        headers: {
          'Authorization': accessToken
        }
      });
  
      const data = await response.json();
      document.getElementById('temperature').textContent = data.temperature;
      document.getElementById('humidity').textContent = data.humidity;
      
      // Show data container after fetching data
      document.getElementById('dataContainer').style.display = 'block';
    } catch (error) {
      console.error('Failed to fetch DHT data:', error.message);
    }
  }
  