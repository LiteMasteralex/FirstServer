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

let usersSchema = mongoose.Schema({
	username: { type : String },
	password: { type : String }
});

let User = mongoose.model( 'User', usersSchema );

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
	},
	put : function( updatedStudent ){
		return StudentList.getByID( updatedStudent.id )
			.then( student => {
				if ( student ){
					return Student.findOneAndUpdate( {id : student.id}, {$set : updatedStudent}, {new : true})
						.then( newStudent => {
							return newStudent;
						})
						.catch(error => {
							throw Error(error);
						});
				}
				else{
					throw Error( "404" );
				}
			})
			.catch( error => {
				throw Error(error);
			});
	}
}

let UserList = {
	get : function(user) {
		return User.find({username: user.username}).then(function(foundUser) {
			return foundUser;
		}).catch(function(error) {
			throw Error(error);
		});
	},
	post : function(newUser) {
		return User.find({username: newUser.username}).then(userList => {
			if (userList.length == 0) {
				return User.create(newUser).then(user => {
					return user;
				}).catch(function(error) {
					throw Error(error);
				});
			}
			throw Error( " 409 ");
		}).catch(error => {
			throw Error(error);
		});
	}
}

module.exports = { StudentList, UserList };