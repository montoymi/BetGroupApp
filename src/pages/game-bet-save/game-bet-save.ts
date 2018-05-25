import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaBet } from '../../models/polla/polla-bet';
import { presentToast, getFlagValue, presentLoading } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-game-bet-save',
	templateUrl: 'game-bet-save.html'
})
export class GameBetSavePage {
	pollaBet: PollaBet;

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

		this.pollaBet = navParams.get('pollaBet');
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	updateGameBet() {
		this.pollaBet.flagWildcard = getFlagValue(this.pollaBet.flagWildcard);

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.updateGameBet(this.pollaBet).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.betSaveSuccess);
				this.pollaBet = res.body;
				this.viewCtrl.dismiss();
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
		this.updateGameBet();
	}
}
