// ========== Pages
// import all modules
const express					= require('express');
const upload					= require('express-fileupload');

// import several controllers
const authController	= require('../controllers/authController');
const contentController	= require('../controllers/contentController');
const portofolioController = require('../controllers/portofolioController');

// init router
const router					= express.Router();

// setup upload
router.use(upload({
	createParentPath: true
}));

router.get('/', authController.start);
router.post('/login', authController.login);
router.put('/user/edit/password', authController.editPassword);
router.get('/user', authController.getUserById);
router.get('/header', contentController.getHeader);
router.get('/about', contentController.getAbout);
router.get('/skill', contentController.getSkills);
router.get('/portofolio/:id', portofolioController.getPortofolioById);
router.get('/several-portofolio', portofolioController.getPortofolio);
router.get('/portofolio', portofolioController.getAllPortofolio);
router.use(authController.midd);
router.post('/register', authController.register);
router.get('/profile', authController.getProfile);
router.put('/user', authController.editUser);
router.put('/header', contentController.editHeader);
router.put('/about', contentController.editAbout);
router.post('/skill', contentController.addSkill);
router.delete('/skill/:id', contentController.removeSkill);
router.get('/skill/:id', contentController.getSkillById);
router.put('/skill', contentController.editSkill);
router.post('/portofolio', portofolioController.addPortofolio);
router.put('/portofolio', portofolioController.editPortofolio);
router.delete('/portofolio/:id', portofolioController.removePortofolio);

module.exports = router;



