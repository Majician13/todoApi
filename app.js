const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/todo';

mongoose.connect(DB_URL, { dbName: 'todo' }, (err) => {
	if (!err) {
		console.log('Connected to database');
	} else {
		console.log(err);
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ToDoSchema = new mongoose.Schema({
	title: String,
	description: String,
	createdBy: String,
	createAt: { type: Date, default: Date.now() },
});

const toDo = mongoose.model('ToDo', ToDoSchema);

// CREATE TO-DO
app.post('/', (req, res) => {
	const { title, description, createdBy } = req.body;

	var toDoAdd = new toDo({
		title: title,
		description: description,
		createdBy: createdBy,
	});

	toDoAdd.save((err, todo) => {
		if (err) {
			res.status(500).json({
				err,
			});
		} else {
			res.status(201).json({
				message: 'To-Do has been created',
				todo,
			});
		}
	});
});

// VIEW TO-DO
app.get('todos/', (req, res) => {
	toDo.find({}, (err, toDos) => {
		if (err) {
			res.status(500).json({
				err,
			});
		} else {
			res.status(200).json({
				message: 'All ToDos',
				toDos,
			});
		}
	});
});

// VIEW SINGLE TO-DO
app.get('todos/:todo_id', (req, res) => {
	const { todo_id } = req.params;

	toDo.findById(todo_id, (err, toDo) => {
		if (err) {
			res.status(500).json({
				err,
			});
		} else {
			res.status(200).json({
				message: 'To-Do',
				toDo,
			});
		}
	});
});

// UPDATE SINGLE TO-DO
app.patch('todos/:todo_id', (req, res) => {
	const { todo_id } = req.params;

	const { title, description, createdBy } = req.body;

	toDo.findByIdAndUpdate(
		todo_id,
		{
			title: title,
			description: description,
			createdBy: createdBy,
		},
		(err, toDo) => {
			if (err) {
				res.status(500).json({
					err,
				});
			} else {
				res.status(200).json({
					message: 'To-Do updated',
					toDo,
				});
			}
		}
	);
});

// REMOVE SINGLE TO-DO
app.delete('todos/:todo_id', (req, res) => {
	const { todo_id } = req.params;

	toDo.findByIdAndDelete(todo_id, (err, toDo) => {
		if (err) {
			res.status(500).json({
				err,
			});
		} else {
			res.status(200).json({
				message: 'To-Do has been removed',
				toDo,
			});
		}
	});
});

// REMOVE ALL TO-DO
app.delete('todos/', (req, res) => {
	toDo.remove({}, (err, toDo) => {
		if (err) {
			res.status(500).json({
				err,
			});
		} else {
			res.status(200).json({
				message: 'All To-Do has been removed',
				toDo,
			});
		}
	});
});

app.listen(PORT, () => {
	console.log('Server listening on ' + PORT);
});
