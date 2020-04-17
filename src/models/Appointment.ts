import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column() // string is default
    provider: string;

    @Column('timestamp with time zone')
    date: Date;
}

export default Appointment;
