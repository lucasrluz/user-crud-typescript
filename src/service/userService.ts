import { connection } from "../connection/connection";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
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

        const result = await (await connection)
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('id_user = :id_user', {id_user: request.params.id_user})
            .getOne()
    
        if (result == null) return response.status(404).json({message: "Este usuário não existe!"})

        return response.status(201).json(result)
    }

    async saveUser(request: Request, response: Response, next: NextFunction) {

        try {

            const user = request.body

            const passwordHash = await bcrypt.hash(user.password, 8)

            const result = await (await connection)
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([{ name: user.name, email: user.email, password: passwordHash }])
                .execute()
        
            return response.status(201).json(result.identifiers)

        } catch (error) {
            
            if (error.code == 'ER_DUP_ENTRY') return response.status(500).json({error: 'Este e-mail já está cadastrado!'}) 

            return response.status(500).json(error)
        }
    }

    async editUser(request: Request, response: Response, next: NextFunction) {

        try {

            const user = request.body
            const id_user = request.params.id_user

            const passwordHash = await bcrypt.hash(user.password, 8)

            const result = await (await connection)
                .createQueryBuilder()
                .update(User)
                .set({name: user.name, email: user.email, password: passwordHash})
                .where('id_user = :id_user', {id_user: id_user})
                .execute()
        
            return response.status(204).json(result)

        } catch (error) {
            
            if (error.code == 'ER_DUP_ENTRY') return response.status(500).json({error: 'Este e-mail já está cadastrado!'}) 

            return response.status(500).json(error)
        }
    }

    async deleteUser(request: Request, response: Response, next: NextFunction) {

        const id_user = request.params.id_user

        const result = await (await connection)
            .createQueryBuilder()
            .delete()
            .from(User)
            .where('id_user = :id_user', {id_user: id_user})
            .execute()

        return response.status(204).json(result)
    }
}