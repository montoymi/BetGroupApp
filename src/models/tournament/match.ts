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
	enabled_flag: string;
	lastUpdatedDate: any;
	lastUpdatedBy: any;
	match_code: string;
	image: string;
	matchDateWithTimezone: any;
}
