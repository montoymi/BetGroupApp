import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, AlertController } from 'ionic-angular';

import { PollaProvider, UserProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { RESPONSE_ERROR } from '../../constants/constants';
import { presentToast } from '../pages';

@IonicPage()
@Component({
	selector: 'page-game-available-detail',
	templateUrl: 'game-available-detail.html'
})
export class GameAvailableDetailPage {
	@ViewChild(Navbar) navBar: Navbar;
	
	pollaHeader: PollaHeader;

	private password: string;
	private gamePasswordError: string;
	private registerSuccess: string;
	private cancelButton: string;
	private okButton: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private alertCtrl: AlertController,
		private userProvider: UserProvider,
		public pollaProvider: PollaProvider
	) {
		this.translate
			.get(['PASSWORD', 'GAME_PASSWORD_ERROR', 'REGISTER_SUCCESS', 'CANCEL_BUTTON', 'OK_BUTTON'])
			.subscribe(values => {
				this.password = values['PASSWORD'];
				this.gamePasswordError = values['GAME_PASSWORD_ERROR'];
				this.registerSuccess = values['REGISTER_SUCCESS'];
				this.cancelButton = values['CANCEL_BUTTON'];
				this.okButton = values['OK_BUTTON'];
			});

		this.loadPolla();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	loadPolla() {
		this.pollaHeader = this.navParams.get('pollaHeader');
		
		this.pollaProvider.getPollaById(this.pollaHeader.pollaId).subscribe(
			(res: any) => {
				this.pollaHeader = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	createParticipant() {
		let pollaParticipant: PollaParticipant = new PollaParticipant();
		pollaParticipant.pollaHeader = this.pollaHeader;
		pollaParticipant.pollaHeaderId = this.pollaHeader.pollaId;
		pollaParticipant.user = this.userProvider.user;
		pollaParticipant.userId = this.userProvider.user.userId;

		this.pollaProvider.createParticipant(pollaParticipant).subscribe(
			(res: any) => {
				presentToast(this.toastCtrl, this.registerSuccess);
				
				// Redirecciona al detalle mis juegos para ver el nuevo 
				// juego al que el usuario de ha inscrito.
				this.navCtrl.setRoot('GameListPage');
				this.navCtrl.push('GameTabsPage', {
					pollaHeader: this.pollaHeader,
					myPollas: true
				});
			},
			err => {
				switch (err.error) {
					case RESPONSE_ERROR.GAME_PASSWORD_ERROR:
						presentToast(this.toastCtrl, this.gamePasswordError);
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
			this.presentAccessPrompt();
		} else {
			this.createParticipant();
		}
	}

	presentAccessPrompt() {
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

	openParticipantListPage() {
		this.navCtrl.push('ParticipantListPage', { pollaId: this.pollaHeader.pollaId });
	}

	openGameMatchListPage() {
		this.navCtrl.push('GameMatchListPage', { pollaId: this.pollaHeader.pollaId });
	}
}
