import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id_user: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string
}