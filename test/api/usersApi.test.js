
var app = require('../../server');
const client = require('supertest')(app);
var server = null;
describe('users api test', () => {
    beforeEach((done) => {

        // server = require('../../server');
        require('../../startup/db')(function () {
            server = app.listen(3000, () => {
                done()
            })
        })
        // console.log(server)
    })
    
    afterEach(() => {
        server.close();
    })
    
    // describe('GET /', () => {
    it('should parse jwt correctly', async () => {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlclBob25lTnVtYmVyIjoiKzYyNzc3Nzc3Nzc3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE1NTQ2MzQ0Mjl9.kXvea7oPo3bOFP_qRTYzi8uZhOm_0wiN3NAqirbrshM"
        let result = await client
            .get('/api/v1/users/authenticationStatus')
            .set({ 'X-Auth-Token': token })
        
        console.log("result body: ", result.body)
        expect(result.status).toBe(200)
    })


    it('should make new user', async (done) => {
        let userDetails = {
            userName: "Miho Kaneko",
            userEmail: "miho@jjj7j.id",
            /**
             * This is done because no way to use async setter function in a sequelize model.
             * I know this is a clunky experience
             * Just live with it until they fixed it or I found another way to hack it round.
             */
            userPassword: "AIZAfefra",
            userBirthday: Date.now(),
            userGender: 'female',
            userAddress: 'sultan agung',
            userPhoneNumber: '085612345678'
        }
        client
            .post('/api/v1/users/create')
            .send(userDetails)
            .end((err, res) => {
                console.log("result body: ", res.body)
                expect(res.status).toBe(200)       
                done() 
            })    
        
    })

    it('should refuse to make new user on invalid input', async (done) => {
        let userDetails = {
            userName: "Miho Kaneko",
            userEmail: "miho@jjj7j.id",
            /**
             * This is done because no way to use async setter function in a sequelize model.
             * I know this is a clunky experience
             * Just live with it until they fixed it or I found another way to hack it round.
             */
            //4 char password
            userPassword: "AIZA",
            userBirthday: Date.now(),
            userGender: 'hahahihi',
            userAddress: 'sultan agung',
            userPhoneNumber: '085612345678'
        }
        client
            .post('/api/v1/users/create')
            .send(userDetails)
            .end((err, res) => {
                console.log("result body: ", res.body)
                expect(res.status).toBe(400)       
                done() 
            })    
        
    })


    it('should refuse to make new user given same email or phone number', async (done) => {
        let userDetails = {
            userName: "Miho Kaneko",
            userEmail: "miho@jjj7j.id",
            /**
             * This is done because no way to use async setter function in a sequelize model.
             * I know this is a clunky experience
             * Just live with it until they fixed it or I found another way to hack it round.
             */
            userPassword: "AIZAfefra",
            userBirthday: Date.now(),
            userGender: 'female',
            userAddress: 'sultan agung',
            userPhoneNumber: '085612345678'
        }
        client
            .post('/api/v1/users/create')
            .send(userDetails)
            .end((err, res) => {
                console.log("result body: ", res.body)
                expect(res.status).toBe(200)       
         
         
                let dupUserEmail = {
                    userName: "Miho Kaneko",
                    userEmail: "miho@jjj7j.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userPassword: "AIZAfefra",
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '085612345123'
                }

                client
                    .post('/api/v1/users/create')
                    .send(dupUserEmail)
                    .end((err, res) => {
                        expect(res.status).toBe(400)
                        expect(JSON.stringify(res.body)).toMatch(/exists/)
                    
                        let dupUserPhone = {
                            userName: "Miho Kaneko",
                            userEmail: "miho@fakeemail.id",
                            /**
                             * This is done because no way to use async setter function in a sequelize model.
                             * I know this is a clunky experience
                             * Just live with it until they fixed it or I found another way to hack it round.
                             */
                            userPassword: "AIZAfefra",
                            userBirthday: Date.now(),
                            userGender: 'female',
                            userAddress: 'sultan agung',
                            userPhoneNumber: '085612345678'
                        }

                        client
                            .post('/api/v1/users/create')
                            .send(dupUserPhone)
                            .end((err, res) => {
                                expect(res.status).toBe(400)
                                expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/exists/))
                                
                                let uniqueUser = {
                                    userName: "Miho Kaneko",
                                    userEmail: "miho@gmail.id",
                                    /**
                                     * This is done because no way to use async setter function in a sequelize model.
                                     * I know this is a clunky experience
                                     * Just live with it until they fixed it or I found another way to hack it round.
                                     */
                                    userPassword: "AIZAfefra",
                                    userBirthday: Date.now(),
                                    userGender: 'female',
                                    userAddress: 'sultan agung',
                                    userPhoneNumber: '08569876543'
                                }

                                client
                                    .post('/api/v1/users/create')
                                    .send(uniqueUser)
                                    .end((err, res) => {
                                        expect(res.status).toBe(200) 
                                        done()  
                                    })
                            })
                    })
            })    
    })

    it('should authenticate', async (done) => {
        let userDetails = {
            userName: "Miho Kaneko",
            userEmail: "miho@jjjj.id",
            /**
             * This is done because no way to use async setter function in a sequelize model.
             * I know this is a clunky experience
             * Just live with it until they fixed it or I found another way to hack it round.
             */
            userPassword: "AIZAfefra",
            userBirthday: Date.now(),
            userGender: 'female',
            userAddress: 'sultan agung',
            userPhoneNumber: '0856123456'
        }
        client
            .post('/api/v1/users/create')
            .send(userDetails)
            .end((err, res) => {
                console.log("result body: ", res.body)     
                client
                    .post('/api/v1/users/authenticate')
                    .send({
                        phoneNumber: "0856123456",
                        password: "AIZAfefra"
                    })
                    .end((err, res) => {
                        console.log("result body: ", res.body)
                        expect(res.status).toBe(200)       
                        done() 
                    }) 
            })   
    // })
    })

})