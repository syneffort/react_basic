const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 5000;

mongoose.connect(process.env.MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => {
    console.log('MongoDB connected...');
}).catch((error) => {
    console.error(`❗ ${error}`);
});

app.listen(port, () => {
    console.log(`✔ Example app listening on port ${port}`);
});
