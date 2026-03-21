import axios from "axios";

class CodeExecuteService {
  url = import.meta.env.VITE_BACKEND_URL;
  constructor() {
          this.api = axios.create({
            baseURL: this.url,
            headers: {
              "Content-Type": "application/json",
            },
          });

          this.api.interceptors.response.use(
              (response) => response,
              async (error) => {
  
                  const originalRequest = error.config;
  
                  if (!originalRequest || originalRequest._retry) {
                  return Promise.reject(error);
                  }
  
                  if (error.response?.status === 403) {
                  if (originalRequest.url.includes("/api/auth/refresh")) {
                      window.location.href = "/auth?mode=login";
                      return Promise.reject(error);
                  }
  
                  originalRequest._retry = true;
  
                  try {
                      await this.api.post("/api/auth/refresh");
                      return this.api(originalRequest);
               } catch {
                      window.location.href = "/auth";
                  }
                  }
  
                  return Promise.reject(error);
              }
              );
        }

  async getSupportedLanguages() {
    const response = await this.api.get(`/api/code/languages`, {withCredentials: true});
    return response.data;
  }

  async executeCode(currentFileCode, language, stdin) {
    const response = await this.api.post(`/api/code/execute`, {
      code: currentFileCode,
      language, 
      stdin: stdin,
    }, {withCredentials: true});
    return response.data;
  }
}

export default CodeExecuteService;