import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { PollaProvider } from '../../providers/providers';
import { PollaBet } from '../../models/polla/polla-bet';
import { presentToast, getFlagValue } from '../pages';
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
		public pollaProvider: PollaProvider
	) {
		this.translate.get(['BET_SAVE_SUCCESS', 'BET_SAVE_ERROR']).subscribe(values => {
			this.betSaveSuccess = values['BET_SAVE_SUCCESS'];
			this.betSaveError = values['BET_SAVE_ERROR'];
		});

		this.pollaBet = navParams.get('pollaBet');
	}

	updateGameBet() {
		this.pollaBet.flagWildcard = getFlagValue(this.pollaBet.flagWildcard);

		this.pollaProvider.updateGameBet(this.pollaBet).subscribe(
			(res: any) => {
				presentToast(this.toastCtrl, this.betSaveSuccess);
				this.pollaBet = res.body;
				this.viewCtrl.dismiss();
			},
			err => {
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
