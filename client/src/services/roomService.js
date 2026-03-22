import axios from "axios";

class RoomService {
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

    async createRoom(title) {
        try {
            const res = await this.api.post('/api/room/create', { title }, { withCredentials: true });
            return res.data;
        } catch (err) {
            console.error('Error creating room:', err);
            if (err.response) {
                return { success: false, message: err.response.data.message || 'Error creating room' };
            }
            return { success: false, message: 'Error creating room' };
        }
    }

    async getRoomById(roomId) {
        try {
            const res = await this.api.get(`/api/room/${roomId}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            console.error('Error fetching room:', err);
            if (err.response) {
                return { success: false, message: err.response.data.message || 'Error fetching room' };
            }
            return { success: false, message: 'Error fetching room' };
        }
    }

    async getRoomsById(userId) {
        try {
            const res = await this.api.get(`/api/room/user/rooms/${userId}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            console.error('Error fetching rooms:', err);
            if (err.response) {
                return { success: false, message: err.response.data.message || 'Error fetching rooms' };
            }
            return { success: false, message: 'Error fetching rooms' };
        }
    }

    async getRoomMessages(roomId, limit = 50, skip = 0) {
        try {
            const res = await this.api.get(`/api/room/${roomId}/messages?limit=${limit}&skip=${skip}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            console.error('Error fetching messages:', err);
            if (err.response) {
                return { success: false, message: err.response.data.message || 'Error fetching messages' };
            }
            return { success: false, message: 'Error fetching messages' };
        }
    }
}

export default new RoomService();