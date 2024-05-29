const express = require("express");
const router = express.Router();
const Article = require("../mongo_schemas/article");
const uri = require("../db/db_mongo");

var auth = function (req, res, next) {
  if (req.session && (req.session.admin || req.session.user)) {
    return next();
  } else {
    console.log("Reririge");
    res.redirect("/login");
  }
};

router.get("/new", auth, (req, res) => {
    if (req.session && req.session.admin) {
      res.render("blog/admin/new-article", { article: new Article() });
    } else {
      res.redirect("/login");
    }
  });
  

router.get("/:slug", auth, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (req.session && req.session.admin) {
    res.render("blog/admin/show_admin", { article: article });
    if (article == null) res.redirect("/articles");
  } else if (req.session && req.session.admin) {
    res.send(req.params.id);
  } else {
    res.redirect("/login");
  }
});

router.get("/", auth, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  if (req.session && req.session.admin) {
    res.render("blog/admin/index_admin", { articles: articles });
  } else if (req.session && req.session.user) {
    res.render("blog/usuario/index_user", { articles: articles });
  } else {
    res.redirect("/login");
  }
});

router.post("/", auth, async (req, res) => {
  if (req.session && req.session.admin) {
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown,
    });

    await article
      .save()
      .then(() => {
        res.redirect(`/articles/${article.id}`);
      })
      .catch((err) => {
        console.error("Error saving the article:", err);
        res.render("blog/admin/new-article", { article: article });
      });
  } else {
    res.send("Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (req.session && req.session.admin) {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/articles");
  } else {
    res.send("Error");
  }
});

module.exports = router;
