// src/MockData.js

let clients = [
      { id: 1, name: 'Shubham vishwakarma', company: 'Tent Solutions', phone: '9876543210', address: 'Shukhliya', visit_count: 1 },
      { id: 2, name: 'vinesh', company: 'Marketing Co', phone: '98567456321', address: 'vijay nagar', visit_count: 1 }
    ];
    
    // Fetch a client by their phone number
    export const fetchClientByNumber = (phoneNumber) => {
      return clients.find(client => client.phone === phoneNumber) || null;
    };
    
    // Add a new visit or update an existing client
    export const addNewVisit = (visitData) => {
      const existingClient = clients.find(client => client.phone === visitData.phone);
    
      if (existingClient) {
        // Update existing client
        existingClient.name = visitData.name;
        existingClient.company = visitData.company;
        existingClient.address = visitData.address;
        existingClient.visit_count += 1;
      } else {
        // Add new client
        clients.push({
          id: clients.length + 1,
          ...visitData,
          visit_count: 1
        });
      }
    };
    
    // Get today's visits (for simplicity, we just return all clients)
    export const getTodayVisits = () => {
      return clients;
    };
    
    // End a client's visit
    export const endClientVisit = (clientId) => {
      // In a real scenario, we'd set an "end time" or remove the visit entry
      console.log(`Ending visit for client ID: ${clientId}`);
    };
          