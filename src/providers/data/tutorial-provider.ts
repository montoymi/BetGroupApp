import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Slide } from '../../pages/tutorial/tutorial';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class TutorialProvider {
	constructor(public api: Api) {}

	getSlides(lang: string) {
		let seq = this.api.get('slides/tutorial', { lang: lang }).share();

		seq.subscribe(
			(res: any) => {
				let slideList: Slide[] = res.body;
				let index: number = 0;
				for (let slide of slideList) {
					index++;
					slide.image = 'assets/img/ica-slidebox-img-' + index + '.png';
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
