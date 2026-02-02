'use client';
import React, { useState, useEffect } from 'react';
import MorishopService from '@/services/morishop.service';

const MorishopTestPage = () => {
    const [activeTab, setActiveTab] = useState('saldo');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    // Order Form State
    const [orderServiceId, setOrderServiceId] = useState('');
    const [orderTarget, setOrderTarget] = useState('');
    const [orderKontak, setOrderKontak] = useState('');
    const [orderIdTrx, setOrderIdTrx] = useState('');

    // Status Form State
    const [statusOrderId, setStatusOrderId] = useState('');
    const [autoMonitor, setAutoMonitor] = useState(false);

    // Data helpers
    const [servicesList, setServicesList] = useState([]);

    useEffect(() => {
        let interval;
        if (autoMonitor && statusOrderId) {
            handleCheckStatus(true);
            interval = setInterval(() => {
                handleCheckStatus(true);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [autoMonitor, statusOrderId]);

    const generateIdTrx = () => {
        setOrderIdTrx(`ORDER${Date.now()}`);
    };

    const handleCheckSaldo = async () => {
        setLoading(true);
        setResponse(null);
        const res = await MorishopService.checkSaldo();
        setResponse(res);
        setLoading(false);
    };

    const handleGetServices = async () => {
        setLoading(true);
        setResponse(null);
        const res = await MorishopService.getServices();
        setResponse(res);
        if (res?.status && Array.isArray(res.data)) {
            setServicesList(res.data);
        }
        setLoading(false);
    };

    const handleCreateOrder = async () => {
        if (!orderServiceId || !orderTarget) {
            alert('Service ID and Target are required');
            return;
        }

        // Auto generate if empty
        let trx = orderIdTrx;
        if (!trx) {
            trx = `ORDER${Date.now()}`;
            setOrderIdTrx(trx);
        }

        setLoading(true);
        setResponse(null);
        const res = await MorishopService.createOrder({
            service_id: orderServiceId,
            target: orderTarget,
            kontak: orderKontak,
            idtrx: trx
        });
        setResponse(res);
        setLoading(false);
    };

    const handleCheckStatus = async (isPolling = false) => {
        if (!statusOrderId) {
            if (!isPolling) alert('Order ID is required');
            return;
        }

        if (!isPolling) {
            setLoading(true);
            setResponse(null);
        }

        const res = await MorishopService.checkStatus(statusOrderId);
        setResponse(res);

        if (!isPolling) {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'saldo', label: 'Check Saldo' },
        { id: 'service', label: 'Services' },
        { id: 'order', label: 'Create Order' },
        { id: 'status', label: 'Check Status' },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto bg-slate-900 min-h-screen text-slate-100 font-sans">
            <div className="mb-8 pb-4 border-b border-slate-700 text-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
                    Morishop API Integration
                </h1>
                <p className="text-slate-400 mt-2">Internal Test Environment</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setResponse(null);
                            setLoading(false);
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-sky-400 hover:bg-slate-750 border border-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
                        {activeTab === 'saldo' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold text-sky-400">Check Balance</h2>
                                <p className="text-slate-400">Get current account balance form server.</p>
                                <button
                                    onClick={handleCheckSaldo}
                                    disabled={loading}
                                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Check Balance'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'service' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold text-sky-400">Service List</h2>
                                <p className="text-slate-400">Fetch available services.</p>
                                <button
                                    onClick={handleGetServices}
                                    disabled={loading}
                                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Fetch Services'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'order' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold text-sky-400">Create Order</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Service ID</label>
                                    <input
                                        type="text"
                                        value={orderServiceId}
                                        onChange={(e) => setOrderServiceId(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-sky-500"
                                        placeholder="e.g. ML86"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Target</label>
                                    <input
                                        type="text"
                                        value={orderTarget}
                                        onChange={(e) => setOrderTarget(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-sky-500"
                                        placeholder="e.g. 123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Phone (Optional)</label>
                                    <input
                                        type="text"
                                        value={orderKontak}
                                        onChange={(e) => setOrderKontak(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-sky-500"
                                        placeholder="e.g. 08123..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Transaction ID</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={orderIdTrx}
                                            onChange={(e) => setOrderIdTrx(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-sky-500"
                                            placeholder="Auto if empty"
                                        />
                                        <button
                                            onClick={generateIdTrx}
                                            className="px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
                                        >
                                            Gen
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateOrder}
                                    disabled={loading}
                                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-4"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'status' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold text-sky-400">Check Status</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Order ID</label>
                                    <input
                                        type="text"
                                        value={statusOrderId}
                                        onChange={(e) => setStatusOrderId(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-sky-500"
                                        placeholder="e.g. ORDER..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="autoMonitor"
                                        checked={autoMonitor}
                                        onChange={(e) => setAutoMonitor(e.target.checked)}
                                        className="w-5 h-5 accent-sky-500 rounded"
                                    />
                                    <label htmlFor="autoMonitor" className="text-sm font-medium text-slate-300">Auto Refresh (5s)</label>
                                    {autoMonitor && <span className="ml-auto text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full animate-pulse">Live</span>}
                                </div>

                                <button
                                    onClick={() => handleCheckStatus(false)}
                                    disabled={loading}
                                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                >
                                    {loading && !autoMonitor ? 'Checking...' : 'Check Status'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className={`bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden min-h-[400px] flex flex-col ${activeTab === 'service' && servicesList.length > 0 ? 'h-[800px]' : ''}`}>
                        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-300">Response Output</h3>
                            {response && (
                                <span className={`px-2 py-1 text-xs rounded-full font-bold ${response.status ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                    {response.status ? 'SUCCESS' : 'ERROR'}
                                </span>
                            )}
                        </div>

                        <div className="p-4 overflow-auto flex-1 font-mono text-sm">
                            {response ? (
                                activeTab === 'service' && response.status && Array.isArray(response.data) ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {response.data.map((service) => (
                                            <div key={service.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-sky-500 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setOrderServiceId(service.id);
                                                    setActiveTab('order');
                                                }}
                                            >
                                                <h4 className="font-bold text-sky-400 mb-1">{service.nama_layanan}</h4>
                                                <div className="text-xs text-slate-500 mb-2">{service.kategori}</div>
                                                <div className="flex justify-between items-end">
                                                    <div className="text-xs text-slate-400">ID: <span className="text-white">{service.id}</span></div>
                                                    <div className="text-green-400 font-bold">Rp {service.harga.toLocaleString()}</div>
                                                </div>
                                                <div className="mt-2 text-xs">
                                                    <span className={`px-1.5 py-0.5 rounded ${service.status === 'available' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                        {service.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <pre className="text-slate-300 whitespace-pre-wrap break-all">
                                        {JSON.stringify(response, null, 2)}
                                    </pre>
                                )
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                    <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p>Waiting for action...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MorishopTestPage;
