// ========== PortofolioModel
// import all modules
const Database			= require('../core/Database');

class PortofolioModel extends Database {
	addPortofolio({ title, description }, photo, send) {
		this.db.query('SELECT * FROM portofolio WHERE title = ?', [title], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', false);
			} else if(result.length > 0) 
					send('Portofolio sudah ada', 200, 'warning', false);
			else {
				this.db.query('INSERT INTO portofolio SET ?', { title, description, photo}, err => {
					if(err) {
						console.log(err);
						send('Server Error', 500, 'danger', false);
					} else
							send('Portofolio berhasil ditambah', 200, 'success', true);
				});
			}
		});
	}
	getPhotoById(id, send) {
		this.db.query('SELECT photo FROM portofolio WHERE id = ?', id, (err, result) => {
			if(err) 
				console.log(err);
			else
				send(result[0].photo);
		});
	}
	getPortofolioById(id, send) {
		this.db.query('SELECT * FROM portofolio WHERE id = ?', [id], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else
					send('Berhasil mengambil portofolio', 200, 'success', 'true', result[0]);
		});
	}
	getSeveralPortofolio(send) {
		this.db.query('SELECT * FROM portofolio LIMIT 6', (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else {
					let results = result.map(item => {
						return { id: item.id, title: item.title, description: item.description, photo: process.env.LINKPHOTO + item.photo}
					});
					send('Berhasil mengambil portofolio', 200, 'success', 'true', results);
			}
		});
	}
	getAllPortofolio(send) {
		this.db.query('SELECT * FROM portofolio ORDER BY title ASC', (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else {
					let results = result.map(item => {
						return { id: item.id, title: item.title, description: item.description, photo: process.env.LINKPHOTO + item.photo}
					});
					send('Berhasils mengambil portofolio', 200, 'success', 'true', results);
			}
		});
	}
	editPortofolio({ title, description, id }, photo, send) {
		this.db.query('SELECT * FROM portofolio WHERE id = ?', [id], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', false, '');
			} else if(result.length > 1) 
					send('Portofolio tidak dikenali', 200, 'warning', false, '');
			else {
				this.db.query('UPDATE portofolio SET ? WHERE id = ?', [{ title, description, photo }, id], err => {
					if(err) {
						console.log(err);
						send('Server Error', 500, 'danger', false, '');
					} else
							send('Portofolio berhasil di edit', 200, 'success', true, result[0].photo)
				});
			}
		});
	}
	removePortofolio(id, send) {
		this.db.query('SELECT * FROM portofolio WHERE id = ?', [id], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', false, '');
			} else if(result.length < 1) 
					send('Portofolio tidak dikenali', 200, 'warning', false, '');
			else {
				this.db.query('DELETE FROM portofolio WHERE id = ?', [id], err => {
					if(err) {
						console.log(err);
						send('Server Error', 500, 'danger', false, '');
					} else
							send('Portofolio telah dihapus', 200, 'success', true, result[0].photo);
				});
			}
		});
	}
}

module.exports = new PortofolioModel();
