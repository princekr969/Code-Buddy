import axios from "axios";

class UserService {
  url = import.meta.env.VITE_BACKEND_URL;

  constructor() {
    this.api = axios.create({
      baseURL: this.url,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get("/api/users/me");
      return {
        success: true,
        user: response.data
      };
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized"
        };
      }

      return {
        success: false,
        message: "Failed to fetch user"
      };
    }
  }

  async getUserById(userId) {
    try {
      const response = await this.api.get(`/api/users/${userId}`);
      return {
        success: true,
        user: response.data
      };
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized"
        };
      }
    }

  }

    async getRecentRooms() {
        try {
            const res = await this.api.get(`/api/users/recent-rooms`, { withCredentials: true });
            return res.data;
        } catch (err) {
            console.error('Error fetching recent rooms', err);
            if (err.response) {
                return { success: false, message: err.response.data.message || 'Error fetching recent rooms' };
            }
            return { success: false, message: 'Error fetching recent rooms' };

        }
    }
}

export default new UserService();