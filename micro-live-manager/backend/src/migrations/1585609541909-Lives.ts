import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Lives1585609541909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'lives',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'date',
                    type: 'timestamp',
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'slug',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('lives')
    }

}
