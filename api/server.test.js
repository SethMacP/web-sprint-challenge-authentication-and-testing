const supertest  = require('supertest')
//reconfig
const server = require('../api/server')
const db = require('../data/dbConfig')

describe('Tests the auth routes against the user db',()=>{
    test('Sanity Check', ()=>{
        expect(2+2).toEqual(4)
        expect(2+3).not.toEqual(4)
    })

    test('can grab all users', async()=>{
        const res = await supertest(server).get('/api/auth/users')
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body[0].username).toBe("foo")
    })

    test('can register a user', async()=>{
        const res = await supertest(server)
            .post('/api/auth/register')
            .send({
                username: "theBoss",
                password:'sekret99'
            })
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe('application/json')
        expect(res.body.username).toBe("theBoss")
    })

    test('users receive token on login', async()=>{
        const res = await supertest(server)
            .post('/api/auth/login')
            .send({
                username:"theBoss",
                password:'sekret99'
            })
        // console.log("SUPER IMPORTANT1", res.body)
        // console.log("SUPER IMPORTANT2", res.headers)

        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.token).toBeDefined()
    })


})