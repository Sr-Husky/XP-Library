import axios from 'axios'
import { refresh } from './userService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// Interceptor de resposta
api.interceptors.response.use(
    res => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            console.log("Erro interceptado")

            try {
                const res = await refresh();
                console.log("res: ",res);

                if (res?.data.access_token) {
                    localStorage.setItem('token', res.data.access_token);
                    console.log("Atualizando access token")

                    if (res.data.refresh_token) {
                        localStorage.setItem('refresh_token', res.data.refresh_token);
                    }

                    // Atualiza o header Authorization da requisição original
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;

                    return api(originalRequest); // Reenvia a requisição original
                }
            } catch (e) {
                // Refresh falhou → logout forçado
                localStorage.clear();
                window.location.href = '/entrar';
                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default api;