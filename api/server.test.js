const supertest  = require('supertest')
//reconfig
const server = require('../api/server')
const db = require('../data/dbConfig')

const myUser = {
	username:"firstUser",
	password:"abc123"
}

describe('Tests the auth routes against the user db',()=>{
    test('Sanity Check', ()=>{
        expect(2+2).toEqual(4)
        expect(2+3).not.toEqual(4)
    })

    test('[1]can grab all users', async()=>{
        const res = await supertest(server).get('/api/auth/users')
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body[0].username).toBe("foo")
    })

    test('[2]can register a user', async()=>{
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
    test('[2]cannot register a duplicate', async()=>{
        const res = await supertest(server)
            .post('/api/auth/register')
            .send({
                username: "theBoss",
                password:'sekret99'
            })
        expect(res.statusCode).toBe(418)
        expect(res.type).toBe('application/json')
        expect(res.body.message).toBe("username taken")
    })

    test('[3]users receive token on login', async()=>{
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

    test('[3]wrong credentials are denied',async()=>{
        const res = await supertest(server)
            .post('/api/auth/login')
            .send({
                username:"theBossyBoss",
                password:'peopleCrusher'
            })
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("invalid credentials")
    })

})

describe('joke testing' , () => {
    test('is seth funny?', ()=>{
        const seth = true;
        const funny = true;
        expect(seth).toBe(funny)
    })
    test('[4]grab the rest of the jokes', async ()=>{
        //from this object, point to the body and grab the token
        const {body:{token}} = await supertest(server)
            .post('/api/auth/login')
            .send({
                username: "theBoss",
                password:'sekret99'
            })
        //try grabbing jokes using the token            
        const res = await supertest(server)
            .get('/api/jokes')
            .set('authorization', token)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body[0].id).toBe("0189hNRf2g")
    })
    test('[4]jokes denied on bad login', async ()=>{
        //try grabbing jokes using the token            
        const res = await supertest(server)
            .get('/api/jokes')
            .set('authorization', "f4k3_t0k3n")
        expect(res.statusCode).toBe(401)
        expect(res.type).toBe('application/json')
        expect(res.body.message).toBe('token invalid')
    })
})