-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "mpesaReceipt" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid';
