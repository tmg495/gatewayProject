const express = require('express');
// const fetch = require('node-fetch');
const basicAuth = require('basic-auth')
const app = express();
const PORT = 3002;

const authMiddleware = (req, res, next) => {
    const credentials = basicAuth(req);
    if (!credentials || !authenticate(credentials.name, credentials.pass)) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    next();
}

const authenticate = (username, password) => {

    if (username === 'admin' && password == 'password') {
        return true
    }

    return false
}

app.get('/users/:id', authMiddleware, async (req, res) => {
    const response = await fetch(`http://localhost:3000/users/${req.params.id}`);
    const data = await response.json();
    res.json(data);
})

app.get('/products/:id', async (req, res) => {
    const response = await fetch(`http://localhost:3001/products/${req.params.id}`);
    const data = await response.json();
    res.json(data);
})

app.get(`/userProducts/:userId`, async (req, res) => {
    try {
        const userResponse = await fetch(`http://localhost:3000/users/${req.params.userId}`);
        const userData = await userResponse.json();

        const productIds = userData.products || [];
        const productPromises = productIds.map(productId => fetch(`http://localhost:3001/products/${productId}`));
        const productResponses = await Promise.all(productPromises);
        const productData = await Promise.all(productResponses.map(res => res.json()));

        const combinedData = {
            user: userData,
            products: productData.length > 0 ? productData : []
        }

        res.json(combinedData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data"});
    }
})

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
})