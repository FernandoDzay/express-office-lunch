const express = require('express');
const app = express();
const port = 3001;
const UsersRoutes = require('./routes/UsersRoutes');
const HomeRoutes = require('./routes/HomeRoutes');
const ErrorHandler = require('./middlewares/ErrorHandler');


app.use(express.json());

/* ------------------------ Routes -------------------------------- */
app.use('/', HomeRoutes);
app.use('/users', UsersRoutes);
/* ---------------------------------------------------------------- */

// Error Handling
app.use(ErrorHandler);

app.listen(port, () => console.log(`App listen in port ${port}`));