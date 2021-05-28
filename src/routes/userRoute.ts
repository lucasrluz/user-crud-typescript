import express from 'express'
import { connection } from '../connection/connection'
import { User } from '../entity/User'
import { UserService } from '../service/userService'

export const userRoute = express.Router()

const userService = new UserService()

userRoute.get('/user/:id_user', async (req, res) => {
    
    res.json(await userService.viewUser(req.params.id_user))
})