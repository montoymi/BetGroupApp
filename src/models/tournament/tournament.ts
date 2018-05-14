import { Sport } from './sport';
import { Phase } from './phase';

export class Tournament {
	sportId: number;
	sport: Sport;
	tournamentId: number;
	tournamentName: string;
	enabled_flag: string;
	startDate: any;
	phaseList: Phase[];
}
