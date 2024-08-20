import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('inserted user with id ' + this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('updated user with id ' + this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('removed user with id ' + this.id);
  }
}
