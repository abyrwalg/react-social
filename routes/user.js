const { Router } = require('express');

const router = Router();

const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/avatars/');
  },
  filename(req, file, cb) {
    const extension = /\.([a-z0-9]+)$/i.exec(file.originalname)[1];
    const fileName = `${cryptoRandomString({ length: 30 })}.${extension}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 },
});

const auth = require('../middleware/auth');
const userController = require('../controllers/user');

router.get('/', auth, userController.getLoggedUserData);

router.get('/:id', userController.getUserDataById);

router.put('/personal-data', auth, userController.updatePersonalData);

router.put('/main-data', auth, userController.updateMainData);

router.put('/career', auth, userController.updateCareer);

router.put('/education', auth, userController.updateEducation);

router.patch('/status', auth, userController.updateStatus);

router.post(
  '/avatar',
  auth,
  upload.single('avatar'),
  userController.updateAvatar
);

router.delete('/avatar', auth, userController.deleteAvatar);

module.exports = router;
