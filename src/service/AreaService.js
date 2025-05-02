import { CONFIG } from "../config.js";

export class AreaService {
    async getAreas() {
        return fetch(`${CONFIG.BASE_URL}/area`).then(response => response.json());
    }

    async createArea(area) {
        return fetch(`${CONFIG.BASE_URL}/area`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(area),
        }).then(response => response.json());
    }

    async deleteArea(id) {
        return fetch(`${CONFIG.BASE_URL}/area/${id}`, {
            method: 'DELETE',
        });
    }

    async updateArea(id, area) {
        return fetch(`${CONFIG.BASE_URL}/area/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(area),
        }).then(response => response.json());
    }
}

export const areaService = new AreaService();
