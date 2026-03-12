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
      },{withCredentials:true});

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
      },
    {withCredentials:true});

      const { message } = response.data;

      return { success: true, message };
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

  loginWithGoogle() {
    window.location.href = `${this.url}/api/auth/google`;
  }

  async logout() {
    try {
        await this.api.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
    );
    } catch (error) {
      return { success: false, message: "logout failed" };
    }
  }
}

export default new AuthService();