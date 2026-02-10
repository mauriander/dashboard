import axios from 'axios';

class HttpClient {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL,
            headers: {'Content-Type': 'application/json'}
        });
    }

    async get(url, config = {}) {
        try {
            const response = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async post(url, data, config = {}) {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async put(url, data, config = {}) {
        try {
            const response = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async delete(url, config = {}) {
        try {
            const response = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}

export default HttpClient;