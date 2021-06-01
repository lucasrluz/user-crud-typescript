import { validate } from "class-validator";
import { User } from "../entity/User";

export function validator(user: User) {

    const { name, email, password } = user

    const validateUser = new User(name, email, password)

    return validate(validateUser)
}
