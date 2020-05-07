import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class ChatMessages1587506377894 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'chat_messages',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'user_name',
                    type: 'text',
                },
                {
                    name: 'email',
                    type: 'text',
                },
                {
                    name: 'live_slug',
                    type: 'varchar',
                },
                {
                    name: 'is_broadcaster',
                    type: 'bool',
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
        await queryRunner.dropTable('chat_messages')
    }

}
