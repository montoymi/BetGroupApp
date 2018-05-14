import { Match } from './match';
import { Phase } from './phase';

export class Group {
	phaseId: number;
	phase: Phase;
	groupId: number;
	groupName: string;
	groupCode: string;
	groupOrder: number;
	status: number;
	matchList: Match;
	enabled_flag: string;
}
