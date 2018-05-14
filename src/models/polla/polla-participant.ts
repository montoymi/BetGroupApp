import { User } from '../account/user';
import { PollaHeader } from './polla-header';
import { PollaBet } from './polla-bet';

export class PollaParticipant {
	pollaParticipantId: number;
	pollaHeaderId: number;
	pollaHeader: PollaHeader;
	userId: number;
	user: User;
	inscriptionDate: any;
	paymentStatus: number;
	total: number;
	earnings: number;
	position: number;
	status: number;
	numWildCardsLeft: number;
	numWildCards: number;
	pollaBetList: PollaBet;
}
