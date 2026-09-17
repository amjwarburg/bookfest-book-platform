import { Router } from "express";
import sqlite3 from "sqlite3";
import { promisify } from "node:util";
import { ensureAuthenticated } from "../middleware/auth.js";
const db = new sqlite3.Database("databases/bookfest.db");
const router = Router();
const collectData = promisify(db.all.bind(db));
const getOne = promisify(db.get.bind(db));

router.get("/", (req, res) => {
  if (req.session.user && req.session.user.id) {
    res.redirect("/profile/" + req.session.user.id);
  } else {
    res.redirect("/users/login");
  }
});

// Claude implemented this ensureAuthenticated check for me
router.route("/:id").get(ensureAuthenticated, async (req, res) => {
  if (
    parseInt(req.params.id) !== req.session.user.id &&
    !req.session.user.is_admin
  ) {
    return res.status(403).send("Forbidden");
  }

  try {
    const [profileUser, readBooks] = await Promise.all([
      getOne(
        "SELECT id, firstName, lastName, email, is_admin FROM users WHERE id = ?",
        [req.params.id],
      ),
      collectData(
        `SELECT b.id, b.title, b.author, b.cover_image, ub.review_text
         FROM user_books ub
         JOIN books b ON b.id = ub.book_id
         WHERE ub.user_id = ? AND ub.status = 'read'
         ORDER BY b.title ASC`,
        [req.params.id],
      ),
    ]);
    if (!profileUser) return res.status(404).send("User not found");
    res.render("profile", { user: profileUser, readBooks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving user profile");
  }
});

export default router;
