import { CreditTransactionType } from './credit-transaction-type';
import { User } from '../account/user';
import { Credit } from './credit';

export class CreditDetail {
	creditDetailId: number;
	transactionTypeId: number;
	creditTransationType: CreditTransactionType;
	transactionDate: any;
	creditAmount: number;
	status: number;
	comments: string;
	userId: number;
	createdBy: number;
	creationDate: any;
	lastUpdatedBy: number;
	lastUpdatedDate: any;
	user: User;
	credit: Credit;

	statusDescription: string;
	
	getDollars(): number {
		return this.creditAmount / 10;
	}
}

