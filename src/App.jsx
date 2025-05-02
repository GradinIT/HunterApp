import { useState } from 'react'
import AreaView from './views/Area.jsx'
import HunterView from './views/Hunter.jsx'
import BlindView from "./views/Blind.jsx";
import ReportView from "./views/Report.jsx";
import ObservationView from "./views/Observation.jsx";
import LotteryView from "./views/Lottery.jsx";

function App() {
    const [currentView, setCurrentView] = useState('areas')
    const [menuExpanded, setMenuExpanded] = useState(false)

    const toggleMenu = () => {
        setMenuExpanded(!menuExpanded)
    }

    const handleTabClick = (view) => {
        setCurrentView(view)
        setMenuExpanded(false)
    }

    const renderView = () => {
        switch (currentView) {
            case 'areas':
                return <AreaView />
            case 'hunters':
                return <HunterView />
            case 'blinds':
                return <BlindView />
            case 'reports':
                return <ReportView />
            case 'observations':
                return <ObservationView />
            case 'lottery':
                return <LotteryView />
            default:
                return <AreaView />
        }
    }

    return (
        <div className="App">
            <div className="header">
                <h1>Jakt Å Sånt</h1>
            </div>
            <nav className={`navbar menu-toggle ${menuExpanded ? 'responsive' : ''}`} id="mobile-menu">
                <button className="icon"
                        onClick={toggleMenu}>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7L4 7" stroke="#fefaf1" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20 12L4 12" stroke="#fefaf1" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20 17L4 17" stroke="#fefaf1" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
                <button
                    onClick={() => handleTabClick('areas')}
                    className={`tab ${currentView === 'areas' ? 'active' : ''}`}>
                    Såt</button>
                <button
                    onClick={() => handleTabClick('hunters')}
                    className={`tab ${currentView === 'hunters' ? 'active' : ''}`}>
                    Jägare</button>
                <button
                    onClick={()  => handleTabClick('blinds')}
                    className={`tab ${currentView === 'blinds' ? 'active' : ''}`}>
                    Pass</button>
                <button
                    onClick={()  => handleTabClick('reports')}
                    className={`tab ${currentView === 'reports' ? 'active' : ''}`}>
                    Rapport Pass</button>
                <button
                    onClick={()  => handleTabClick('observations')}
                    className={`tab ${currentView === 'observations' ? 'active' : ''}`}>
                    Observationer</button>
                <button
                    onClick={()  => handleTabClick('lottery')}
                    className={`tab ${currentView === 'lottery' ? 'active' : ''}`}>
                    Lottning</button>
            </nav>
            <div className="content">
                {renderView()}
            </div>
        </div>
    )
}

export default App
