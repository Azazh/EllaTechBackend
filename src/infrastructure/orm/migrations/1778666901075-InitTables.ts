import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1778666901075 implements MigrationInterface {
    name = 'InitTables1778666901075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "productId" uuid NOT NULL, "oldStock" integer, "newStock" integer, "oldPrice" numeric(10,2), "newPrice" numeric(10,2), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_transactions_change_values" CHECK (("oldStock" IS NOT NULL AND "newStock" IS NOT NULL) OR ("oldPrice" IS NOT NULL AND "newPrice" IS NOT NULL)), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_product_created_at" ON "transactions" ("productId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_created_at" ON "transactions" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_product_id" ON "transactions" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_user_id" ON "transactions" ("userId") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_5642b5bed5c9404a1424df580f1" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_5642b5bed5c9404a1424df580f1"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_product_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_product_created_at"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
