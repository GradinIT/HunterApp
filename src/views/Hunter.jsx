import {useState, useEffect} from 'react';
import { areaService } from "../service/AreaService.js";
import { hunterService } from "../service/HunterService.js";
import '../css/forms.css';

function HunterView() {
    const [hunters, setHunters] = useState([]);
    const [areas, setAreas] = useState([]);
    const [action, setAction] = useState('Lägg till jägare');
    const [currentHunter, setcurrentHunter] = useState(null);
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
        const hunter = {
            name: data.get('name'),
            areaId: parseInt(data.get('area')),
            phone: data.get('phone'),
            email: data.get('email'),
            leader: data.get('leader') === 'true'
        };

        try {
            if (currentHunter) {
                await hunterService.updateHunter(currentHunter, hunter);
                setHunters(hunters.map(h => h.id === currentHunter ? {...h, ...hunter} : h));
                setcurrentHunter(null);
            } else {
                const newHunter = await hunterService.createHunter(hunter);
                setHunters([...hunters, newHunter]);
            }
            document.forms.namedItem("hunter-form").reset();
            document.querySelector('.form-container').style.display = 'none';
        } catch (error) {
            console.error("Failed to create hunter:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Är du säker på att du vill ta bort denna jägare?')) {
            return;
        }
        try {
            await hunterService.deleteHunter(id);
            setHunters(hunters.filter(hunter => hunter.id !== id));
        } catch (error) {
            console.error("Failed to delete hunter:", error);
        }
    };

    return (
        <div>
            <h2>Jägare</h2>
            <button id="hunter-add" className="add-btn" onClick={() => {
                document.querySelector('.form-container').style.display = 'block';
                document.forms.namedItem("hunter-form").reset();
                setAction('Lägg till jägare');
                setcurrentHunter(null);
            }}>Lägg till jägare</button>
            <div className="form-container">
                <h3>{action}</h3>
                <form id="hunter-form" action={handleCreate}>
                    <div className="form-group">
                        <label htmlFor="hunter-name">Namn:</label>
                        <input type="text" name="name" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hunter-area">Såt:</label>
                        <select name="area" required>
                            <option value="">Välj såt</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hunter-phone">Telefon:</label>
                        <input type="text" name="phone"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hunter-email">Email:</label>
                        <input type="text" name="email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hunter-leader">Ledare:</label>
                        <select name="leader">
                            <option value="false">Nej</option>
                            <option value="true">Ja</option>
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
                {loading && <div className="loading">Laddar jägare...</div>}
                {hunters.map(hunter => (
                    <div key={hunter.id} className="list-item">
                        <div>ID: {hunter.id}</div>
                        <div>Namn: {hunter.name}</div>
                        <div>Såt: {areas.find(area => area.id === hunter.areaId)?.name || 'N/A'}</div>
                        <div>Telefon: {hunter.phone}</div>
                        <div>Email: {hunter.email}</div>
                        <div>Ledare: {hunter.leader ? 'Ja' : 'Nej'}</div>
                        <div>
                            <button className="edit-btn" onClick={() => {
                                setAction('Ändra jägare');
                                setcurrentHunter(hunter.id);
                                document.querySelector('.form-container').style.display = 'block';
                                document.querySelector('#hunter-form').name.value = hunter.name;
                                document.querySelector('#hunter-form').area.value = hunter.areaId || '';
                                document.querySelector('#hunter-form').phone.value = hunter.phone;
                                document.querySelector('#hunter-form').email.value = hunter.email;
                                document.querySelector('#hunter-form').leader.value = hunter.leader ? 'true' : 'false';
                                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                            }}>Ändra</button>
                            <button className="delete-btn"
                                    onClick={() => handleDelete(hunter.id)}>Ta bort</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HunterView;
