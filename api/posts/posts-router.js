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
            if (!result) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(result)
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
});

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await postMod.findById(req.params.id)
        if(!post) {
     res.status(404).json({message: "The post with the specified ID does not exist"})
 } else {
     const messages = await postMod.findPostComments(req.params.id)
     res.json(messages)
 }
    } catch (error) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }


    
    // try {
    //     const comments = await postMod.findPostComments(req.params.id)
    //     const { id } = await postMod.findCommentById(req.params.id)
    //         // if (!comments) return res.status(404).json({ message: "The post with the specified ID does not exist" })

    //         res.status(200).json({id, comments})
    // } catch (error) {
    //     res.status(500).json({ message: "The comments information could not be retrieved" })
    // }
        //postMod.findPostComments(req.params.id)
        // postMod.findCommentById(req.params.id)

//*********************************** */
        
        // .then(comment => {
        //     if (!comment) {
        //         postMod.findCommentById(comment)
        //         res.status(404).json({ message: "The post with the specified ID does not exist" })

        //     } else {
        //         // postMod.findCommentById(comment)
        //         res.status(200).json(comment)
        //     }
        // })
        // .catch(() => {
        //     res.status(500).json({ message: "The comments information could not be retrieved" })
        // })
});


router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        postMod.insert({ title, contents })
            .then(({ id }) => {
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

router.delete('/:id', async (req, res) => {

    try {
        const killSwitch = await postMod.findById(req.params.id)
        if(!killSwitch) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            await postMod.remove(req.params.id)
            res.json(killSwitch)
        }
    } catch (error) {
        res.status(500).json({ message: "The post could not be removed" })
    }

     
    // postMod.findById(req.params.id)
    //     .then((killSwitch) => {
    //       if (!killSwitch) {
    //             res.status(
                
    //         } else {
                
                
    //             res.json(killSwitch)

    //         }
    //     })
    //     .then(postMod.remove(req.params.id))
    //     // .then(() => {
    //     //     res.status(200).json(post)
    //     // })
        // .catch(() => {
        //     res.status(500).json({ message: "The post could not be removed" })
        // })

});

router.put('/:id', async (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) return res.status(400).json({ message: "Please provide title and contents for the post" })
    try {
        const updatedUserResult = await postMod.update(req.params.id, { title, contents })
        if (!updatedUserResult) return res.status(404).json({ message: "The post with the specified ID does not exist" })

        const { id, title: t, contents: c } = await postMod.findById(req.params.id)

        res.status(200).json({ id, title: t, contents: c })
    } catch (error) {
        res.status(500).json({ message: "The post information could not be modified" })
    }

});


    //     postMod.update(req.params.id, { title, contents })
    //     .then(
    //         result => {
    //             if(!result){
    //                 res.status(404).json({message: "The post with the specified ID does not exist"})
    //             } else {
    //                 // res.status(200).json({id: +req.params.id, title, contents })

    //             }
    //             // return result;
    //         }

    //     )

    // .catch(() => {
    //     res.status(500).json({message: "The post information could not be modified"})
    // })




module.exports = router;