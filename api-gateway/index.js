const express = require('express');
// const fetch = require('node-fetch');
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')

const jwtSecret = "coffeebridgeradio"
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

const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded;

        next()
    } catch (err) {
        console.error('Invalid token:', err)
        return res.sendStatus(401)
    }
}

const authenticate = (username, password) => {

    if (username === 'admin' && password == 'password') {
        return true
    }

    return false
}

const limiter = rateLimit({
    windowMs: 15*60*1000, //15min in milliseconds
    max: 100, // Limit each IP to 100 requests per `windowMs`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { // Custom response body
        status: 429,
        message: "Too many requests, please try again later."
    },
})

app.use(bodyParser.json());
app.use(limiter);

app.post('/auth', limiter, (req, res) => {
    console.log(req.body)
    const {username, password} = req.body;

    if (authenticate(username, password)) {
        const token = jwt.sign( { username }, jwtSecret);
        res.json({ token });
    } else {
        res.status(401).json({message: "invalid credentials"})
    }
})

app.get('/users/:id', limiter, authMiddleware, async (req, res) => {
    const response = await fetch(`http://localhost:3000/users/${req.params.id}`);
    const data = await response.json();
    res.json(data);
})

app.get('/products/:id', limiter, jwtAuthMiddleware, async (req, res) => {
    const response = await fetch(`http://localhost:3001/products/${req.params.id}`);
    const data = await response.json();
    res.json(data);
})

app.get(`/userProducts/:userId`, limiter, async (req, res) => {
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