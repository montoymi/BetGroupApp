import { Group } from './group';
import { Tournament } from './tournament';

export class Phase {
	tournamentId: number;
	tournament: Tournament;
	phaseId: number;
	phaseName: string;
	phaseNumber: number;
	enabled_flag: string;
	groupList: Group[];
}
