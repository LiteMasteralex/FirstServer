let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let studentSchema = mongoose.Schema({
	firstName : { type : String },
	lastName : { type : String },
	id : { 
		type : Number,
		require : true }
});

let Student = mongoose.model( 'Student', studentSchema );

let StudentList = {
	getAll : function() {
		return Student.find().then(function(students) {
			return students;
		}).catch(function(error) {
			throw Error(error);
		});
	},
	getOne : function(studentId) {
		return Student.find({id: studentId}).then(function(student) {
			return student;
		}).catch(function(error) {
			throw Error(error);
		});
	},
	post : function(newStudent) {
		return Student.find(newStudent).then(function(studentList) {
			if (studentList.length == 0) {
				return Student.create(newStudent).then(function(student) {
					return student;
				}).catch(function(error) {
					throw Error(error);
				});
			}
			return 409;
		}).catch(function(error) {
			throw Error(error);
		});
	},
	delete : function(studentId) {
		return Student.findOneAndRemove({id: studentId}).then(function(student) {
			return student
		}).catch(function(error) {
			throw Error(error);
		});
	}
}

module.exports = { StudentList };