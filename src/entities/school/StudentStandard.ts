import { 
    PrimaryGeneratedColumn, 
    Column, 
    Entity, 
    ManyToOne, 
    JoinColumn ,
    ObjectId,
    UpdateDateColumn,
    CreateDateColumn
  } from "typeorm";
  import { User } from "../User";

  @Entity()
  export class StudentStandard {
    @PrimaryGeneratedColumn()
    _id: ObjectId;
  
    @Column()
    standard: string;
  
    @Column()
    section: string;
  
    @Column()
    roll_number: string;
  
    @Column({ default: false })
    is_active: boolean;
  
    @Column({
      type: 'timestamp with time zone', // or 'timestamptz'
      default: () => "CURRENT_TIMESTAMP",
    })
    startSession: Date;
  
    @Column({ type: 'timestamp with time zone' })
    endSession: Date;
  
    @ManyToOne(() => User, (user) => user.studentStandard)
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
  