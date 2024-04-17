const { Router } = require('express');

const user = Router();
const {
    createUser,
    postLogin,
    getData,
    deleteUser,
    updateUser,
    searchUser
} = require('../controls/Users');

user.get('/searchUser', searchUser);
user.get('/getUsers', getData);
user.post('/postLogin', postLogin);
user.post('/createUser', createUser);
user.delete('/deleteUser', deleteUser);
user.put('/updateUser', updateUser);
module.exports = user;


