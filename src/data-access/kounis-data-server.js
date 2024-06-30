class ApiService {
  constructor() {
      this.baseUrl = process.env.REACT_APP_API_URL;
  }

  async get(endpoint) {
      try {
          console.log(this.baseUrl);
          const response = await fetch(`${this.baseUrl}${endpoint}`);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error('GET request failed', error);
          throw error;
      }
  }

  async post(endpoint, data) {
      try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error('POST request failed', error);
          throw error;
      }
  }

  async put(endpoint, data) {
      try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error('PUT request failed', error);
          throw error;
      }
  }

  async delete(endpoint) {
      try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
              method: 'DELETE',
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error('DELETE request failed', error);
          throw error;
      }
  }
}

const apiService = new ApiService();

export { apiService }; 
