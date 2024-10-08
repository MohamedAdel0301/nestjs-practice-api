import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
  OneToMany,
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

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
