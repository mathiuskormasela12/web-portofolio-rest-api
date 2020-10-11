// ========== ContentModel
// import all modules
const Database	= require('../core/Database');

class ContentModel extends Database {
	editHeader({ title, subtitle }, send) {
		this.db.query('UPDATE content SET ?', { title, subtitle }, err => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false');
			} else
					send('Content header berhasil di ubah', 200, 'success', 'false');
		});
	}
	getHeader(send) {
		this.db.query('SELECT * FROM content', (err, data) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else
					send('Content header berhasil di ambil', 200, 'success', 'true', data[0]);
		});
	}
	editAbout(text, send) {
		this.db.query('UPDATE about SET ?', { text }, err  => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false');
			} else 
					send('Text about berhasil di ubah', 200, 'success', 'true')
		});
	}
	getAbout(send) {
		this.db.query('SELECT * FROM about', (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else
					send('Text about berhasil diambil', 200, 'success', 'true', result[0])
		});
	}
	addSkill({ skill, level }, send) {
		this.db.query('SELECT * FROM skills WHERE skill = ?', [skill], (err,result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false');
			} else if(result.length > 0) 
					send('Skill sudah ada', 200, 'warning', 'false');
			else {
				this.db.query('INSERT INTO skills SET ?', { skill, level }, err => {
					if(err) {
						console.log(err);					
						send('Server Error', 500, 'danger', 'false')
					} else
							send('SKill berhasil ditambahkan', 200, 'success', 'true');
				});
			}
		});
	}
	removeSkill(id, send) {
		this.db.query('SELECT * FROM skills WHERE id = ?', [id], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false');
			} else if(result.length < 1) 
					send('Skill tidak ditemukan', 200, 'warning', 'false');
			else  {
				this.db.query('DELETE FROM skills WHERE id = ?', [id], err => {
					if(err) {
						console.log(err);
						send('Server Error', 500, 'danger', 'false');
					} else
							send('Skill terhapus', 200, 'success', 'true')
				});
			}
		});
	}
	getSkillById(id, send) {
		this.db.query('SELECT * FROM skills WHERE id = ?', [id], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else
					send('Skill sudah di dapatkan', 200, 'success', 'true', result[0]);
		});
	}
	editSkill({ id, skill, level }, send) {
		this.db.query('SELECT * FROM skills WHERE id = ?', [id], (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false');
			} else if(result.length < 1) 
					send('Skill tidak ditemukan', 200, 'warning', 'false');
			else {
				this.db.query('UPDATE skills SET ? WHERE id = ?', [{ skill, level }, id], err => {
					if(err) {
						console.log(err);
						send('Server Error', 500, 'danger', 'false');
					} else 
							send('Skill telah di edit', 200, 'success', 'true');
				});
			}
		});
	}
	getSkills(send) {
		this.db.query('SELECT * FROM skills ORDER BY id ASC', (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 500, 'danger', 'false', '');
			} else
					send('Skill berhasil di ambil', 200, 'success', 'true', result);
		});
	}
}

module.exports = new ContentModel();


