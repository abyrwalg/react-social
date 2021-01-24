const { Router } = require("express");

const commentsController = require("../controllers/comments");
const auth = require("../middleware/auth.middleware");

const router = Router();

router.post("/", auth, commentsController.postComment);
router.delete("/", auth, commentsController.deletePostById);
router.get("/:id", commentsController.getCommentsByParentId);
router.put("/", auth, commentsController.editComment);
router.post("/likes", auth, commentsController.toggleLike);

module.exports = router;
