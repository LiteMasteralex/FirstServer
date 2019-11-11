let express = require("express");
let morgan = require("morgan");
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let { StudentList } = require('./model');
const  {DATABASE_URL, PORT} = require('./config');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(morgan("dev"));

let students = [{
	name: "Mario",
	id: 52463
}, {
	name: "Maria",
	id: 83746
}, {
	name: "Pedro",
	id: 65981
}]

app.get("/api/students", function(req, res, next) {
	/* OLD
	res.statusMessage = "Something went wrong, git reckt nrd";
	return res.status(400).json({
		message: "Something went wrong, git reckt nrd",
		status: 400
	});
	*/
	//return res.status(200).json(students);

	StudentList.getAll().then(function(students) {
		return res.status(200).json(students);
	}).catch(function(error) {
		res.statusMessage = "Internal Server Error"
		return res.status(500).json({
			message : "Internal Server Error",
			status : 500
		});
	});
});

app.post("/api/newStudent", jsonParser, function(req, res) {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let id = req.body.id;

	if (!firstName || !lastName || !id) {
		res.statusMessage = "Missing Field in body.";
		return res.status(406).json({
			message: "Missing Field in body.",
			status: 406
		});
	}

	let newStudent = {
		firstName,
		lastName,
		id
	};

	StudentList.post(newStudent).then(function(student) {
		if(student == 409) {
			res.statusMessage = "Id already Exists"
			return res.status(409).json({
				message : "Id already Exists",
				status : 409
			});
		}
		console.log(student);
		res.status(201).json({
			message: "Success",
			status: 201,
			student: student
		});
	}).catch(function(error) {
		res.statusMessage = "Internal Server Error"
		return res.status(500).json({
			message : "Internal Server Error",
			status : 500
		});
	});

	// OLD
	// if(students.find(object => object.id === id) != undefined) {
	// 	res.statusMessage = "Repeated identifier";
	// 	return res.status(409).json({
	// 		message: "Repeated identifier",
	// 		status: 409
	// 	});
	// }

	// newStudent = {
	// 	name: name,
	// 	id: id
	// };
	// students.push(newStudent);

	// return res.status(201).json({message: "Success"});
});

app.get("/api/getStudentByID", jsonParser, function(req, res) {
	let id = req.query.id;
	if(id == undefined) {
		res.statusMessage = "Missing id param";
		return res.status(406).json({
			message: "Missing id param",
			status: 406
		});
	}

	// OLD
	// let student = students.find(object => object.id == id);
	// if(student == undefined) {
	// 	res.statsMessage = "Student id not found on the list";
	// 	return res.status(404).json({
	// 		message: "Student id not found on the list",
	// 		status: 404
	// 	});
	// }
	// return res.status(202).json(student);
	StudentList.getOne(id).then(function(students) {
		if(students.length == 0) {
			res.statsMessage = "Student id not found";
			return res.status(404).json({
				message: "Student id not found",
				status: 404
			});
		}
		return res.status(200).json(students);
	}).catch(function(error) {
		res.statusMessage = "Internal Server Error"
		return res.status(500).json({
			message : "Internal Server Error",
			status : 500
		});
	});
});

app.delete("/api/removeStudent/:id", jsonParser, function(req, res) {
	let id = req.params.id;
	if (id == undefined) {
		res.statusMessage = "Missing id param";
		return res.status(406).json({
			message: "Missing id param",
			status: 406
		});
	}

	StudentList.delete(id).then(function(student) {
		if(student.length == null) {
			res.statsMessage = "Student id not found";
			return res.status(404).json({
				message: "Student id not found",
				status: 404
			});
		}
		return res.status(202).json(student);
	}).catch(function(error) {
		console.log(error);
		res.statusMessage = "Internal Server Error"
		return res.status(500).json({
			message : "Internal Server Error",
			status : 500
		});
	})

	// OLD
	// let student = students.find(object => object.id == id);
	// if(student == undefined) {
	// 	res.statsMessage = "Student id not found on the list";
	// 	return res.status(404).json({
	// 		message: "Student id not found on the list",
	// 		status: 404
	// 	});
	// }

	// students = students.filter(object => object.id != id);
	// return res.status(202).json(student);	
});

app.put("/api/updateStudent/:id", jsonParser, function(req, res) {
	let idParams = req.params.id;
	if (idParams == undefined) {
		res.statusMessage = "Missing id param";
		return res.status(406).json({
			message: "Missing id param",
			status: 406
		});
	}

	let name = req.body.name;
	let id = req.body.id;

	if (!name || !id) {
		res.statusMessage = "Missing Field in body.";
		return res.status(406).json({
			message: "Missing Field in body.",
			status: 406
		});
	}

	if (idParams != id) {
		res.statusMessage = "Bad request id in params does not match with body.";
		return res.status(409).json({
			message: "Bad request id in params does not match with body.",
			status: 409
		});
	}

	let student = students.findIndex(object => object.id == id);
	if(student == -1) {
		res.statsMessage = "Student id not found on the list";
		return res.status(404).json({
			message: "Student id not found on the list",
			status: 404
		});
	}
	students[student].name = name;
	return res.status(202).json(req.body);
})

// app.listen("8080", function() {
// 	console.log("You have entered a cursed land.")
// });

let server;

function runServer(port, databaseUrl) {
	return new Promise( function(resolve, reject) {
		mongoose.connect(databaseUrl, function(error) {
			if (error) {
				return reject(error);
			}
			else {
				server = app.listen(port, function() {
					console.log('You have entered a cursed land ' + port);
					resolve();
				}).on('error', function(error) {
					mongoose.disconnect();
					return reject(error);
				});
			}
		});
	});
};

runServer(PORT, DATABASE_URL).catch(function(error) {
	console.log(error);
});

function closeServer(){
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing the server');
			server.close( err => {
				if (err){
					return reject(err);
				}
				else{
					resolve();
				}
			});
		});
	});
}

module.exports = { app, runServer, closeServer };