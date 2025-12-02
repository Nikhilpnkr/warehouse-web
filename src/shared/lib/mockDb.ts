export class MockDB {
    data: any;

    constructor() {
        this.data = {
            users: [{ id: '1', email: 'demo@stokify.com', name: 'Demo User' }],
            warehouses: [
                { id: '1', name: 'Main Distribution Center', location: 'New York', capacity: 1000, used: 750 },
                { id: '2', name: 'East Side Storage', location: 'Queens', capacity: 500, used: 120 }
            ],
            customers: [
                { id: '1', name: 'Acme Corp', phone: '555-0101', email: 'contact@acme.com', balance: -450 },
                { id: '2', name: 'John Doe', phone: '555-0102', email: 'john@gmail.com', balance: 0 }
            ],
            products: [
                { id: '1', name: 'Steel Beams', unit: 'tons', price: 1200 },
                { id: '2', name: 'Copper Wire', unit: 'kg', price: 15 }
            ],
            notifications: [
                { id: '1', title: 'Low Stock Alert', message: 'Copper Wire is below 100kg', time: '2h ago', type: 'alert' },
                { id: '2', title: 'Payment Received', message: 'Acme Corp paid $500', time: '5h ago', type: 'success' }
            ]
        };
    }

    async getList(collection: string) {
        return new Promise(resolve => setTimeout(() => resolve(this.data[collection] || []), 300));
    }

    async login(email: string, password: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ user: this.data.users[0], token: 'mock-jwt' });
            }, 800);
        });
    }
}

export const db = new MockDB();
