import { User } from "../account/user";
import { TemplateHeader } from "../template/template-header";

export class PollaHeader {
	pollaId: number;
	betgroupCode: string;
	pollaName: string;
	templateHeaderId: number;
	adminId: number;
	pollaCost: number;
	enabled_flag: number;
	accessFlag: any; // 0: publico ; 1: privado
	password: string;
	costFlag: any;
	admin: User;
	image: string;
	numWildcards: number;
	modeWildcardFlag: any;  
    modePollitaFlag: any;
	modePollaFlag: any;
	rules: string;
	startDate: any;
    endDate: any;
    total_bet: number; // Pozo acumulado
    numParticipants: number;
    numEvents: number;
	numMatchs: number;
	templateHeader: TemplateHeader;
	
	lang: string;
}
