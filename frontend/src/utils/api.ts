const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    get: async (endpoint: string) => {
        try {
            const res = await fetch(`${API_URL}/${endpoint}`, {
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (error) {
            console.error(`API GET error (${endpoint}):`, error);
            throw error;
        }
    },
    post: async (endpoint: string, data: any) => {
        try {
            const res = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (error) {
            console.error(`API POST error (${endpoint}):`, error);
            throw error;
        }
    },
    put: async (endpoint: string, id: string | null, data: any) => {
        try {
            const url = id ? `${API_URL}/${endpoint}/${id}` : `${API_URL}/${endpoint}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json = await res.json();
            return json.data;
        } catch (error) {
            console.error(`API PUT error (${endpoint}${id ? '/' + id : ''}):`, error);
            throw error;
        }
    },
    delete: async (endpoint: string, id: string) => {
        try {
            const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        } catch (error) {
            console.error(`API DELETE error (${endpoint}/${id}):`, error);
            throw error;
        }
    },
    getAssetUrl: (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const baseUrl = API_URL.replace(/\/api$/, '');
        return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }
};
