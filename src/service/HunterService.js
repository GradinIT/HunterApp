import { CONFIG } from "../config.js";

export class HunterService {
    async getHunters() {
        return fetch(`${CONFIG.BASE_URL}/hunters`).then(response => response.json());
    }

    async createHunter(hunter) {
        return fetch(`${CONFIG.BASE_URL}/hunter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hunter),
        }).then(response => response.json());
    }

    async deleteHunter(id) {
        return fetch(`${CONFIG.BASE_URL}/hunter/${id}`, {
            method: 'DELETE',
        });
    }

    async updateHunter(id, hunter) {
        return fetch(`${CONFIG.BASE_URL}/hunter/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hunter),
        }).then(response => response.json());
    }
}

export const hunterService = new HunterService();