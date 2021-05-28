import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id_user: number

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column()
    password: string
}