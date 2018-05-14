import { Sport } from '../tournament/sport';

export class TemplateHeader {
	templateHeaderId: number;
	templateName: string;
	status: number;
	sportId: number;
	sport: Sport;
	image: string;
	numWildcards: number;
	modeWildcardFlag: number;
	modePollitaFlag: number;
	modePollaFlag: number;
	startDate: any;
    endDate: any;

	checked: boolean;
}
