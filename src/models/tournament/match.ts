import { Group } from './group';
import { Team } from './team';

export class Match {
	groupId: number;
	group: Group;
	localId: number;
	localTeam: Team;
	visitorId: number;
	visitorTeam: Team;
	matchId: number;
	matchCode: string;
	matchDate: any;
	matchPlace: string;
	resultMatch: string;
	scoreLocal: number;
	scoreVisitor: number;
	enabled_flag: string; // 0 = el partido empezó, 1 = el partido no ha empezado.
	lastUpdatedDate: any;
	lastUpdatedBy: any;
	match_code: string;
	image: string;
	matchDateWithTimezone: any;
}
