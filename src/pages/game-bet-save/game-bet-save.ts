import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
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
	private betScoreRequiredError: string;
	private betSaveError: string;

	form: FormGroup;

	validationMessages;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public formBuilder: FormBuilder,
		public loadingCtrl: LoadingController
	) {
		this.translate.get(['BET_SAVE_SUCCESS', 'BET_SCORE_REQUIRED_ERROR', 'BET_SAVE_ERROR']).subscribe(values => {
			this.betSaveSuccess = values['BET_SAVE_SUCCESS'];
			this.betScoreRequiredError = values['BET_SCORE_REQUIRED_ERROR'];
			this.betSaveError = values['BET_SAVE_ERROR'];
		});

		this.pollaBet = navParams.get('pollaBet');

		this.validationMessages = {
			score: [{ type: 'required', message: this.betScoreRequiredError }]
		};

		this.createForm();
	}

	createForm() {
		let disabledScore: boolean = this.pollaBet.status == 0;
		let disabledWildcard: boolean = this.pollaBet.status == 0 || this.pollaBet.pollaMatch.pollaHeader.modeWildcardFlag != 1;

		this.form = this.formBuilder.group({
			localBetScore: [{ value: this.pollaBet.localBetScore, disabled: disabledScore }, Validators.required],
			visitorBetScore: [{ value: this.pollaBet.visitorBetScore, disabled: disabledScore }, Validators.required],
			flagWildcard: [{ value: this.pollaBet.flagWildcard, disabled: disabledWildcard }]
		});
	}

	prepareSavePollaBet(): PollaBet {
		const formModel = this.form.value;

		this.pollaBet.localBetScore = formModel.localBetScore;
		this.pollaBet.visitorBetScore = formModel.visitorBetScore;
		this.pollaBet.flagWildcard = getFlagValue(formModel.flagWildcard);

		return this.pollaBet;
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	updateGameBet() {
		this.prepareSavePollaBet();

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
