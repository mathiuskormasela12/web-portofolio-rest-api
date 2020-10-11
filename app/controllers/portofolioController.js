// ========== portofolioController
// import all modules
const fs								= require('fs');

// import several models
const PortofolioModel		= require('../models/PortofolioModel');

exports.addPortofolio		= async function(req, res) {
	if(!req.body.title || !req.body.description) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'form kosong'
		});
	}	

	if(req.body.title.length > 30 || req.body.description.length > 120) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'title atau description terlalu panjang'
		});
	}

	const photo = await upload(req);

	if(photo.success != 'true') {
		return res.status(photo.status).json({
			status: photo.status,
			type: photo.type,
			success: photo.success,
			message: photo.message
		});
	}

	PortofolioModel.addPortofolio(req.body, photo.message, (message, status, type, success) => {
		if(!success) {
			fs.unlink('./public/uploads/' + photo.message, err => {
				if(err)
					console.log(err);
			});
		}
		res.status(status).json({
			status,
			type,
			success: String(success),
			message
		});
	});
}

exports.editPortofolio		= function(req, res) {
	if(!req.body.id || !req.body.title || !req.body.description) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'form kosong'
		});
	}

	if(req.body.title.length > 30 || req.body.description.length > 120) {
		return res.status(200).json({
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'title atau description terlalu panjang'
		});
	}
	
	PortofolioModel.getPhotoById(req.body.id, async file => {
		let photo = '';
		if(!req.files) {
			photo = { message: file };
		} else {
			photo = await upload(req);
			if(photo.type != 'success') {
				return res.status(photo.status).json({
					status: photo.status,
					type: photo.type,
					success: photo.success,
					message: photo.message
				});
			}
		}
		
		PortofolioModel.editPortofolio(req.body, photo.message, (message, status, type, success, photos) => {
			if(!success && !req.files) {
				fs.unlink('./public/uploads/' + photo.message, err => {
					if(err) 
						console.log(err);
				});
			} else if(req.files) {
				fs.unlink('./public/uploads/' + photos, err => {
					if(err)
						console.log(err);
				})
			}

			res.status(status).json({
				status,
				type,
				success: String(success),
				message
			});
		});
	})
}

exports.removePortofolio	= function(req, res) {
	const id = req.params.id;

	PortofolioModel.removePortofolio(id, (message, status, type, success, photo) => {
		if(success) {
			fs.unlink('./public/uploads/' + photo, err => {
				if(err)
					console.log(err);
			});
		}

		res.status(status).json({
			status,
			type,
			success: String(success),
			message
		});
	});
}

exports.getPortofolioById		= function(req, res) {
	const id = req.params.id;
	PortofolioModel.getPortofolioById(id, (message, status, type, success, result) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result
		})
	});
}

exports.getPortofolio = function(req, res) {
	PortofolioModel.getSeveralPortofolio((message, status, type, success, result) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result
		});
	});
}

exports.getAllPortofolio = function(req, res) {
		
	PortofolioModel.getAllPortofolio((message, status, type, success, result) => {
		res.status(status).json({
			status,
			type,
			success,
			message,
			result 
		});

	});
}

function upload(req) {

	if(!req.files) {
		return {
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'wajib unggah foto portofolio'
		}
	}

	const photo = req.files.photo;
	const extValid = /jpg|jpeg|png/g;
	const checkFileType	= extValid.test(photo.name);
	const checkFileMimeType	= extValid.test(photo.mimetype);

	if(!checkFileType && !checkFileMimeType) {
			return {
				status: 200,
				type: 'warning',
				success: 'false',
				message: 'tidak dapat upload file selain foto'
			}
	}

	if(photo.size > 3000000) {
		return {
			status: 200,
			type: 'warning',
			success: 'false',
			message: 'photo max 3mb'
		}
	}
		
	let file = photo.name.split('.')[0];
	const ext	= photo.name.split('.')[1].toLowerCase();
	file += '-';
	file += Date.now();
	file += '.';
	file += ext;

	photo.mv('./public/uploads/' + file);
	return {
		status: 200,
		type: 'success',
		success: 'true',
		message: file
	}
}

