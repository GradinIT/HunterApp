import { CONFIG } from "../config.js";

export class ReportService {
    async getReports() {
        return fetch(`${CONFIG.BASE_URL}/reports`, {
            credentials: 'include',
        }).then(response => response.json());
    }

    async createReport(report) {
        return fetch(`${CONFIG.BASE_URL}/report`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(report),
        }).then(response => response.json());
    }

    async deleteReport(id) {
        return fetch(`${CONFIG.BASE_URL}/report/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    }

    async updateReport(id, report) {
        return fetch(`${CONFIG.BASE_URL}/report/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(report),
        }).then(response => response.json());
    }

    async notifyManagers() {
        return fetch(`${CONFIG.BASE_URL}/report/notify`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json());
    }
}

export const reportService = new ReportService();
