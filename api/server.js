// implement your server here
// require your posts router and connect it here
const express = require('express');

const server = express();

const postMod = require('./posts/posts-model');

const postRouter = require('./posts/posts-router');

server.get('/api/posts', (req, res) => {
    postMod.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({messsage: 'An error happenned'});
        });
});

server.get('api/posts/:id', (req, res) => {
    postMod.findById(req.params.id)
    .then()
    .catch()
})




module.exports = server;