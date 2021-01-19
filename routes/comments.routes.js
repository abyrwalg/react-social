const { Router } = require("express");

const commentsController = require("../controllers/comments");
const auth = require("../middleware/auth.middleware");

const router = Router();

router.post("/", auth, commentsController.postComment);

router.get("/:id", commentsController.getCommentsByParentId);

module.exports = router;
