const express = require("express");
const router = express.Router();
const Article = require("../mongo_schemas/article");
const uri = require("../db/db_mongo");

//Middleware de autenticación
var auth = function (req, res, next) {
  if (req.session && (req.session.admin || req.session.user)) {
    return next();
  } else {
    console.log("Reririge");
    res.redirect("/login");
  }
};

//Para crear un artículo (solo podrán crearlo administradores)
router.get("/new", auth, (req, res) => {
  if (req.session && req.session.admin) {
    res.render("blog/admin/new-article", { article: new Article() });
  } else {
    res.redirect("/login");
  }
});

//Para editar un artículo (solo podrán editarlo administradores)
router.get("/edit/:id", auth, async (req, res) => {
  if (req.session && req.session.admin) {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.redirect("/articles");
      }
      res.render("blog/admin/edit-article", { article: article });
    } catch (error) {
      return res.redirect("/articles");
    }
  } else {
    res.redirect("/login");
  }
});

//Para ver el artículo (para administradores y usuarios será una interfaz diferente)
router.get("/:slug", auth, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (req.session && req.session.admin) {
    res.render("blog/admin/show_admin", { article: article });
    if (article == null) res.redirect("/articles");
  } else if (req.session && req.session.user) {
    res.render("blog/usuario/show_user", { article: article });
  } else {
    res.redirect("/login");
  }
});

//Para ver todos los artículos
router.get("/", auth, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  if (req.session && req.session.admin) {
    res.render("blog/admin/index_admin", { articles: articles, usuario: req.session.info });
  } else if (req.session && req.session.user) {
    res.render("blog/usuario/index_user", { articles: articles, usuario: req.session.info });
  } else {
    res.redirect("/login");
  }
});

//Para crear un articulo
router.post("/", auth, async (req, res, next) => {
  req.article = new Article();
  next()
}, guardaryRedigirir("new-article"));

//Para editar un articulo
router.put("/:id", auth, async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.redirect("/articles");
    }
    req.article = article;
    next();
  } catch (error) {
    return res.redirect("/articles");
  }
}, guardaryRedigirir("edit-article"));

//Para borrar un articulo
router.delete("/:id", auth, async (req, res) => {
  if (req.session && req.session.admin) {
    try {
      const article = await Article.findByIdAndDelete(req.params.id);
      if (!article) {
        return res.redirect("/articles");
      }
      res.redirect("/articles");
    } catch (error) {
      return res.redirect("/articles");
    }
  } else {
    res.send("Error");
  }
});

//Función para redirigir al usuario al formulario de creación o edición de un articulo
function guardaryRedigirir(path) {
  return async (req, res) => {
    if (req.session && req.session.admin) {
      let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
      
      await article
        .save()
        .then(() => {
          res.redirect(`/articles/${article.slug}`);
        })
        .catch((err) => {
          console.error("Error saving the article:", err);
          res.render(`blog/admin/${path}`, { article: article });
        });
    } else {
      res.send("Error");
    }
  };
}

module.exports = router;