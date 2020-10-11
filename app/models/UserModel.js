// ======== UserModel
// import all modules
const Database			= require('../core/Database');
const bcrypt				= require('bcryptjs');
const jwt						= require('jsonwebtoken');
const fs						= require('fs');

// init secret key
const key						= process.env.SECRET;

class UserModel extends Database {
	register(full_name, email, password, photo, send) {
		this.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, data) => {
			if(err) {
				console.log(err);
				send('Server Error', 'danger', 500, false );
			} else if(data.length > 0) 
					send('Email sudah digunakan', 'warning', 200, false);
			else {
				const hash = await bcrypt.hash(password, 8);
				this.db.query('INSERT INTO users SET ?', { full_name, email, password: hash, photo}, err => {
					if(err) {
						console.log(err);
						send('Server Error', 'danger', 500, false)
					} else 
							send('Registrasi berhasil', 'success', 200, true)
				});
			}
		});
	}

	login({ email, password }, send) {
		this.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 'danger', 500, false, '');
			} 
			else if(result.length < 1 || !(await bcrypt.compare(password, result[0].password))) 
				send('Email atau password salah', 'warning', 200, false, '');
			else {
				const token = jwt.sign({ id: result[0].id, email, password, photo: result[0].photo }, key, {
					expiresIn: '48h'
				});
				send('Login berhasil', 'success', 200, true, token);
			}
		});
	}

	getUserById(send) {
		this.db.query('SELECT * FROM users', (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 'danger', 500, false, '');
			}	else
					send(`Berhasil mengambil data user`, 'success', 200, true, result[0]);
		});
	}

	editPassword(email, newPassword, send) {
		this.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
			if(err) {
				console.log(err);
				send('Server Error', 'danger', 500, false);
			}
			else if(result.length < 1)
				send('Email tidak dikenali', 'warning', 200 , false);
			else {
				const hash	= await bcrypt.hash(newPassword, 8);
				this.db.query('UPDATE users SET ? WHERE email = ?', [{ password: hash }, email], err => {
					if(err) {
						console.log(err);
						send('Server Error', 'danger', 500, false);
					} else
							send('Password berhasil di edit', 'success', 200, true);
				});
			}
		});
	}
	
	getPhotoById(id, send) {
		this.db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
			if(err)
				console.log(err);
			else 
				send(result[0].photo);
		});
	}

	editUser(id, full_name, email, password, photo, send) {
		this.db.query('SELECT * FROM users WHERE id = ?', [id], async (err, result) => {
			if(err)  {
				console.log(err);
				send('Server Error', 'danger', 500, false, '');
			}
			else {
				const hash = await bcrypt.hash(password, 8);
				this.db.query('UPDATE users SET ? WHERE id = ?', [{ full_name, email, password: hash, photo}, id], err => {
					if(err) {
						console.log(err);
						send('Server Error', 'danger', 500, false, '');
					}  else
							send('Profile berhasil di ubah', 'success', 200, true, result[0].photo);
				});
			}
		});
	}
}

module.exports = new UserModel();
