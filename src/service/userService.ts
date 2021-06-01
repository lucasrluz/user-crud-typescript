import { connection } from "../connection/connection";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { validator } from "../classValidator/userValidator";
import { NextFunction, Request, Response } from "express";
import { UserDataAccess } from "../dataAccess/userDataAccess";

const userDataAccess = new UserDataAccess()
export class UserService {

    async login(request: Request, response: Response, next: NextFunction) {

        const { email, password } = request.body

        const result = await (await connection)
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('email = :email', {email: email})
            .getOne()
        
        if (result == null) {

            return response.status(404).json({message: 'Este usuário não existe!'})

        } else {

            if (await bcrypt.compare(password, result.password)) {

                const token = jwt.sign({id_user: result.id_user}, process.env.APP_SECRET, {expiresIn: '1d'})

                const data = {
                    id: result.id_user,
                    name: result.name,
                    email: result.email,
                    token
                }

                return response.status(200).json(data)

            } else {

                return response.status(404).json({message: 'Este usuário não existe!'})
            }
        }
    }

    async viewUser(request: Request, response: Response, next: NextFunction) {
        try {

            const id_user = request.params.id_user

            const result = await userDataAccess.viewUser(id_user)
            
            if (result == null) return response.status(404).json({message: "Este usuário não existe!"})

            return response.status(201).json(result)

        } catch (error) {
            
            return response.status(500).json(error)
        }   
    }

    async saveUser(request: Request, response: Response, next: NextFunction) {
        try {

            const user: User = request.body

            const errors = await validator(user)

            if (errors.length > 0) return response.status(500).json(errors)

            const passwordHash = await bcrypt.hash(user.password, 8) 

            user.password = passwordHash

            const result = await userDataAccess.saveUser(user)
            
            if (result.code == 'ER_DUP_ENTRY') return response.status(500).json({error: 'Este e-mail já está cadastrado!'}) 

            return response.status(201).json(result.identifiers)
            
        } catch (error) {
            
            return response.status(500).json(error)
        }
    }

    async editUser(request: Request, response: Response, next: NextFunction) {
        try {

            const user: User = request.body

            const id_user = request.params.id_user

            const errors = await validator(user)

            if (errors.length > 0) return response.status(500).json(errors)

            const passwordHash = await bcrypt.hash(user.password, 8)

            user.password = passwordHash
        
            const result = await userDataAccess.editUser(id_user, user)

            if (result.code == 'ER_DUP_ENTRY') return response.status(500).json({error: 'Este e-mail já está cadastrado!'}) 

            return response.status(204).json(result)

        } catch (error) {
            
            return response.status(500).json(error)
        }
    }

    async deleteUser(request: Request, response: Response, next: NextFunction) {
        try {

            const id_user = request.params.id_user

            const validation = await userDataAccess.viewUser(id_user)

            if (validation == null) return response.status(404).json({message: "Este usuário não existe!"})

            const result = await userDataAccess.deleteUser(id_user)
            
            return response.status(204).json(result) 

        } catch (error) {
            
            return response.status(500).json(error)
        }     
    }
}