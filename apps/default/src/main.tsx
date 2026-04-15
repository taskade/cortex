import './index.css';
import './lib/leaflet-setup';

// Load IBM Plex fonts from Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap';
document.head.appendChild(fontLink);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { GenesisRoot } from './lib/genesis.jsx';
import { setupThemeBridge } from './lib/theme-bridge';

setupThemeBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenesisRoot>
      <App />
    </GenesisRoot>
  </StrictMode>,
);
