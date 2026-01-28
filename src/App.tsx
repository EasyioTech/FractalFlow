import React, { useState } from 'react';
import { MainCanvas } from './components/Canvas/MainCanvas';
import { ComponentToolbar } from './components/Toolbar/ComponentToolbar';
import { FloatingDock } from './components/FloatingDock';
import { useStore } from './store/useStore';

function App() {
    const [activeTool, setActiveTool] = useState('select');
    const { theme } = useStore(); // Access theme from store

    // Apply theme to document root
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="flex h-screen w-screen bg-dark-bg text-gray-200 overflow-hidden">
            <ComponentToolbar isOpen={activeTool === 'rectangle'} />
            <div className="flex-1 relative h-full">
                <MainCanvas activeTool={activeTool} />
                <FloatingDock activeTool={activeTool} onToolSelect={setActiveTool} />
            </div>
        </div>
    );
}

export default App;
