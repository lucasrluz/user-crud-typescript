import { connection } from "../connection/connection";
import { User } from "../entity/User";

export class UserService {

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
}