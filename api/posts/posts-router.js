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
            console.log(err);
            res.status(500).json({
                message: "The post information could not be retrieved"
            });
        });
});

router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body;
        if (!title || !contents ) {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        } else {
            const newId = await Post.insert({ title, contents });
            res.status(201).json({ 
                id: newId,
                title,
                contents
            })
        }
    } catch {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        })
    }
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;

    if (!changes.title || !changes.contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.update(id, changes)
            .then(post => {
                if (!post) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    res.status(200).json({...changes, id: Number(id)})
                }
            })
            .catch (err => {
                console.log(err);
                res.status(500).json({
                    message: "The post information could not be modified"
                });
            });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.remove(id);

        if (!deletedPost) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(req.params.id)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "The post could not be removed"
        })
    }
});

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const postId = await Post.findById(id);
        const test = await Post.findPostComments(id);

         if (!postId) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
         } else {
             res.status(200).json(test)
         }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
});

module.exports = router;