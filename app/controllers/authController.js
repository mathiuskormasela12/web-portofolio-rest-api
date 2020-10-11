// ========== authController
// import all modules
const bcrypt				= require('bcryptjs');
const jwt						= require('jsonwebtoken');
const fs						= require('fs');

// import several models
const UserModel			= require('../models/UserModel');

// connecting database
UserModel.connect();

// int secret key
const key						= process.env.SECRET;

exports.start				= function(req, res) {
	res.status(200).json({
		status: 200,
		success: 'true',
		message: 'Selamat Datang di Web Service Website Portofolio ku'
	});
}

exports.midd				= function(req, res, next) {
	const token				= req.body.token || req.query.token || req.headers['auth'];

	if(token) {
		jwt.verify(token, key, (err, decode) => {
			if(err) {
				console.log(err);
				res.status(403).json({
					status: 403,
					success: 'false',
					type: 'danger',
					message: 'token bermasalah'
				});
			} else {
				if(decode.exp < Date.now() / 1000) {
								console.log(decode)
					res.status(200).json({
						status: 200,
						success: 'false',
						type: 'warning',
						message: 'token sudah kadalwarsa'
					});
				} else { 
						req.decode = decode;
						next();
				}
			}
		});
	} else {
		res.status(403).json({
			status: 403,
			success: 'false',
			type: 'danger',
			message: 'tidak ada token'
		});
	}
}

exports.register		= async function(req, res) {
	const { 
		first_name,
		email,
		password,
		passwordConfirm
	} = req.body;
	let last_name = req.body.last_name || '';

	if(!first_name || !email || !password || !passwordConfirm) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Form tidak boleh kosong'
		});
	}

	const checkEmail = email.split('@')[1];
	
	if(checkEmail === '' || checkEmail == null || !checkEmail) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Format email salah'
		});
	}

	else if(password !== passwordConfirm) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Password tidak cocok'
		});
	}

	else if(password.match(/[a-z]/g) === null || password.match(/[A-Z]/g) === null || password.match(/\d/g) === null) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Password harus terdiri dari huruf kapital & besar serta angka'
		});
	}

	else {
		const photo = await upload(req);

		if(!photo.success) {
			return res.status(photo.status).json({
				status: photo.status,
				success: String(photo.success),
				type: photo.type,
				message: photo.message
			});
		}

		const full_name = first_name.concat(' ', last_name);
		UserModel.register(full_name, email, password, photo.message, (message, type, status, success) => {
			if(!success) {
				fs.unlink('./public/uploads/' + photo.message, err => {
					if(err)
						console.log(err);
				})
			}

			res.status(status).json({
				status,
				success: String(success),
				type,
				message
			});
		});
	}
}

exports.login	= function(req, res) {
	if(!req.body.email || !req.body.password) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Form kosong'
		});
	}

	UserModel.login(req.body, (message, type, status, success, token) => {
		res.status(status).json({
			status,
			success: String(success),
			type,
			message,
			token
		});
	});
}

exports.getUserById			= function(req, res) {
	UserModel.getUserById((message, type, status, success, result) => {
		res.status(status).json({
			status,
			success: String(success),
			type,
			message,
			result: {
				id: result.id,
				full_name: result.full_name,
				email: result.email,
				hash: result.password,
				photo: process.env.LINKPHOTO + result.photo
			}
		});
	});
}

exports.getProfile			= function(req, res) {
	UserModel.getUserById((message, type, status, success, result) => {
		res.status(status).json({
			status,
			success: String(success),
			type,
			message,
			result: {
				id: result.id,
				full_name: result.full_name,
				email: result.email,
				password: req.decode.password
			}
		});
	});
}

exports.editUser				= async function(req, res) {
	const { 
		first_name,
		email,
		password,
		passwordConfirm
	} = req.body;
	let last_name = req.body.last_name || '';
	const id	= req.decode.id;

	if(!first_name || !email || !password || !passwordConfirm) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Form kosong'
		});
	}

	const full_name = first_name.concat(' ', last_name);
	if(!email.split('@')[1]) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Format email salah'
		});
	}

	if(password.match(/[A-Z]/g) === null || password.match(/[a-z]/g) === null || password.match(/\d/g) === null) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Password harus terdiri dari huruf kapital, huruf kecil & angka'
		});
	}

	if(password !== passwordConfirm) {
		return res.status(200).json({
			status: 200,
			success: 'false',
			type: 'warning',
			message: 'Password tidak cocok'
		});
	}

	let photo = '';
	
	UserModel.getPhotoById(id, async img => {
			if(!req.files) {
				photo = img;
			} else {
					var file = await upload(req);

					if(!file.success) {
						return res.status(file.status).json({
							status: file.status,
							success: String(file.success),
							type: file.type,
							message: file.message
						});
					}

					photo = file.message;
			}

			UserModel.editUser(id, full_name, email, password, photo, (message, type, status, success, photo) => {
				if(success && req.files) {
					fs.unlink('./public/uploads/' + photo, err => {
						if(err)
							console.log(err);
					})
				}

				res.status(status).json({
						status,
						success: String(success),
						type,
						message
				});
			});
		});
	}

exports.editPassword		= function(req, res) {
	const { email, newPassword } = req.body;

	if(!email || !newPassword) {
		return res.status(200).json({
							status: 200,
							success: 'false',
							type: 'warning',
							message: 'Form kosong'
						});
	}
				
	else if(newPassword.match(/[A-Z]/g) === null || newPassword.match(/[a-z]/gi) === null || newPassword.match(/\d/g) === null) {
		return res.status(200).json({
							status: 200,
							success: 'false',
							type: 'warning',
							message: 'Password harus tediri dari, huruf kapital, huruf kecil & angka'
					});
	}
	
	UserModel.editPassword(email, newPassword, (message, type, status, success) => {
		res.status(status).json({
			status,
			success,
			type,
			message
		});
	});
}

function upload(req) {
	if(!req.files) {
		return {
			status: 200,
			success: false,
			type: 'warning',
			message: 'wajib upload foto'
		}
	}

	const photo							= req.files.photo;
	const extValid					= /jpg|jpeg|png/gi;
	const checkFileType			= extValid.test(photo.name);
	const checkMimeType			= extValid.test(photo.mimetype);

	if(!checkFileType && !checkMimeType) {
		return {
			status: 200,
			success: false,
			type: 'warning',
			message: 'anda tidak bisa mengunggah selain foto'
		}
	}

	if(photo.size > 3000000) {
		return {
			status: 200,
			success: false,
			type: 'warning',
			message: 'ukuran foto max 3 mb'
		}
	}

	let file 	= photo.name.split('.')[0];
	const ext	= photo.name.split('.')[1].toLowerCase();
	file += '-';
	file += Date.now();
	file += '.';
	file += ext;

	photo.mv('./public/uploads/' + file);
	return {
		message: file,
		success: true
	}
}
