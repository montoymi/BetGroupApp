import { Match } from '../tournament/match';
import { PollaHeader } from './polla-header';
import { PollaBet } from './polla-bet';
import { PollaEvent } from './polla-event';

export class PollaMatch {
	pollaMatchId: number;
	pollaHeaderId: number;
	pollaHeader: PollaHeader;
	matchId: number;
	match: Match;
	pollaBetList: PollaBet[];
	pollaEventId: number;
	pollaEvent: PollaEvent;
	lastUpdatedBy: number;
	lastUpdatedDate: any;
}
