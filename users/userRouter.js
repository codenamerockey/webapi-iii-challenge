const express = require('express');

const router = express.Router();

const dbUsers = require('./userDb');
const dbPost = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  dbUsers
    .insert(req.body)
    .then(user => {
      console.log(user);
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: 'cant add user' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const posts = req.body;
  posts.user_id = req.params.id;
  dbPost
    .insert(posts)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: 'error while saving to the database' });
    });
});

router.get('/', (req, res) => {
  dbUsers
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'error while saving to the database' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  dbUsers
    .getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: 'error while saving to the database' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  dbUsers
    .remove(req.params.id)
    .then(() => {
      res.status(200).json(req.user);
    })
    .catch(err => {
      res.status(500).json({ message: 'error while saving to the database' });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  dbUsers
    .update(req.params.id, req.body) // so this is the update
    .then(() => {
      dbUsers.getById(req.params.id).then(user => {
        // bringing back user after update to show updated data
        res.status(200).json(user);
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'error while saving to the database' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  dbUsers
    .getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'that is not a valid user Id' });
      }
      req.user = user;
      next();
    })
    .catch(err => {
      res.status(400).json({ message: 'invalid user id' });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: 'Missing User data' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'please provide a name' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
