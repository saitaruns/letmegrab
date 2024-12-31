const express = require('express');
const cors = require('cors');
const productRouter = require('./productRouter.js');
const categoryRouter = require('./categoryRouter.js');
const materialRouter = require('./materialRouter.js');
const productMediaRouter = require('./productMediaRouter.js');
const errorHandler = require('./errorHandler.js');

const app = express();
const PORT = process.env.PORT || 4312;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/materials', materialRouter);
app.use('/api/product-media', productMediaRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});