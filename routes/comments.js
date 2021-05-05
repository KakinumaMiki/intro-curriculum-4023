'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Comment = require('../models/comment');

router.post('/:scheduleId/users/:userId/comments', authenticationEnsurer, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const comment = req.body.comment;

  Comment.upsert({
    scheduleId: scheduleId,
    userId: userId,
    comment: comment.slice(0, 255)
  }).then(() => {
    res.json({ status: 'OK', comment: comment });
  });
});

module.exports = router;

router.get('/:scheduleId/users/:userId/comments', authenticationEnsurer, (req, res, next) => {
  Comment.findOne({
    where: {
      scheduleId: req.params.scheduleId,
      userId: req.params.userId
    }
  }).then((comments) => {
    comments.destroy().then(() => {
      res.redirect('/');
    });
  });
});