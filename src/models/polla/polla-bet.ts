import { PollaMatch } from './polla-match';
import { PollaParticipant } from './polla-participant';

export class PollaBet {
	idBet: number;
	pollaMatchId: number;
	pollaMatch: PollaMatch;
	pollaParticipantId: number;
	pollaParticipant: PollaParticipant;
	localBetScore: number;
	visitorBetScore: number;
	updatedDate: any;
	points: number;
	status: number;
	resultBet: string;
	flagWildcard: any;
}
