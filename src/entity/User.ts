import { IsEmail, IsNotEmpty } from 'class-validator'
import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class User {

    constructor(name: string, email: string, password: string) {
        this.name = name,
        this.email = email,
        this.password = password
    }

    @PrimaryGeneratedColumn()
    id_user: number

    @Column()
    @IsNotEmpty()
    name: string

    @Column({unique: true})
    @IsEmail()
    email: string

    @Column()
    @IsNotEmpty()
    password: string
}