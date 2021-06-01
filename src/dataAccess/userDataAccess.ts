import { connection } from "../connection/connection";
import { User } from "../entity/User";

export class UserDataAccess {

    async viewUser(id_user: string) {
        try {

            const result = await (await connection)
                .createQueryBuilder()
                .select('user')
                .from(User, 'user')
                .where('id_user = :id_user', {id_user: id_user})
                .getOne()
        
            return result

        } catch (error) {
            
            return error
        }     
    }

    async saveUser(user: User) {
        try {
            const { name, email, password } = user

            const result = await (await connection)
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([{ name: name, email: email, password: password }])
                .execute()
    
            return result 

        } catch (error) {
            
            return error
        }   
    }

    async editUser(id_user: string, user: User) {
        try {

            const { name, email, password } = user

            const result = await (await connection)
                .createQueryBuilder()
                .update(User)
                .set({name: name, email: email, password: password})
                .where('id_user = :id_user', {id_user: id_user})
                .execute()
            
            return result

        } catch (error) {

            return error
        }
    }

    async deleteUser(id_user: string) {
        try {

            const result = await (await connection)
                .createQueryBuilder()
                .delete()
                .from(User)
                .where('id_user = :id_user', {id_user: id_user})
                .execute()
            
            return result

        } catch (error) {
            
            return error
        }
    }
}