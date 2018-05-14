import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Friend } from '../../models/account/friend';
import { RESPONSE_STATUS } from '../../constants/constants';

@Injectable()
export class FriendProvider {
	constructor(public api: Api) {}

	createFriend(friend: Friend) {
		let seq = this.api.post('friends', friend).share();

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

	deleteFriend(friend: number) {
		let seq = this.api.delete('friends/' + friend, friend).share();

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

	getFriendsByUserId(userId: number) {
		let seq = this.api.get('friends', { 'user-id': userId }).share();

		seq.subscribe(
			(res: any) => {
				let friendList: Friend[] = res.body;
				for (let friend of friendList) {
					friend.amigo.photo = 'assets/img/speakers/duck.jpg';
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

	inviteFriend(pollaId: number, friend: Friend) {
		let seq = this.api.post('friends/' + pollaId, friend).share();

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
}
