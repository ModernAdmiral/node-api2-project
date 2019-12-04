const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  console.log(req.query);
  Posts.find(req.query)
    .then(posts => {
      res.status(200).json(posts); //return the response with a 200 status and the JSONified posts
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts"
      });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the specific post" });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the comments" });
    });
});

router.post("/", (req, res) => {
  Posts.insert(req.body)
    .then(post => {
      res.status(201).json({ message: "the post was added", post });
    })
    .catch(err => {
      console.log("error on POST /posts", err);
      res.status(500).json({ errorMessage: "error adding the post" });
    });
});

router.post("/:id/comments", (req, res) => {
  Posts.insertComment(req.body)
    .then(post => {
      if (post) {
        res.status(201).json({ message: "The commment was posted", post });
      } else {
        res.status(404).json({ message: "the post could not be found" });
      }
    })
    .catch(err => {
      console.log("error on POST /posts", err);
      res.status(500).json({ errorMessage: "error adding the post" });
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(post => {
      if (post > 0) {
        res.status(200).json({ message: "The post has been deleted" });
      } else {
        res.status(404).json({ message: "The post cannot be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error deleting post" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const postData = req.body;
  Posts.update(id, postData)
    .then(post => {
      if (post) {
        res.status(200).json({ message: "The post has been updated" });
      } else {
        res.status(404).json({ errorMessage: "The post could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error deleting post" });
    });
});

module.exports = router;
