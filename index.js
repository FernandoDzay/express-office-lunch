require('dotenv').config();
require('./services/Crons');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const UsersRoutes = require('./routes/UsersRoutes');
const HomeRoutes = require('./routes/HomeRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const FoodsRoutes = require('./routes/FoodsRoutes');
const ExtrasRoutes = require('./routes/ExtrasRoutes');
const GroupsRoutes = require('./routes/GroupsRoutes');
const SettingsRoutes = require('./routes/SettingsRoutes');
const MenuRoutes = require('./routes/MenuRoutes');
const NotificationsRoutes = require('./routes/NotificationsRoutes');
const OrdersRoutes = require('./routes/OrdersRoutes');
const PaymentsRoutes = require('./routes/PaymentsRoutes');
const CronsRoutes = require('./routes/CronsRoutes');
const ErrorHandler = require('./middlewares/ErrorHandler');


app.use(cors())
app.use(express.json());
app.use(express.static('./public/'));

/* ------------------------ Routes -------------------------------- */
app.use('/', HomeRoutes);
app.use('/users', UsersRoutes);
app.use('/auth', AuthRoutes);
app.use('/foods', FoodsRoutes);
app.use('/extras', ExtrasRoutes);
app.use('/groups', GroupsRoutes);
app.use('/menu', MenuRoutes);
app.use('/settings', SettingsRoutes);
app.use('/notifications', NotificationsRoutes);
app.use('/orders', OrdersRoutes);
app.use('/payments', PaymentsRoutes);
app.use('/crons', CronsRoutes);
/* ---------------------------------------------------------------- */

// Error Handling
app.use(ErrorHandler);

app.listen(port, () => console.log(`App listen in port ${port}`));