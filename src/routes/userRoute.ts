import express from 'express'
import { auth } from '../middlewares/auth'
import { UserService } from '../service/userService'

export const userRoute = express.Router()

const userService = new UserService()

userRoute.post('/session', userService.login)

userRoute.post('/user', userService.saveUser)

userRoute.use(auth)

userRoute.get('/user/:id_user', userService.viewUser)

userRoute.put('/user/:id_user', userService.editUser)

userRoute.delete('/user/:id_user', userService.deleteUser)