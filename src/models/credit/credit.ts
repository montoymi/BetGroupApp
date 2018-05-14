import { User } from '../account/user';
import { CreditDetail } from './credit-detail';

export class Credit {
	userId: number;
	user: User;
	totalCreditos: number;
	creditDetailList: CreditDetail[];
}
