const router = require('express').Router();
const verify = require('../verification/verify');

const Articles = require('../db_setup/schema');


router.get('/', (req, res) => {
  Articles.find({}, (err, articles) => {
    if (err) console.log(err);
    else return res.json(articles);
  });
});

router.get('/posts/:id', (req, res) => {
  Articles.findById(req.params.id, (err, article) => {
    if (err) console.log(err);
    else {
      return res.json(article);
    }
  });
});

router.delete('/posts/:id', (req, res) => {
  const query = { _id: req.params.id };
  Articles.findOne(query, (err, article) => {
    if (!err) {
      if (article != null) {
        article.delete()
        .then(response => res.redirect('/'))
        .catch((err) => {
          console.log(err);
        });
      }
    } else {
      console.log(err);
    }
  });
});

router.patch('/edit/:id', verify, (req, res) => {
  Articles.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name, body: req.body.body } },
    (err, article) => {
      if (!err) {
        return res.redirect('/');
      }
      else console.log(err);
    },
  );
});

router.post('/posts', verify, (req, res) => {
  const post = new Articles({
    name: req.body.name,
    body: req.body.body,
    author: req.user.user
  });
  post.save().then(response => res.redirect('/')).catch((err) => {
    console.error(err);
  });
});
module.exports = router;
