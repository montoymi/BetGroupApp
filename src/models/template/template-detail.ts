import { Match } from '../tournament/match';

export class TemplateDetail {
	templateDetailId: number;
	templateHeaderId: number;
	matchId: number;
	match: Match;

	checked: boolean;
}
