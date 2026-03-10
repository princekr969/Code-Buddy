import axios from "axios";

class AuthService {
  url = import.meta.env.VITE_BACKEND_URL;

  constructor() {
    this.api = axios.create({
      baseURL: this.url,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async loginUser(email, password) {
    try {
      const response = await this.api.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      return { success: true, token };
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404)
          return { success: false, message: "User not found" };

        if (err.response.status === 400)
          return { success: false, message: "Invalid credentials" };

        if (err.response.status === 500)
          return { success: false, message: "Internal server error" };
      }

      return { success: false, message: "Network error" };
    }
  }

  async signUp(name, email, password, username) {
    try {
      const response = await this.api.post("/api/auth/signup", {
        name,
        email,
        password,
        username,
      });

      const { token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      return { success: true, message, token };
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400)
          return { success: false, message: "User already exists" };

        if (err.response.status === 500)
          return { success: false, message: "Internal server error" };
      }

      return { success: false, message: "Network error" };
    }
  }

  getToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp > currentTime) {
        return token;
      } else {
        this.logout();
        return null;
      }
    } catch (err) {
      console.error("Error decoding JWT:", err);
      return null;
    }
  }

  logout() {
    localStorage.removeItem("token");
  }

  getUserData() {
    const token = this.getToken();
    return token ? JSON.parse(atob(token.split(".")[1])) : null;
  }
}

export default new AuthService();