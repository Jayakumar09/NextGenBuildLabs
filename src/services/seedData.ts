import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const seedDatabase = async () => {
    // Adding Leads
    const leads = [
        { name: 'Quantum Dynamics', email: 'contact@quantum.io', source: 'WEB_FORM', status: 'NEW', createdAt: Date.now() },
        { name: 'Solaris Systems', email: 'admin@solaris.net', source: 'WHATSAPP', status: 'QUALIFIED', createdAt: Date.now() - 86400000 },
        { name: 'Neo Cortex', email: 'hr@neocortex.tech', source: 'REFERRAL', status: 'CONTACTED', createdAt: Date.now() - 172800000 },
    ];

    for (const lead of leads) {
        await addDoc(collection(db, 'leads'), lead);
    }

    // Adding Clients
    const clients = [
        { companyName: 'Cyberdyne Research', contactPerson: 'Miles Dyson', email: 'miles@cyberdyne.com', projectType: 'Cloud Infrastructure', status: 'ACTIVE', joinDate: Date.now() },
        { companyName: 'Weyland-Yutani', contactPerson: 'Ellen Ripley', email: 'ripley@weyland.com', projectType: 'Space Logistics', status: 'ACTIVE', joinDate: Date.now() - 500000000 },
    ];

    const clientRefs = [];
    for (const client of clients) {
        const ref = await addDoc(collection(db, 'clients'), client);
        clientRefs.push(ref.id);
    }

    // Adding Projects
    const projects = [
        { title: 'Project Genesis', description: 'Mars Colony Network Overlay', status: 'IN_PROGRESS', progress: 45, budget: 125000, deadline: '2026-12-31', manager: 'NextGen Build Labs', clientId: clientRefs[0] || 'default', createdAt: Date.now(), updatedAt: Date.now() },
        { title: 'Operation Nightfall', description: 'Secure Stealth Comms', status: 'PENDING', progress: 0, budget: 85000, deadline: '2027-04-15', manager: 'NextGen Build Labs', clientId: clientRefs[1] || 'default', createdAt: Date.now(), updatedAt: Date.now() },
    ];

    for (const project of projects) {
        await addDoc(collection(db, 'projects'), project);
    }

    // Adding Invoices
    const invoices = [
        { amount: 50000, status: 'PAID', clientId: clientRefs[0] || 'default', createdAt: Date.now() - 4000000, plan: 'Infrastucture Alpha', dueDate: '2026-05-01' },
        { amount: 25000, status: 'PENDING', clientId: clientRefs[1] || 'default', createdAt: Date.now(), plan: 'Cloud Node Beta', dueDate: '2026-06-15' },
    ];

    for (const invoice of invoices) {
        await addDoc(collection(db, 'invoices'), invoice);
    }

    // Adding Notifications
    const notifications = [
        { title: 'System Handshake', message: 'Connectivity established with primary node.', type: 'info', createdAt: Date.now() },
        { title: 'Critical Alert', message: 'Unauthorized entry attempt detected in Section 4. Firewall engaged.', type: 'error', createdAt: Date.now() - 3600000 },
    ];

    for (const notif of notifications) {
        await addDoc(collection(db, 'notifications'), notif);
    }

    console.log('Database seeded successfully.');
};
