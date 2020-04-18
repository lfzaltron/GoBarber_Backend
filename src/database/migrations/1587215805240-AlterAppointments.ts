import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterAppointments1587215805240
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('appointments', [
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('appointments', [
            new TableColumn({ name: 'created_at', type: 'timestamp' }),
            new TableColumn({ name: 'updated_at', type: 'timestamp' }),
        ]);
    }
}
