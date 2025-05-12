import { CONFIG } from "../config.js";

export class AreaService {
    async getAreas() {
        return fetch(`${CONFIG.BASE_URL}/area`, {
            credentials: 'include'
        }).then(response => response.json());
    }

    async createArea(area) {
        return fetch(`${CONFIG.BASE_URL}/area`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(area),
        }).then(response => response.json());
    }

    async deleteArea(id) {
        return fetch(`${CONFIG.BASE_URL}/area/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    }

    async updateArea(id, area) {
        return fetch(`${CONFIG.BASE_URL}/area/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(area),
        }).then(response => response.json());
    }
}

export const areaService = new AreaService();
