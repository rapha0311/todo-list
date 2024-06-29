require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

