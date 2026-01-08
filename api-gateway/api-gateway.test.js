// const fetch = require('node-fetch')

const { json } = require("body-parser");


describe('API Gateway Tests', () => {

    it('should fetch user data', async () => {
        const response = await fetch('http://localhost:3002/users/1', {
            method: 'get',
            headers: {"x-api-key": "fieldgreenalbert"}
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.id).toBe('1');
        expect(data.name).toBe('John Doe');
    });

    it('should fetch product data', async () => {
        const response = await fetch('http://localhost:3002/products/1', {
            method: 'get',
            headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzY3NzMzMTYyfQ.YUqQzycExGRG3HcAH478v80LQKYIugKb8eDHKStWsk0"}
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(1)
        expect(data.name).toBe('Laptop')
    })

    it('should fetch user product data', async () => {
        const response = await fetch('http://localhost:3002/userProducts/1', {
            method: 'get',
            headers: {"x-api-key": "fieldgreenalbert"}
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.user.id).toBe('1');
        expect(data.user.name).toBe('John Doe');
    })

    it('should generate a token', async () => {
        const response = await fetch('http://localhost:3002/auth', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "password"
            })
        })
        expect(response.status).toBe(200);
        const data = await response.json();
    })

    it('should return 404 for invalid user', async () => {
        const response = await fetch('http://localhost:3002/users/999', {
            method: 'get',
            headers: {"x-api-key": "fieldgreenalbert"}
        })
        expect(response.status).toBe(404)

    })

    it('should return 404 for invalid product', async () => {
        const response = await fetch('http://localhost:3002/products/999', {
            method: 'get',
            headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzY3NzMzMTYyfQ.YUqQzycExGRG3HcAH478v80LQKYIugKb8eDHKStWsk0"}
        });
        expect(response.status).toBe(404);
    })

    it('should return 404 for invalid user (product data)', async () => {
        const response = await fetch('http://localhost:3002/userProducts/3', {
            method: 'get',
            headers: {"x-api-key": "fieldgreenalbert"}
        });
        expect(response.status).toBe(404);
    })

    it('should return 401 for invalid credentials (user)', async () => {
        const response = await fetch('http://localhost:3002/users/1', {
            method: 'get',
            headers: {"x-api-key": "fieldgreenalber"}
        })
        expect(response.status).toBe(401)

    })

    it('should return 401 for invalid credentials (product)', async () => {
        const response = await fetch('http://localhost:3002/products/1', {
            method: 'get',
            headers: {Authorization: "Bearer 9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzY3NzMzMTYyfQ.YUqQzycExGRG3HcAH478v80LQKYIugKb8eDHKStWsk0"}
        });
        expect(response.status).toBe(401);
    })

    it('should return 401 for invalid credentials (product data)', async () => {
        const response = await fetch('http://localhost:3002/userProducts/1', {
            method: 'get',
            headers: {"x-api-key": "fieldgreenalber"}
        });
        expect(response.status).toBe(401);
    })

    it('should return 401 for invalid credentials (token)', async () => {
        const response = await fetch('http://localhost:3002/auth', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "passwor"
            })
        })
        expect(response.status).toBe(401);
    })

    it('should return 429 after too many requests', async () => {
        let response;
        for (let i=0; i<102; i++){
            response = await fetch('http://localhost:3002/users/1', {
                method: 'get',
                headers: {"x-api-key": "fieldgreenalbert"}
            });
            
        }
        expect(response.status).toBe(429);
    })
});
