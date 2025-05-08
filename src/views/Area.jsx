import { useState, useEffect } from 'react';
import { areaService } from "../service/AreaService.js";
import { hunterService } from "../service/HunterService.js";
import '../css/forms.css';

function AreaView() {
    const [hunters, setHunters] = useState([]);
    const [areas, setAreas] = useState([]);
    const [action, setAction] = useState('Lägg till såt');
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAreas() {
            const data = await areaService.getAreas();
            setAreas(data);
            setLoading(false);
        }
        async function fetchHunters() {
            const data = await hunterService.getHunters();
            setHunters(data);
        }

        fetchAreas();
        fetchHunters();
    }, []);

    const handleCreate = async (data) => {
        const area = {
            name: data.get('name'),
            description: data.get('description'),
            manager: parseInt(data.get('manager')) || null
        };

        try {
            if (current) {
                areaService.updateArea(current, area).then(updatedArea => {
                    setAreas(areas.map(a => (a.id === current ? {...a, ...updatedArea} : a)));
                    setCurrent(null);
                });
            } else {
                areaService.createArea(area).then(newArea => {
                    setAreas([...areas, newArea]);
                    setCurrent(null);
                });
            }
            document.forms.namedItem("area-form").reset();
            document.querySelector('.form-container').style.display = 'none';
        } catch (error) {
            console.error("Failed to create area:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill ta bort denna såt?')) {
            return;
        }
        try {
            await areaService.deleteArea(id);
            setAreas(areas.filter(area => area.id !== id));
        } catch (error) {
            console.error("Failed to delete area:", error);
        }
    };

    return (
        <div>
            <h2>Såtar</h2>
            <button id="area-add" className="add-btn" onClick={() => {
                document.querySelector('.form-container').style.display = 'block';
                document.forms.namedItem("area-form").reset();
                setAction('Lägg till såt');
            }}>Lägg till såt</button>
            <div className="form-container">
                <h3>{action}</h3>
                <form id="area-form" action={handleCreate}>
                    <div className="form-group">
                        <label htmlFor="area-name">Namn:</label>
                        <input type="text" name="name" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="area-description">Beskrivning:</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="area-manager">Ansvarig (Valfritt):</label>
                        <select name="manager">
                            <option value="">Välj ansvarig</option>
                            {hunters.map(hunter => (<option key={hunter.id} value={hunter.id}>{hunter.name}</option>))}
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">Spara</button>
                        <button type="button" className="cancel-btn" onClick={() => {
                            document.querySelector('.form-container').style.display = 'none';
                        }}>Avbryt</button>
                    </div>
                </form>
            </div>
            <div className="list-container">
                {loading && <div className="loading">Laddar såtar...</div>}
                {areas.map(area => (
                    <div key={area.id} className="list-item">
                        <div>
                            ID: {area.id}
                        </div>
                        <div>
                            Såt: {area.name}
                        </div>
                        <div>
                            Beskrivning: {area.description}
                        </div>
                        <div>
                            Ansvarig: {hunters.find(h => h.id === area.manager)?.name ?? 'Ingen'}
                        </div>
                        <div>
                            <button className="edit-btn" onClick={() => {
                                setAction('Ändra såt');
                                setCurrent(area.id);
                                document.querySelector('.form-container').style.display = 'block';
                                document.querySelector('#area-form').name.value = area.name;
                                document.querySelector('#area-form').description.value = area.description;
                                document.querySelector('#area-form').manager.value = area.manager || '';
                                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                            }}>Ändra</button>
                            <button className="delete-btn"
                                    onClick={() => handleDelete(area.id)}>Ta bort</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AreaView;