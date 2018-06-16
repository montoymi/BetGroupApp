import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController, TextInput, Checkbox, LoadingController } from 'ionic-angular';
import { IonicStepperComponent, IonicStepComponent } from 'ionic-stepper';

import { RESPONSE_ERROR } from '../../constants/constants';
import { TemplateProvider, UserProvider, PollaProvider, EventLoggerProvider } from '../../providers/providers';
import { TemplateHeader } from '../../models/template/template-header';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, getFlagValue, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-game-save',
	templateUrl: 'game-save.html'
})
export class GameSavePage {
	@ViewChild('stepper') stepper: IonicStepperComponent;
	@ViewChild('pollaCost') pollaCost: TextInput;
	@ViewChild('modePollaFlag') modePollaFlag: Checkbox;
	@ViewChild('modePollitaFlag') modePollitaFlag: Checkbox;
	@ViewChild('modeWildcardFlag') modeWildcardFlag: Checkbox;
	@ViewChild('accept') accept: Checkbox;

	templateHeaderList: TemplateHeader[];
	selectedTemplateHeader: TemplateHeader;
	pollaHeader: PollaHeader;

	private gameStep1Title: string;
	private gameStep2Title: string;
	private gameStep3Title: string;
	private gameStep4Title: string;
	private gameSuccess: string;
	private gameSaveError: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public templateProvider: TemplateProvider,
		public pollaProvider: PollaProvider,
		public logger: EventLoggerProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate.get(['GAME_STEP1_TITLE', 'GAME_STEP2_TITLE', 'GAME_STEP3_TITLE', 'GAME_STEP4_TITLE', 'GAME_SAVE_SUCCESS', 'GAME_SAVE_ERROR']).subscribe(values => {
			this.gameStep1Title = values['GAME_STEP1_TITLE'];
			this.gameStep2Title = values['GAME_STEP2_TITLE'];
			this.gameStep3Title = values['GAME_STEP3_TITLE'];
			this.gameStep4Title = values['GAME_STEP4_TITLE'];
			this.gameSuccess = values['GAME_SAVE_SUCCESS'];
			this.gameSaveError = values['GAME_SAVE_ERROR'];
		});

		this.pollaHeader = new PollaHeader();
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
		this.loadTemplateHeaders();
	}

	/*
	 * Steeper.
	 */

	selectChange(e) {
		let step: IonicStepComponent;

		switch (e) {
			case 1:
				step = this.getStep(this.gameStep1Title);

				if (this.selectedTemplateHeader == null) {
					this.setError(step, 'Seleccione el betgroup');
					this.stepper.previousStep();
					return;
				} else {
					this.setError(step, '');
				}

				break;
			case 2:
				step = this.getStep(this.gameStep2Title);

				if (!this.pollaHeader.pollaName) {
					this.setError(step, 'Ingrese el nombre del juego');
					this.stepper.previousStep();
					return;
				} else {
					this.setError(step, '');
				}

				if (this.pollaHeader.costFlag && !this.pollaHeader.pollaCost) {
					this.setError(step, 'Ingrese el costo');
					this.stepper.previousStep();
					return;
				} else {
					this.setError(step, '');
				}

				if (this.pollaHeader.costFlag && this.pollaHeader.pollaCost == 0) {
					this.setError(step, 'El costo debe ser mayor que cero');
					this.stepper.previousStep();
					return;
				} else {
					this.setError(step, '');
				}

				if (this.pollaHeader.accessFlag && !this.pollaHeader.password) {
					this.setError(step, 'Ingrese la contraseña');
					this.stepper.previousStep();
					return;
				} else {
					this.setError(step, '');
				}

				break;
			case 3:
				step = this.getStep(this.gameStep3Title);

				// Si no se puede seleccionar ningún flag.
				if (this.modePollaFlag.disabled && this.modePollitaFlag.disabled) {
					return;
				}

				if (!this.pollaHeader.modePollaFlag && !this.pollaHeader.modePollitaFlag) {
					this.setError(step, 'Seleccione la modalidad pozo total o pozo por fecha');
					this.stepper.previousStep();
					return;
				} else {
					this.setError(step, '');
					this.loadGameRules();
				}

				break;
		}
	}

	loadGameRules() {
		this.pollaHeader.adminId = this.userProvider.user.userId;
		this.pollaHeader.templateHeaderId = this.selectedTemplateHeader.templateHeaderId;
		this.pollaHeader.numWildcards = this.selectedTemplateHeader.numWildcards;
		this.pollaHeader.costFlag = getFlagValue(this.pollaHeader.costFlag);
		this.pollaHeader.accessFlag = getFlagValue(this.pollaHeader.accessFlag);
		this.pollaHeader.pollaCost = this.pollaCost.disabled ? null : this.pollaHeader.pollaCost;
		this.pollaHeader.modePollaFlag = this.modePollaFlag.disabled ? 0 : getFlagValue(this.pollaHeader.modePollaFlag);
		this.pollaHeader.modePollitaFlag = this.modePollitaFlag.disabled ? 0 : getFlagValue(this.pollaHeader.modePollitaFlag);
		this.pollaHeader.modeWildcardFlag = this.modeWildcardFlag.disabled ? 0 : getFlagValue(this.pollaHeader.modeWildcardFlag);
		this.pollaHeader.numEvents = this.selectedTemplateHeader.numEvents;
		this.pollaHeader.numMatchs = this.selectedTemplateHeader.numMatchs;
		this.pollaHeader.lang = this.userProvider.user.preferredLang;

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

	createPolla() {
		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.createPolla(this.pollaHeader).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.gameSuccess);
				this.pollaHeader = res.body;

				// Si se abrió desde el menú
				if (this.navCtrl.getPrevious() == null) {
					this.navCtrl.setRoot('GameListPage');
				} else {
					this.viewCtrl.dismiss();
				}

				let params = {
					templateHeaderId: this.pollaHeader.templateHeaderId,
					pollaCost: this.pollaHeader.pollaCost,
					numWildcards: this.pollaHeader.numWildcards
				};
				this.logger.logEvent(this.navCtrl.getActive().name, 'game_save', params);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
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

	done() {
		let step: IonicStepComponent = this.getStep(this.gameStep4Title);

		if (!this.accept.checked) {
			this.setError(step, 'Seleccione la opción acepto');
			this.stepper.selectedIndex = 3;
		} else {
			this.setError(step, '');
			this.createPolla();
		}
	}

	getStep(title: string) {
		return this.stepper._steps.find(step => step.label === title);
	}

	setError(step: IonicStepComponent, description: string) {
		if (description != '') {
			step.status = 'error';
			step.description = description;
		} else {
			step.status = '';
			step.description = '';
		}
	}

	/*
	 * Step 1.
	 */

	loadTemplateHeaders() {
		let loading = presentLoading(this.loadingCtrl);
		this.templateProvider.getAllTemplateHeaders().subscribe(
			(res: any) => {
				loading.dismiss();
				this.templateHeaderList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	filter(ev) {
		// set val to the value of the ev target
		let name: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (name && name.trim() != '') {
			this.templateHeaderList = this.templateHeaderList.filter(templateHeader => {
				return templateHeader.templateName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadTemplateHeaders();
		}
	}

	setCheckedTemplateHeader(templateHeader: TemplateHeader) {
		this.selectedTemplateHeader = templateHeader;
	}

	/*
	 * Step 2.
	 */

	openTemplateMatchListPage() {
		let modal = this.modalCtrl.create('TemplateMatchListPage', {
			templateId: this.selectedTemplateHeader.templateHeaderId
		});
		modal.present();
	}
}
