import { CONFIG } from "../config.js";

export class BlindService {
    async getBlinds() {
        return fetch(`${CONFIG.BASE_URL}/blinds`).then(response => response.json());
    }

    async createBlind(blind) {
        return fetch(`${CONFIG.BASE_URL}/blind`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blind),
        }).then(response => response.json());
    }

    async deleteBlind(id) {
        return fetch(`${CONFIG.BASE_URL}/blind/${id}`, {
            method: 'DELETE',
        });
    }

    async updateBlind(id, blind) {
        return fetch(`${CONFIG.BASE_URL}/blind/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blind),
        }).then(response => response.json());
    }
}

export const blindService = new BlindService();
