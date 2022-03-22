const express = require('express');
const router = express.Router();
const {Group, User_group} = require('../configs/sequelize/models');


router.post('/set', async (req, res, next) => {

    const {user_id, group_id} = req.body;
    
    const user_group = new User_group({user_id, group_id, status: 1});



    await user_group.save()
    .then(r => res.status(201).json({message: "Group Creada"}))
    .catch(e => next(e));
});


module.exports = router;