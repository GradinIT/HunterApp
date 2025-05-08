import { useEffect, useState } from 'react';
import { blindService } from "../service/BlindService.js";
import { observationService } from "../service/ObservationService.js";
import '../css/forms.css';

function ObservationView() {
    const [observations, setObservations] = useState([]);
    const [blinds, setBlinds] = useState([]);
    const [action, setAction] = useState('Lägg till observation');
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchObservations() {
            const data = await observationService.getObservations();
            setObservations(data);
            setLoading(false);
        }
        async function fetchBlinds() {
            const data = await blindService.getBlinds();
            setBlinds(data);
        }

        fetchBlinds();
        fetchObservations();
    }, []);

    const handleCreate = async (data) => {
        const observation = {
            date: data.get('date'),
            blindId: parseInt(data.get('blindId')),
            animal: data.get('animal'),
            count: parseInt(data.get('count')),
        };

        try {
            if (current) {
                await observationService.updateObservation(current, observation);
                setObservations(observations.map(o => o.id === current ? {...o, ...observation} : o));
                setCurrent(null);
            } else {
                const newObservation = await observationService.createObservation(observation);
                setObservations([...observations, newObservation]);
            }
            document.forms.namedItem("observation-form").reset();
            document.querySelector('.form-container').style.display = 'none';
        } catch (error) {
            console.error("Failed to create observation:", error);
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill ta bort denna observation?')) {
            return;
        }
        try {
            await observationService.deleteObservation(id);
            setObservations(observations.filter(observation => observation.id !== id));
        } catch (error) {
            console.error("Failed to delete observation:", error);
        }
    }

    return (
        <div>
            <h2>Observationer</h2>
            <button className="add-btn" onClick={() => {
                document.querySelector('.form-container').style.display = 'block';
                document.forms.namedItem("observation-form").reset();
                setAction('Lägg till observation');
                setCurrent(null);
            }}>Lägg till observation</button>
            <div className="form-container">
                <h3>{action}</h3>
                <form id="observation-form" action={handleCreate}>
                    <div className="form-group">
                        <label htmlFor="date">Datum:</label>
                        <input type="date" name="date" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="blind">Pass:</label>
                        <select name="blindId" required>
                            <option value="">Välj pass</option>
                            {blinds.map(blind => (
                                <option key={blind.id} value={blind.id}>{blind.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Djur:</label>
                        <input type="text" name="animal" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="count">Antal:</label>
                        <input name="count" type="number" defaultValue="1" required></input>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn" >Spara</button>
                        <button type="button" className="cancel-btn" onClick={() => {
                        document.querySelector('.form-container').style.display = 'none';
                            document.forms.namedItem("observation-form").reset();
                        }}>Avbryt</button>
                    </div>
                </form>
            </div>

            <div className="list-container">
                {loading && <div className="loading">Laddar observationer...</div>}
                {observations.map(observation => (
                    <div key={observation.id} className="list-item">
                        <div>
                            ID: {observation.id}
                        </div>
                        <div>
                            Datum: {observation.date}
                        </div>
                        <div>
                            Pass: {blinds.find(a => a.id === observation.blindId)?.description}
                        </div>
                        <div>
                            Djur: {observation.animal}
                        </div>
                        <div>
                            Antal: {observation.count}
                        </div>
                        <div>
                            <button className="edit-btn" onClick={() => {
                                setAction('Ändra observation');
                                setCurrent(observation.id);
                                document.querySelector('.form-container').style.display = 'block';
                                document.querySelector('#observation-form').date.value = observation.date;
                                document.querySelector('#observation-form').blindId.value = observation.blindId;
                                document.querySelector('#observation-form').animal.value = observation.animal;
                                document.querySelector('#observation-form').count.value = observation.count;
                                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                            }}>Ändra</button>
                            <button className="delete-btn"
                                    onClick={() => handleDelete(observation.id)}>Ta bort</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ObservationView
