const NodeCache = require('node-cache');
const myCache = new NodeCache();


exports.getTasks = (req, res) => {
    const tasks = myCache.get('tasks');
    if (!tasks) {
        const initialTasks = [];
        myCache.set('tasks', initialTasks);
        res.json(initialTasks);
    } else {
        res.json(tasks);
    }
};


exports.addTask = (req, res) => {
    const tasks = myCache.get('tasks') || [];
    const newTask = { id: Date.now().toString(), title: req.body.title, completed: false };
    tasks.push(newTask);
    myCache.set('tasks', tasks);
    res.json(newTask);
};


exports.completeTask = (req, res) => {
    const taskId = req.params.id;
    const tasks = myCache.get('tasks') || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        myCache.set('tasks', tasks);
        res.json(task);
    } else {
        res.sendStatus(404);
    }
};


exports.editTask = (req, res) => {
    const taskId = req.params.id;
    const tasks = myCache.get('tasks') || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.title = req.body.title;
        myCache.set('tasks', tasks);
        res.json(task);
    } else {
        res.sendStatus(404);
    }
};


exports.deleteTask = (req, res) => {
    const taskId = req.params.id;
    let tasks = myCache.get('tasks') || [];
    tasks = tasks.filter(t => t.id !== taskId);
    myCache.set('tasks', tasks);
    res.sendStatus(200);
};
