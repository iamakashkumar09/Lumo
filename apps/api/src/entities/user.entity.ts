import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
@Entity('users') // Best practice: use plural names for database tables
export class User {
    @PrimaryGeneratedColumn('uuid') // Tell TypeORM to generate UUIDs automatically
    id: string; // Use 'string' as the TypeScript type for UUIDs

    // @Column()
    // name: string;

    @Column({ unique: true }) // Usernames should usually be unique
    username: string;

    @Column({ unique: true }) // Emails should definitely be unique
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword(){
        this.password=await bcrypt.hash(this.password,10);
    }
}