import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Escrow, EscrowSchema } from './schemas/escrow.schema';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Wallet.name, schema: WalletSchema },
            { name: Transaction.name, schema: TransactionSchema },
            { name: Escrow.name, schema: EscrowSchema },
        ]),
    ],
    providers: [WalletService],
    controllers: [WalletController],
    exports: [WalletService],
})
export class WalletModule { }
