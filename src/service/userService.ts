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
}