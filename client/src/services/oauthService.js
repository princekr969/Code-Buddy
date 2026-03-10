import axios from "axios";

class OAuthService {
  url = import.meta.env.VITE_BACKEND_URL;

  constructor() {
    this.api = axios.create({
      baseURL: this.url,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  loginWithGoogle() {
    window.location.href = `${this.url}/api/auth/google`;
  }


  logout() {
    localStorage.removeItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUserData() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Invalid token");
      return null;
    }
  }
}

export default new OAuthService();