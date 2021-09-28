// implement your posts router here
const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The posts information could not be retrieved"
            });
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Post.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be retrieved"
            });
        });
});

router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body;
        if (!title || !contents) {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        } else {
            const newPost = await Post.insert({ title, contents })
            res.status(201).json(newPost);
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedPost = await Post.update(id, { title, content })
        if (!id) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            if (!title || !content) {
                res.status(400).json({
                    message: "Please provide title and contents for the post"
                })
            } else {
                res.status(200).json(updatedPost)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be modified"
            })
        }
        // .then(post => {
        //     if (!id) {
        //         res.status(404).json({
        //             message: "The post with the specified ID does not exist"
        //         })
        //     } else {
        //         if (!title || !contents) {
        //             res.status(400).json({
        //                 message: "Please provide title and contents for the post"
        //             })
        //         } else {
        //             res.status(200).json(post)
        //         }
        //     }
        // })
        // .catch(err => {
        //     res.status(500).json({
        //         message: "The post information could not be modified"
        //     });
        // });
});

router.delete('/:id', async (req, res) => {
    // const { id } = req.params;

    // Post.remove(id)
    // .then(count => {
    //   if (count > 0) {
    //     res.status(200).json({ message: "The post with the specified ID does not exist" });
    //   } else {
    //     res.status(404).json({ message: "The post with the specified ID does not exist" });
    //   }
    // })
    // .catch(error => {
    //   console.log(error);
    //   res.status(500).json({
    //     message: "The post could not be removed"
    //   });
    // });
    try {
        const deletedPost = await Post.remove(req.params.id);
        if (!deletedPost) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(req.params.id)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed"
        })
    }
});

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;

    try {
        const commentById = await Post.findCommentById(id);
        if (id) {
            res.status(200).json(commentById);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
});

module.exports = router;