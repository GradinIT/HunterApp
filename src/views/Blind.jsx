import {useState, useEffect} from 'react';
import { blindService } from "../service/BlindService.js";
import { areaService } from "../service/AreaService.js";
import '../css/forms.css'

function BlindView() {
    const [blinds, setBlinds] = useState([]);
    const [areas, setAreas] = useState([]);
    const [currentBlind, setcurrentBlind] = useState(null);
    const [action, setAction] = useState('Lägg till pass');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlinds() {
            const data = await blindService.getBlinds();
            setBlinds(data);
            setLoading(false);
        }
        async function fetchAreas() {
            const data = await areaService.getAreas();
            setAreas(data);
        }

        fetchAreas();
        fetchBlinds();
    }, []);

    const handleCreate = async (data) => {
        const blind = {
            description: data.get('description'),
            areaId: parseInt(data.get('area')),
            type: data.get('type'),
        };

        try {
            if (currentBlind) {
                await blindService.updateBlind(currentBlind, blind);
                setBlinds(blinds.map(b => b.id === currentBlind ? {...b, ...blind} : b));
                setcurrentBlind(null);
            } else {
                const newBlind = await blindService.createBlind(blind);
                setBlinds([...blinds, newBlind]);
            }
            document.forms.namedItem("blind-form").reset();
            document.querySelector('.form-container').style.display = 'none';
        } catch (error) {
            console.error("Failed to create blind:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill ta bort detta pass?')) {
            return;
        }
        try {
            await blindService.deleteBlind(id);
            setBlinds(blinds.filter(blind => blind.id !== id));
        } catch (error) {
            console.error("Failed to delete blind:", error);
        }
    };

    return (
        <div>
            <h2>Pass</h2>
            <button id="blind-add" className="add-btn" onClick={() => {
                document.querySelector('.form-container').style.display = 'block';
                document.forms.namedItem("blind-form").reset();
                setAction('Lägg till pass');
                setcurrentBlind(null);
            }}>Lägg till pass
            </button>
            <div className="form-container">
                <h3>{action}</h3>
                <form id="blind-form" action={handleCreate}>
                    <div className="form-group">
                        <label htmlFor="blind-description">Namn/Nummer:</label>
                        <textarea id="blind-description" name="description" required></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="blind-type">Typ:</label>
                        <select id="blind-type" name="type" required>
                            <option value="">Välj typ</option>
                            <option value="Torn">Torn</option>
                            <option value="Ryggsäck">Ryggsäck</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="blind-area">Såt:</label>
                        <select id="blind-area" name="area" required>
                            <option value="">Välj såt</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">Spara</button>
                        <button type="button" className="cancel-btn" id="cancel-blind-form">Avbryt</button>
                    </div>
                </form>
            </div>
            <div className="list-container">
                <div id="blinds-list">
                    {loading && <div className="loading">Laddar pass...</div>}
                    {blinds.map(blind => (
                        <div key={blind.id} className="list-item">
                            <div>Beskrivning: {blind.description}</div>
                            <div>Typ: {blind.type || 'N/A'}</div>
                            <div>Såt: {areas.find(area => area.id === blind.areaId)?.name || 'N/A'}</div>
                            <div>
                                <button className="edit-btn" onClick={() => {
                                    setAction('Ändra pass');
                                    setcurrentBlind(blind.id);
                                    document.querySelector('.form-container').style.display = 'block';
                                    document.querySelector('#blind-form').description.value = blind.description;
                                    document.querySelector('#blind-form').type.value = blind.type || '';
                                    document.querySelector('#blind-form').area.value = blind.areaId || '';
                                    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                                }}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(blind.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlindView
