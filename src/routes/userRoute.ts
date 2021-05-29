import express from 'express'
import { connection } from '../connection/connection'
import { User } from '../entity/User'
import { auth } from '../middlewares/auth'
import { UserService } from '../service/userService'

export const userRoute = express.Router()

const userService = new UserService()

userRoute.post('/session', async (req, res) => {

    res.json(await userService.login(req.body))
})

userRoute.post('/user', async(req, res) => {

    res.json(await userService.saveUser(req.body))
})

userRoute.use(auth)

userRoute.get('/user/:id_user', async (req, res) => {
    
    res.json(await userService.viewUser(req.params.id_user))
})

userRoute.put('/user/:id_user', async (req, res) => {

    res.json(await userService.editUser(req.params.id_user, req.body))
})

userRoute.delete('/user/:id_user', async (req, res) => {

    res.json(await userService.deleteUser(req.params.id_user))
})