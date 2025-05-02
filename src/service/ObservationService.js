import {CONFIG} from "../config.js";

export class ObservationService {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
    }

    async getObservations() {
        return fetch(`${this.baseUrl}/observations`).then(response => response.json());
    }

    async createObservation(observation) {
        return fetch(`${this.baseUrl}/observation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation),
        }).then(response => response.json());
    }

    async deleteObservation(id) {
        return fetch(`${this.baseUrl}/observation/${id}`, {
            method: 'DELETE',
        });
    }

    async updateObservation(id, observation) {
        return fetch(`${this.baseUrl}/observation/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation),
        }).then(response => response.json());
    }
}

export const observationService = new ObservationService();
