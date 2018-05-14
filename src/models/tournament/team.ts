import { Sport } from './sport';

export class Team {
	teamId: number;
	teamName: string;
	sportId: number;
	sport: Sport;
	image: string;
	enabled_flag: string;
}
