# Full React Project Structure (All Files in One Document)
# Copy each file into your GitHub repo using the same folder structure.

=============================
📁 PROJECT ROOT
=============================

---------------------------------
📄 package.json
---------------------------------
{
  "name": "firststate-crypto-holdings",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.4.0",
    "ethers": "^6.0.0",
    "web3modal": "^1.9.12"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

---------------------------------
📄 tailwind.config.js
---------------------------------
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

---------------------------------
📄 postcss.config.js
---------------------------------
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

---------------------------------
📄 README.md
---------------------------------
# First State Cryptocurrency Holdings Website
React + Tailwind + Web3Modal + Ethers.js

Built for deployment via GitHub → Build → Upload to cPanel.

---------------------------------
📁 public/index.html
---------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>First State Cryptocurrency Holdings</title>
</head>
<body class="bg-slate-900">
  <div id="root"></div>
</body>
</html>

=============================
📁 /src
=============================

---------------------------------
📄 src/index.css
---------------------------------
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-900 text-slate-100;
}

---------------------------------
📄 src/index.js
---------------------------------
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

---------------------------------
📄 src/App.jsx
---------------------------------
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [balances, setBalances] = useState([]);
  const [status, setStatus] = useState('Not connected');
  const [web3Modal, setWeb3Modal] = useState(null);

  useEffect(() => {
    const modal = new Web3Modal({ cacheProvider: true });
    setWeb3Modal(modal);
    if (modal.cachedProvider) connectWallet();
  }, []);

  async function connectWallet() {
    try {
      setStatus('Connecting...');
      const instance = await web3Modal.connect();
      const prov = new ethers.BrowserProvider(instance);
      const sig = await prov.getSigner();
      const addr = await sig.getAddress();
      const net = await prov.getNetwork();

      setProvider(prov);
      setSigner(sig);
      setAccount(addr);
      setNetworkName(net.name);
      setStatus('Connected');

      const ethBal = await prov.getBalance(addr);
      const ethFormatted = ethers.formatEther(ethBal);

      const demoBalances = [
        { symbol: 'ETH', balance: Number(ethFormatted).toFixed(6) },
        { symbol: 'FST', balance: '124.50' },
        { symbol: 'USDC', balance: '350.00' }
      ];
      setBalances(demoBalances);

      instance.on && instance.on('accountsChanged', (accounts) => {
        if (accounts.length) setAccount(accounts[0]);
        else disconnectWallet();
      });

      instance.on && instance.on('chainChanged', () => window.location.reload());

    } catch (err) {
      console.error(err);
      setStatus('Connection failed');
    }
  }

  async function disconnectWallet() {
    try { await web3Modal.clearCachedProvider(); } catch (e) {}

    setProvider(null);
    setSigner(null);
    setAccount('');
    setBalances([]);
    setStatus('Not connected');
  }

  async function sendDemo(recipient, amountEth) {
    if (!signer) return setStatus('Connect wallet first');
    setStatus('Sending (demo)...');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus(`Sent ${amountEth} ETH to ${recipient} (demo only)`);
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between max-w-5xl mx-auto py-4">
        <h1 className="text-xl font-bold">First State Cryptocurrency Holdings</h1>

        {!account ? (
          <button onClick={connectWallet} className="bg-emerald-500 text-black px-3 py-1 rounded">Connect</button>
        ) : (
          <button onClick={disconnectWallet} className="bg-red-600 px-3 py-1 rounded">Disconnect</button>
        )}
      </header>

      <main className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 bg-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Balances</h2>

          {!balances.length ? (
            <p>No wallet connected.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {balances.map((t) => (
                <div className="bg-slate-900 p-3 rounded" key={t.symbol}>
                  <div className="text-sm text-slate-400">{t.symbol}</div>
                  <div className="text-2xl font-mono">{t.balance}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="bg-slate-800 p-4 rounded-xl">
          <div className="text-sm text-slate-300">Status: {status}</div>
          <div className="text-sm text-slate-300 mt-2">Network: {networkName || '—'}</div>
        </aside>
      </main>
    </div>
  );
}

---------------------------------
📄 src/SendForm.jsx (Optional)
---------------------------------
// If needed, move send form into its own file later.

// End of full project
