import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { PollaHeader } from '../../models/polla/polla-header';
import { PollaBet } from '../../models/polla/polla-bet';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaMatch } from '../../models/polla/polla-match';
import { RESPONSE_STATUS } from '../../constants/constants';
import { formatISO8601_Z } from '../providers';

@Injectable()
export class PollaProvider {
	constructor(public api: Api) {}

	/*
	 * PollaHeader.
	 */

	createPolla(pollaHeader: PollaHeader) {
		let seq = this.api.post('pollas', pollaHeader).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.CREATED) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getPollasByUserId(userId: number, myPollas: boolean) {
		let seq = this.api.get('pollas', { 'user-id': userId, 'my-pollas': myPollas }).share();

		seq.subscribe(
			(res: any) => {
				let pollaHeaderList: PollaHeader[] = res.body;
				for (let pollaHeader of pollaHeaderList) {
					pollaHeader.startDate = formatISO8601_Z(pollaHeader.startDate);
				}

				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getPollaById(pollaId: number) {
		let seq = this.api.get('pollas/' + pollaId).share();

		seq.subscribe(
			(res: any) => {
				let pollaHeader: PollaHeader = res.body;
				pollaHeader.startDate = formatISO8601_Z(pollaHeader.startDate);
				pollaHeader.endDate = formatISO8601_Z(pollaHeader.endDate);

				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getGameRules(pollaHeader: PollaHeader) {
		let seq = this.api.post('pollas/rules', pollaHeader).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	/*
	 * PollaParticipant.
	 */

	getParticipantByPollaId(pollaId: number, userId: number) {
		let seq = this.api.get('participants/' + pollaId, { 'user-id': userId }).share();

		seq.subscribe(
			(res: any) => {
				let pollaParticipant: PollaParticipant = res.body;
				pollaParticipant.pollaHeader.startDate = formatISO8601_Z(pollaParticipant.pollaHeader.startDate);
				pollaParticipant.pollaHeader.endDate = formatISO8601_Z(pollaParticipant.pollaHeader.endDate);
				pollaParticipant.inscriptionDate = formatISO8601_Z(pollaParticipant.inscriptionDate);

				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getParticipantsByPollaId(pollaId: number) {
		let seq = this.api.get('participants', { 'polla-id': pollaId }).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	createParticipant(pollaParticipant: PollaParticipant) {
		let seq = this.api.post('participants', pollaParticipant).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.CREATED) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getPollaRankingByPollaId(pollaId: number) {
		let seq = this.api.get('participants/rankings', { 'polla-id': pollaId }).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	/*
	 * PollaBet.
	 */

	getGameBetsByPollaIdAndUserId(pollaId: number, userId: number) {
		let seq = this.api.get('bets/games', { 'polla-id': pollaId, 'user-id': userId }).share();

		seq.subscribe(
			(res: any) => {
				let pollaBetList: PollaBet[] = res.body;
				for (let pollaBet of pollaBetList) {
					pollaBet.pollaMatch.match.matchDateWithTimezone = formatISO8601_Z(pollaBet.pollaMatch.match.matchDateWithTimezone);
				}

				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	updateGameBet(pollaBet: PollaBet) {
		let seq = this.api.post('bets/games', pollaBet).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.CREATED) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	getBetsByMatchIdAndUserId(matchId: number, userId: number) {
		let seq = this.api.get('bets', { 'match-id': matchId, 'user-id': userId }).share();

		seq.subscribe(
			(res: any) => {
				let pollaBetList: PollaBet[] = res.body;
				for (let pollaBet of pollaBetList) {
					pollaBet.pollaMatch.match.matchDateWithTimezone = formatISO8601_Z(pollaBet.pollaMatch.match.matchDateWithTimezone);
					pollaBet.pollaParticipant.userId = userId;
				}

				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	updateBets(pollaBetList: PollaBet[]) {
		let seq = this.api.post('bets', pollaBetList).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.CREATED) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	/*
	 * PollaMatch.
	 */

	getPollaMatchesByPollaId(pollaId: number) {
		let seq = this.api.get('polla-matches/' + pollaId).share();

		seq.subscribe(
			(res: any) => {
				let pollaMatchList: PollaMatch[] = res.body;
				for (let pollaMatch of pollaMatchList) {
					pollaMatch.match.matchDateWithTimezone = formatISO8601_Z(pollaMatch.match.matchDateWithTimezone);
				}

				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}
}
