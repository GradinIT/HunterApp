import {CONFIG} from "../config.js";

export class ObservationService {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
    }

    async getObservations() {
        return fetch(`${this.baseUrl}/observations`, {
            credentials: 'include',
        }).then(response => response.json());
    }

    async createObservation(observation) {
        return fetch(`${this.baseUrl}/observation`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation),
        }).then(response => response.json());
    }

    async deleteObservation(id) {
        return fetch(`${this.baseUrl}/observation/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    }

    async updateObservation(id, observation) {
        return fetch(`${this.baseUrl}/observation/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation),
        }).then(response => response.json());
    }
}

export const observationService = new ObservationService();
