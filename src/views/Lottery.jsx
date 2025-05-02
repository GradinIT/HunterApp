import {useEffect, useState} from 'react';
import {hunterService} from "../service/HunterService.js";
import {blindService} from "../service/BlindService.js";
import '../css/forms.css'
import {CONFIG} from "../config.js";

function LotteryView() {
    const [stage, setStage] = useState(1);
    const [hunters, setHunters] = useState([]);
    const [blinds, setBlinds] = useState([]);
    const [selectedHunters, setSelectedHunters] = useState([]);
    const [selectedBlinds, setSelectedBlinds] = useState([]);

    useEffect(() => {
        async function fetchHunters() {
            const data = await hunterService.getHunters();
            setHunters(data);
        }
        async function fetchBlinds() {
            const data = await blindService.getBlinds();
            setBlinds(data);
        }
        fetchBlinds();
        fetchHunters();
    }, []);

    const renderView = () => {
        switch (stage) {
            case 1:
                return <LotteryStageHunters
                    next={setStage}
                    hunters={hunters}
                    selectedHunters={selectedHunters}
                    setSelectedHunters={setSelectedHunters}
                />;
            case 2:
                return <LotteryStageBlinds
                    next={setStage}
                    blinds={blinds}
                    selectedHunters={selectedHunters}
                    selectedBlinds={selectedBlinds}
                    setSelectedBlinds={setSelectedBlinds}
                />;
            case 3:
                return <LotteryStageResult
                    next={setStage}
                    selectedHunters={selectedHunters}
                    selectedBlinds={selectedBlinds}
                />;
            default:
                return <LotteryStageHunters next={setStage} />;
        }
    }

    return (
        <div>
            <h2>Passlottning</h2>
            {renderView(setStage)}
        </div>
    );
}

function LotteryStageHunters({next, hunters, selectedHunters, setSelectedHunters}) {
    return (
        <div>
            <h3>Välj jägare</h3>
            <p>Välj de jägare i listan som ska delta i lottningen. Se till att antalet valda jägare är lika många som antalet tillgängliga pass. När du är klar, fortsätt till nästa steg.</p>
            <div className="list-container">
                { <div className="list-item">Inga tillgängliga jägare.</div> }
                {
                    hunters.map(hunter => {
                        return (
                            <div key={hunter.id} className="list-item" style={{
                                display: 'flex',
                                gap: '10px',
                                flexDirection: 'row',
                                justifyContent: 'start',
                            }}>
                                <input type="checkbox" style={{transform: 'scale(2.0)'}} value={hunter.id} defaultChecked={selectedHunters.includes(hunter.id)} />
                                <div>{hunter.name}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="form-buttons">
                <button className="edit-btn" onClick={() => {
                    const selected = document.querySelectorAll(".list-item input[type='checkbox']:checked");
                    if (selected.length === 0) {
                        alert("Du måste välja minst en jägare.");
                        return;
                    }
                    next(2);
                    setSelectedHunters(Array.from(selected).map(input => parseInt(input.value)));
                }}>Nästa</button>
            </div>
        </div>
    );
}

function LotteryStageBlinds({next, blinds, selectedHunters, selectedBlinds, setSelectedBlinds}) {
    return (
        <div>
            <h3>Välj pass</h3>
            <p> Välj de pass som ska lottas ut till jägarna. Antalet pass måste vara detsamma som antalet valda jägare. Fortsätt till nästa steg för att genomföra lottningen. </p>
            <div className="list-container">
                { <div className="list-item">Inga tillgängliga pass.</div> }
                {
                    blinds.map(blind => {
                        return (
                            <div key={blind.id} className="list-item" style={{
                                display: 'flex',
                                gap: '10px',
                                flexDirection: 'row',
                                justifyContent: 'start',
                            }}>
                                <input type="checkbox" style={{transform: 'scale(2.0)'}} value={blind.id} defaultChecked={selectedBlinds.includes(blind.id)}/>
                                <div>{blind.description}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="form-buttons">
                <button className="edit-btn" onClick={() => next(1)}>Tillbaka</button>
                <button className="edit-btn" onClick={() => {
                    const selected = document.querySelectorAll(".list-item input[type='checkbox']:checked");
                    if (selectedHunters.length !== selected.length) {
                        alert(`Antalet valda jägare (${selectedHunters.length}) och pass (${selected.length}) måste vara lika`);
                        return;
                    }
                    next(3);
                    setSelectedBlinds(Array.from(selected).map(input => parseInt(input.value)));
                }}>Nästa</button>
            </div>
        </div>
    );
}

function LotteryStageResult({next, selectedHunters, selectedBlinds}) {
    const [result, setResult] = useState({pairs: []});
    async function fetchLotteryResult() {
        const lottery = await fetch(`${CONFIG.BASE_URL}/lottery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hunters: selectedHunters,
                blinds: selectedBlinds,
            }),
        }).then(response => response.json());

        setResult(lottery);
    }

    async function notifyHunters(result) {
        await fetch(`${CONFIG.BASE_URL}/lottery/notify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        }).then(response => {
            if (response.ok) {
                alert('Resultatet har skickats till jägarna');
            } else {
                alert("Något gick fel när resultatet skulle skickas.");
            }
        });
    }

    useEffect(() => {
        fetchLotteryResult();
    }, [])
    return (
        <div>
            <h3>Resultat</h3>
            <div className="list-container">
                {
                    result.pairs.map((pair) => {
                        return (
                            <div key={`pair-${pair.hunter.id}`} className="list-item">
                                <div style={{fontWeight: 'bold'}}>{pair.hunter.name}</div>
                                <div>{pair.blind.description}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="form-buttons">
                <button className="edit-btn" onClick={() => next(2)}>Tillbaka</button>
                <button className="edit-btn" onClick={() => fetchLotteryResult()}>Lotta om</button>
                <button className="add-btn" onClick={() => notifyHunters(result)}>Skicka resultat till jägare</button>
            </div>
        </div>
    );
}

export default LotteryView;