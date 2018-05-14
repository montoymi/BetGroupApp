import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Match } from '../../models/tournament/match';
import { RESPONSE_STATUS } from '../../constants/constants';
import { formatISO8601 } from '../providers';

@Injectable()
export class MatchProvider {
	constructor(public api: Api) {}

	getMatchsWithBetsByUserId(userId: number) {
		let seq = this.api.get('matches/bets/' + userId).share();

		seq.subscribe(
			(res: any) => {
				let matchList: Match[] = res.body;
				for (let match of matchList) {
					match.matchDate = formatISO8601(match.matchDate);
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
