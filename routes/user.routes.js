const { Router } = require("express");

const router = Router();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/avatars/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
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

const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user");

router.get("/", auth, userController.getLoggedUserData);

router.get("/:id", userController.getUserDataById);

router.put("/personal-data", auth, userController.updatePersonalData);

router.put("/main-data", auth, userController.updateMainData);

router.put("/career", auth, userController.updateCareer);

router.put("/education", auth, userController.updateEducation);

router.patch("/status", auth, userController.updateStatus);

router.post(
  "/avatar",
  auth,
  upload.single("avatar"),
  userController.updateAvatar
);

router.delete("/avatar", auth, userController.deleteAvatar);

module.exports = router;
