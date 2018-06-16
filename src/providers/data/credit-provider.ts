import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Credit } from '../../models/credit/credit';
import { CreditDetail } from '../../models/credit/credit-detail';
import { RESPONSE_STATUS } from '../../constants/constants';
import { formatISO8601_Z } from '../../utils/utils';

@Injectable()
export class CreditProvider {
	constructor(public api: Api) {}

	getCreditSummaryByUserId(userId: number) {
		let seq = this.api.get('credits', { 'user-id': userId }).share();

		seq.subscribe(
			(res: any) => {
				let credit: Credit = res.body;
				if (credit.creditDetailList) {
					for (const creditDetail of credit.creditDetailList) {
						creditDetail.transactionDate = formatISO8601_Z(creditDetail.transactionDate);
					}
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

	addCredit(creditDetail: CreditDetail) {
		let seq = this.api.post('credits/comprar', creditDetail).share();

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

	collectCredit(creditDetail: CreditDetail) {
		let seq = this.api.post('credits/cobrar', creditDetail).share();

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
}
