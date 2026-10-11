ALTER TABLE "Order"
ADD COLUMN "idempotencyKey" VARCHAR(100),
ADD COLUMN "requestHash" VARCHAR(64);

CREATE UNIQUE INDEX "Order_userId_idempotencyKey_key"
ON "Order"("userId", "idempotencyKey");
