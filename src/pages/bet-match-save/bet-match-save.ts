import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { Match } from '../../models/tournament/match';
import { PollaBet } from '../../models/polla/polla-bet';
import { presentToast, presentLoading } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-bet-match-save',
	templateUrl: 'bet-match-save.html'
})
export class BetMatchSavePage {
	match: Match;
	pollaBetList: PollaBet[];
	dir: string = 'ltr';

	private betSaveSuccess: string;
	private betSaveError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate.get(['BET_SAVE_SUCCESS', 'BET_SAVE_ERROR']).subscribe(values => {
			this.betSaveSuccess = values['BET_SAVE_SUCCESS'];
			this.betSaveError = values['BET_SAVE_ERROR'];
		});

		this.match = this.navParams.get('match');

		this.loadBets();
	}

	loadBets() {
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getBetsByMatchIdAndUserId(this.match.matchId, userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaBetList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	updateBets() {
		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.updateBets(this.pollaBetList).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.betSaveSuccess);
				this.pollaBetList = res.body;
				this.viewCtrl.dismiss(true);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.BET_SAVE_ERROR:
						presentToast(this.toastCtrl, this.betSaveError);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	done() {
		this.updateBets();
	}
}
