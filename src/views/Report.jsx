import { useEffect, useState } from "react";
import { reportService } from "../service/ReportService.js";
import { blindService } from "../service/BlindService.js";
import '../css/forms.css';

function ReportView() {
    const [reports, setReports] = useState([]);
    const [blinds, setBlinds] = useState([]);
    const [action, setAction] = useState('Lägg till rapport');
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            const data = await reportService.getReports();
            setReports(data);
            setLoading(false);
        }
        async function fetchBlinds() {
            const data = await blindService.getBlinds();
            setBlinds(data);
        }

        fetchReports();
        fetchBlinds();
    }, []);

    const handleCreate = async (data) => {
        const report = {
            blindId: parseInt(data.get('blindId')),
            repair: data.get('repair'),
            move: data.get('move') === "on",
            clear: data.get('clear') === "on",
        };

        try {
            if (current) {
                await reportService.updateReport(current, report);
                setReports(reports.map(r => r.id === current ? {...r, ...report} : r));
                setCurrent(null);
            } else {
                const newReport = await reportService.createReport(report);
                setReports([...reports, newReport]);
            }
            document.forms.namedItem("report-form").reset();
            document.querySelector('.form-container').style.display = 'none';
        } catch (error) {
            console.error("Failed to create report:", error);
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill ta bort denna rapport?')) {
            return;
        }
        try {
            await reportService.deleteReport(id);
            setReports(reports.filter(report => report.id !== id));
        } catch (error) {
            console.error("Failed to delete report:", error);
        }
    }

    const notifyManagers = async () => {
        if (!confirm('Är du säker på att du vill skicka rapporter till ansvariga?')) {
            return;
        }
        await reportService.notifyManagers();
    }

    return (
        <div>
            <h2>Rapport pass</h2>
            <button className="add-btn" onClick={() => {
                document.querySelector('.form-container').style.display = 'block';
                document.forms.namedItem("report-form").reset();
                setAction('Lägg till rapport');
                setCurrent(null);
            }}>Lägg till rapport</button>
            <button className="add-btn" onClick={() => {
                notifyManagers();
            }}>Skicka rapporter till ansvariga</button>
            <div className="form-container">
                <h3>{action}</h3>
                <form id="report-form" action={handleCreate}>
                    <label htmlFor="blindId">Pass:</label>
                    <select name="blindId" required>
                        <option value="">Välj pass</option>
                        {blinds.map(blind => (
                            <option key={blind.id} value={blind.id}>{blind.description}</option>
                        ))}
                    </select>
                    <label htmlFor="date">Lagas:</label>
                    <textarea name="repair" required />

                    <label>Flyttas: <input type="checkbox" name="move" /></label>
                    <label>Rensas: <input type="checkbox" name="clear" /></label>

                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">Spara</button>
                        <button type="button" className="cancel-btn" onClick={() => {
                            document.querySelector('.form-container').style.display = 'none';
                        }}>Avbryt</button>
                    </div>
                </form>
            </div>
            <div className="list-container">
                {loading && <div className="loading">Laddar rapporter...</div>}
                {reports.map(report => (
                    <div key={report.id} className="list-item">
                        <div>
                            ID: {report.id}
                        </div>
                        <div>
                            Pass: {blinds.find(a => a.id === report.blindId)?.description}
                        </div>
                        <div>
                            Lagas: {report.repair}
                        </div>
                        <div>
                            Flyttas: {report.move ? 'Ja' : 'Nej'}
                        </div>
                        <div>
                            Rensas: {report.clear ? 'Ja' : 'Nej'}
                        </div>
                        <div>
                            <button className="edit-btn" onClick={() => {
                                setAction('Ändra rapport');
                                setCurrent(report.id);
                                document.querySelector('.form-container').style.display = 'block';
                                document.querySelector('#report-form').blindId.value = report.blindId;
                                document.querySelector('#report-form').repair.value = report.repair;
                                document.querySelector('#report-form').move.checked = report.move;
                                document.querySelector('#report-form').clear.checked = report.clear;
                                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                            }}>Ändra</button>
                            <button className="delete-btn"
                                    onClick={() => {handleDelete(report.id)}}>TaBort</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReportView;
