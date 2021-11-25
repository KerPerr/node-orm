import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, OneToMany } from "typeorm";
import { IsEmail, IsIn, Length } from "class-validator";
import bcrypt from 'bcrypt'
import { Animals } from "./Animals";

@Entity()
@Unique(['email'])
export class Users extends BaseEntity {

    constructor(body: any) {
        super()
        this.email = body?.email
        this.pseudo = body?.pseudo
        this.role = body?.role
        this.animals = body?.animals
        
        this.hashPassword(body?.password)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @Length(4, 20)
    pseudo: string

    @Column({select: false})
    password: string

    @Column({default: "USER"})
    @IsIn(['ADMIN', 'VETO', 'USER'])
    role: string

    @OneToMany(() => Animals, animal => animal.owner)
    animals: Animals[]

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    hashPassword(password: string) {
        if(password) this.password = bcrypt.hashSync(password, 8)
    }

    checkPassword(password: string) {
        return bcrypt.compareSync(password, this.password)
    }
}