import { apiService } from './kounis-data-server';

class AtomicHabitsApiService {
    async getAllHabits() {
        try {
            return await apiService.get('/allHabits');
        } catch (error) {
            console.error('Error fetching habits:', error);
            throw error; // Optional: propagate the error to handle it in the calling code
        }
    }

    async addNewCard(newCard) {
        try {
            const response = await apiService.post('/habit', newCard);
            return response; // Assuming backend returns newly added card data or success message
        } catch (error) {
            console.error('Error adding new card:', error);
            throw error; // Optional: propagate the error to handle it in the calling code
        }
    }

    async addNewItemToCard(cardId, newItem){
        try {
            return await apiService.post(`/habit/${cardId}`, newItem);
        } catch (error) {
            console.error('Error adding new card:', error);
            throw error; // Optional: propagate the error to handle it in the calling code
        }
    }

    async updateHabit(updatedHabit) {
        try {
            return await apiService.put("/habit", updatedHabit);
        } catch (error) {
            console.error('Error adding new card:', error);
            throw error; // Optional: propagate the error to handle it in the calling code
        }
      }

    async deleteCard(cardId) {
        try {
            const response = await apiService.delete(`/habit/${cardId}`);
            return response; // Assuming backend returns success status or confirmation
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error; // Optional: propagate the error to handle it in the calling code
        }
    }

    async deleteHabitItems(itemId) {
        try {
            return await apiService.delete(`/habit-item/${itemId}`);
        } catch (error) {
            console.error('Error deleting card:', error);
            throw error; // Optional: propagate the error to handle it in the calling code
        }
    }
}

const atomicHabitsApiService = new AtomicHabitsApiService();

export { atomicHabitsApiService }; 
