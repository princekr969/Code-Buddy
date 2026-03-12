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

    }

    export default new UserService();