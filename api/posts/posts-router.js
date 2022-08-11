// implement your posts router here
const express = require('express');
const postMod = require('./posts-model');

const router = express.Router();

router.get('/', (req, res) => {
    postMod.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "The posts information could not be retrieved" });
        });
});

router.get('/:id', (req, res) => {
    
    postMod.findById(req.params.id)
    .then(result => {
        if(!result){
            res.status(404).json({message: "The post with the specified ID does not exist"})
        } else {
            res.status(200).json(result)
        }
    })
    .catch(() => {
        res.status(500).json({message: "The post information could not be retrieved"})
    })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
        if (!title || !contents) {
            res.status(400).json({message: "Please provide title and contents for the post"});
        } else{
            postMod.insert({title, contents})
            .then(({id}) => {
                return postMod.findById(id)
            })
            .then(newPost => {
                res.status(201).json(newPost)
            })
            .catch((err) => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err
                })
            })
         
        }
    
})

router.delete('/:id', (req, res) => {
    const killSwitch = req.params.id
    postMod.remove(killSwitch)
    .then(index => {
        if(index > 0){
            res.status(200).json(index,  {message: "kill switch activated"})
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist"})
        }
    })
    .catch(() => {
        res.status(500).json({message: "The post could not be removed"})
    })
});


module.exports = router;