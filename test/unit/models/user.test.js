const User = require('../../../models/user')
const Seller = require('../../../models/seller')
const jwt = require('jsonwebtoken');
const config = require('config');
const sequelize = require('../../../util/db/db')
const utils = require('../../../util/utils')
const dbinit = require('../../../startup/db')
jest.setTimeout(30000)
const boilerplate = require('../../boilerplate')
describe('user modelling', () => {
    beforeEach(boilerplate.dbTestInit)
    it('should create a new user', async() => {
        try {
            let newUser = await User.create(
                {
                    id: 999,
                    userName: "Miho Kaneko",
                    userEmail: "miho@ggggggg.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '081255555555'
                }
            )

            await newUser.save()

            let createdUser = await User.findByPk(999)

            expect(createdUser.userName).toBe("Miho Kaneko")
            expect(createdUser.userEmail).toBe("miho@ggggggg.id")
            expect(createdUser.userHashedPassword).toEqual(expect.not.stringContaining("AIZAfefra"))
            expect(createdUser.userGender).toBe('female')
            expect(createdUser.userAddress).toBe('sultan agung')
            expect(createdUser.userPhoneNumber).toBe('081255555555')

        } catch (err) {
            console.log("user model test error: ", err)
            throw err
        }
    }) 


    it('should refuse to create a new user given phone number previously used up in previous account', async() => {
        let message = false
        try {
            let newUser = await User.create(
                {
                    id: 1024,
                    userName: "Miho Kaneko",
                    userEmail: "miho@ggggggg.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '081255555555'
                }
            )

            await newUser.save()

            let failingUser = await User.create(
                {
                    id: 1024,
                    userName: "Swift Taylor",
                    userEmail: "taylor@s.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan tajir',
                    userPhoneNumber: '081255555555'
                }
            )

            await failingUser.save()
        } catch (err) {
            message = err;
        }

        expect(message).toBeTruthy()
    }) 

    it('should refuse to create a new user given email address previously used up in previous account', async() => {
        let message = false
        try {
            let newUser = await User.create(
                {
                    id: 1024,
                    userName: "Miho Kaneko",
                    userEmail: "miho@ggggggg.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '081255555555'
                }
            )

            await newUser.save()

            let failingUser = await User.create(
                {
                    id: 1024,
                    userName: "Miho Kaneko",
                    userEmail: "miho@ggggggg.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '08562142222'
                }
            )

            await failingUser.save()
        } catch (err) {
            message = err;
        }

        expect(message).toBeTruthy()
    }) 
    it('should refuse to create a new user given no name input given', async() => {
        let message = false
        try {
            let newUser = await User.create(
                {
                    id: 1024,
                    userEmail: "miho@ggggggg.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'female',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '081255555555'
                }
            )

            await newUser.save()
        } catch (err) {
            message = err;
        }

        expect(message).toBeTruthy()
    }) 
    it('should refuse to create a new user given invalid gender value', async() => {
        let message = false
        try {
            let newUser = await User.create(
                {
                    id: 1024,
                    userName: "Miho Kaneko",
                    userEmail: "miho@ggggggg.id",
                    /**
                     * This is done because no way to use async setter function in a sequelize model.
                     * I know this is a clunky experience
                     * Just live with it until they fixed it or I found another way to hack it round.
                     */
                    userHashedPassword: await utils.hashPassword("AIZAfefra"),
                    userBirthday: Date.now(),
                    userGender: 'laptops',
                    userAddress: 'sultan agung',
                    userPhoneNumber: '081255555555'
                }
            )

            await newUser.save()
        } catch (err) {
            message = err;
        }

        expect(message).toBeTruthy()
    }) 
})