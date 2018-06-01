import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { presentToast, presentLoading } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-participant-save',
	templateUrl: 'participant-save.html'
})
export class ParticipantSavePage {
	@ViewChild(Navbar) navBar: Navbar;

	pollaHeader: PollaHeader;

	private acceptPatternError: string;
	private password: string;
	private gamePasswordError: string;
	private gameSaveError: string;
	private confirmTitle: string;
	private confirmMessage: string;
	private registerSuccess: string;
	private cancelButton: string;
	private okButton: string;

	form: FormGroup;

	validationMessages;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private alertCtrl: AlertController,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public formBuilder: FormBuilder,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'RULES_PATTERN_ERROR',
				'PASSWORD',
				'GAME_PASSWORD_ERROR',
				'GAME_SAVE_ERROR',
				'REGISTER_CONFIRM_TITLE',
				'REGISTER_CONFIRM_MESSAGE',
				'REGISTER_SUCCESS',
				'CANCEL_BUTTON',
				'OK_BUTTON'
			])
			.subscribe(values => {
				this.acceptPatternError = values['RULES_PATTERN_ERROR'];
				this.password = values['PASSWORD'];
				this.gamePasswordError = values['GAME_PASSWORD_ERROR'];
				this.gameSaveError = values['GAME_SAVE_ERROR'];
				this.confirmTitle = values['REGISTER_CONFIRM_TITLE'];
				this.confirmMessage = values['REGISTER_CONFIRM_MESSAGE'];
				this.registerSuccess = values['REGISTER_SUCCESS'];
				this.cancelButton = values['CANCEL_BUTTON'];
				this.okButton = values['OK_BUTTON'];
			});

			this.validationMessages = {
				accept: [{ type: 'pattern', message: this.acceptPatternError }]
			};

			this.createForm();
	}

	createForm() {
		this.form = this.formBuilder.group({
			accept: [false, Validators.pattern('true')]
		});
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.loadGameRules();
	}

	loadGameRules() {
		this.pollaHeader = this.navParams.get('pollaHeader');
		this.pollaHeader.lang = this.translate.store.currentLang;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getGameRules(this.pollaHeader).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaHeader = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	///

	presentPrompt() {
		let alert = this.alertCtrl.create({
			title: this.password,
			inputs: [
				{
					name: 'password',
					placeholder: this.password,
					type: 'password'
				}
			],
			buttons: [
				{
					text: this.cancelButton,
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.okButton,
					handler: data => {
						this.pollaHeader.password = data.password;
						this.createParticipant();
					}
				}
			]
		});
		alert.present();
	}

	presentConfirm() {
		let alert = this.alertCtrl.create({
			title: this.confirmTitle,
			message: this.confirmMessage,
			buttons: [
				{
					text: this.cancelButton,
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.okButton,
					handler: data => {
						this.registerInGame();
					}
				}
			]
		});
		alert.present();
	}

	createParticipant() {
		let pollaParticipant: PollaParticipant = new PollaParticipant();
		pollaParticipant.pollaHeader = this.pollaHeader;
		pollaParticipant.pollaHeaderId = this.pollaHeader.pollaId;
		pollaParticipant.user = this.userProvider.user;
		pollaParticipant.userId = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.createParticipant(pollaParticipant).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.registerSuccess);

				// Cierra la ventana.
				this.navCtrl.parent.viewCtrl.dismiss();
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.GAME_PASSWORD_ERROR:
						presentToast(this.toastCtrl, this.gamePasswordError);
						break;
					case RESPONSE_ERROR.GAME_SAVE_ERROR:
						presentToast(this.toastCtrl, this.gameSaveError);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	registerInGame() {
		// Si es polla privada valida password.
		if (this.pollaHeader.accessFlag == 1) {
			this.presentPrompt();
		} else {
			this.createParticipant();
		}
	}

	done() {
		this.presentConfirm();
	}
}
