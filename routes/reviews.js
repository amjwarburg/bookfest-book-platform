import { Router } from "express";
import sqlite3 from "sqlite3";
import { ensureAuthenticated } from "../middleware/auth.js";
import { validateCsrfToken } from "../middleware/csrf.js";
import { promisify } from "node:util";

const db = new sqlite3.Database("databases/bookfest.db");
const router = Router();
const collectData = promisify(db.all.bind(db));
const runQuery = promisify(db.run.bind(db));
const getOne = promisify(db.get.bind(db));

router.get("/", async (req, res) => {
  try {
    const [reviews, userReadBooks] = await Promise.all([
      collectData(
        `SELECT u.firstName, b.title, b.cover_image, b.id AS book_id,
                ub.review_text, ub.review_created_at, ub.user_id
         FROM user_books ub
         JOIN users u ON u.id = ub.user_id
         JOIN books b ON b.id = ub.book_id
         WHERE ub.review_text IS NOT NULL AND ub.review_text != ''
         ORDER BY ub.review_created_at DESC`,
      ),
      req.session.user
        ? collectData(
            `SELECT b.id, b.title, ub.review_text
             FROM user_books ub
             JOIN books b ON b.id = ub.book_id
             WHERE ub.user_id = ? AND ub.status = 'read'
             ORDER BY b.title ASC`,
            [req.session.user.id],
          )
        : Promise.resolve([]),
    ]);
    res.render("reviews", { reviews, userReadBooks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving reviews");
  }
});

router.post("/:bookId", ensureAuthenticated, validateCsrfToken, async (req, res) => {
  const reviewText = req.body.review_text?.trim();
  if (!reviewText) return res.redirect("/reviews");
  const wordCount = reviewText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 50) return res.redirect("/reviews?error=too_short");
  try {
    const row = await getOne(
      "SELECT status FROM user_books WHERE user_id = ? AND book_id = ?",
      [req.session.user.id, req.params.bookId],
    );
    if (!row || row.status !== "read") return res.redirect("/reviews");
    await runQuery(
      "UPDATE user_books SET review_text = ?, review_created_at = datetime('now') WHERE user_id = ? AND book_id = ?",
      [reviewText, req.session.user.id, req.params.bookId],
    );
    res.redirect("/reviews");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving review");
  }
});

router.post("/:bookId/delete", ensureAuthenticated, validateCsrfToken, async (req, res) => {
  try {
    await runQuery(
      "UPDATE user_books SET review_text = NULL, review_created_at = NULL WHERE user_id = ? AND book_id = ?",
      [req.session.user.id, req.params.bookId],
    );
    res.redirect("/reviews");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting review");
  }
});

export default router;
