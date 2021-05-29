import { connection } from "../connection/connection";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
export class UserService {

    async login(user: User) {

        const result = await (await connection)
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('email = :email', {email: user.email})
            .getOne()
        
        if (result == null) {

            return {error: 'Este usuário não existe!'}
        } else {

            if (await bcrypt.compare(user.password, result.password)) {

                const token = jwt.sign({id_user: result.id_user}, process.env.APP_SECRET, {expiresIn: '1d'})

                const data = {
                    id: result.id_user,
                    name: result.name,
                    email: result.email,
                    token
                }

                return data
                
            } else {

                return {error: 'Este usuário não existe!'}
            }
        }
    }

    async viewUser(id_user: string) {

        const result = await (await connection)
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('id_user = :id_user', {id_user: id_user})
            .getOne()
    
        if (result == null) return {error: 'Este usuário não existe!'}

        return result
        
    }

    async saveUser(user: User) {

        try {

            const result = await (await connection)
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([{ name: user.name, email: user.email, password: user.password }])
                .execute()
        
            return result

        } catch (error) {
            
            if (error.code == 'ER_DUP_ENTRY') return {error: 'Este e-mail já está cadastrado!'}

            return error
        }
    }

    async editUser(id_user: string, user: User) {

        try {

            const result = await (await connection)
                .createQueryBuilder()
                .update(User)
                .set({name: user.name, email: user.email, password: user.password})
                .where('id_user = :id_user', {id_user: id_user})
                .execute()
        
            return result

        } catch (error) {
            
            if (error.code == 'ER_DUP_ENTRY') return {error: 'Este e-mail já está cadastrado!'}

            return error
        }
    }

    async deleteUser(id_user: string) {

        const result = await (await connection)
            .createQueryBuilder()
            .delete()
            .from(User)
            .where('id_user = :id_user', {id_user: id_user})
            .execute()

        return result
    }
}