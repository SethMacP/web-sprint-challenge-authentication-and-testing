const db = require('../../data/dbConfig');

const grabAll = async() => {
    const users = await db('users')
        .select("*")
    return users;
}

const grabByID = async(id)=>{
    const user = await db ('users')
        .select(
            'users.id',
            'users.username',
            'users.password'
        )
        .where("users.id", id)
        .first()
    return user;
}
const grabByUsername = async(filter)=>{
    const user = await db ('users')
        .select(
            'users.id',
            'users.username',
            'users.password'
        )
        .where("users.username", filter)
        .first()
    return user;
}

const add = async(item)=>{
    const newUser = await db('users')
        .insert(item)
    return grabByID(newUser)
}

module.exports = {
    grabAll,
    grabByID,
    grabByUsername,
    add
}