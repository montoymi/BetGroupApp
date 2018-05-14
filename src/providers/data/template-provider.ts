import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { TemplateHeader } from '../../models/template/template-header';
import { RESPONSE_STATUS } from '../../constants/constants';
import { formatISO8601 } from '../providers';

@Injectable()
export class TemplateProvider {
	constructor(public api: Api) {}

	getAllTemplateHeaders() {
		let seq = this.api.get('template-headers').share();

		seq.subscribe(
			(res: any) => {
				let templateHeaderList: TemplateHeader[] = res.body;
				for (let templateHeader of templateHeaderList) {
					templateHeader.startDate = formatISO8601(templateHeader.startDate);
					templateHeader.endDate = formatISO8601(templateHeader.endDate);
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

	getTemplateDetailsByTempHeaderId(templateHeaderId: number) {
		let seq = this.api.get('template-details/' + templateHeaderId).share();

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
