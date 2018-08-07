'use strict';
//var bcrypt = require('bcryptjs');
//var saltRounds = 5;

var User = {
	id: {
		type: 'SERIAL'
		//allowNull: false,
	},
	name: {
		type: 'VARCHAR(255)',
		//allowNull: false,
	},
	dob: {
		type: 'VARCHAR(255)'
		//allowNull: false,
	},
	email: {
		type: 'VARCHAR(255)',
		//allowNull: false,
	},
	gender: {
		type: 'BOOLEAN',
		//allowNull: false,
	},
	phone: {
		type: 'INT',
		//allowNull: false,
	},
	ADDRESS: {
		type: 'VARCHAR(255)',
		//allowNull: false,
	},
}

module.exports = User;
