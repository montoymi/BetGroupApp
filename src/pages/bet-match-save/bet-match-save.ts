import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, Slides } from 'ionic-angular';

import { RESPONSE_ERROR } from '../../constants/constants';
import { UserProvider, PollaProvider } from '../../providers/providers';
import { Match } from '../../models/tournament/match';
import { PollaBet } from '../../models/polla/polla-bet';
import { presentToast, presentLoading, getFlagValue } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-bet-match-save',
	templateUrl: 'bet-match-save.html'
})
export class BetMatchSavePage {
	form: FormGroup;
	validationMessages;
	@ViewChild('slides') slides: Slides;

	match: Match;
	pollaBetList: PollaBet[];
	dir: string = 'ltr';

	private betSaveSuccess: string;
	private betScoreRequiredError: string;
	private betSaveError: string;

	// Flag del checkbox copytoall.
	isCopyChecked: boolean;
	// Para habilitar/deshabilitar el check isCopyChecked.
	validFirstSlide: boolean;

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

		this.match = this.navParams.get('match');

		this.validationMessages = {
			score: [{ type: 'required', message: this.betScoreRequiredError }]
		};

		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([])
		});
	}

	setFormValues() {
		let formGroupArray = new Array<FormGroup>();

		for (let pollaBet of this.pollaBetList) {
			let disabledScore: boolean = pollaBet.status == 0;
			let disabledWildcard: boolean = pollaBet.status == 0 || pollaBet.pollaMatch.pollaHeader.modeWildcardFlag != 1;

			let formGroup: FormGroup = this.formBuilder.group({
				localBetScore: [{ value: pollaBet.localBetScore, disabled: disabledScore }, Validators.required],
				visitorBetScore: [{ value: pollaBet.visitorBetScore, disabled: disabledScore }, Validators.required],
				flagWildcard: [{ value: pollaBet.flagWildcard, disabled: disabledWildcard }]
			});

			formGroupArray.push(formGroup);

			// Establece el evento valueChanges para el checkbox copytoall.
			if (this.pollaBetList.indexOf(pollaBet) == 0) {
				let localBetScore: AbstractControl = formGroup.get('localBetScore');
				let visitorBetScore: AbstractControl = formGroup.get('visitorBetScore');

				localBetScore.valueChanges.subscribe(val => {
					this.onChanges(localBetScore, visitorBetScore);
				});
				visitorBetScore.valueChanges.subscribe(val => {
					this.onChanges(localBetScore, visitorBetScore);
				});

				this.onChanges(localBetScore, visitorBetScore);
			}
		}

		const formArray = this.formBuilder.array(formGroupArray);
		this.form.setControl('formArray', formArray);
	}

	prepareSave(): PollaBet[] {
		let formArray = this.formArray.value;

		for (let formModel of formArray) {
			let i: number = formArray.indexOf(formModel);
			if (!this.validateForm(i)) {
				return null;
			}

			const pollaBet: PollaBet = this.pollaBetList[i];
			pollaBet.localBetScore = formModel.localBetScore;
			pollaBet.visitorBetScore = formModel.visitorBetScore;
			pollaBet.flagWildcard = getFlagValue(formModel.flagWildcard);
		}

		return this.pollaBetList;
	}

	validateForm(index: number): boolean {
		let formGroup: any = this.formArray.controls[index];

		if (!formGroup.valid) {
			// Se posiciona en el slide con error.
			this.slides.slideTo(index);

			// Marca los controles como modificados para mostrar el mensaje de error.
			Object.keys(formGroup.controls).forEach(key => {
				formGroup.get(key).markAsDirty();
			});

			return false;
		}

		return true;
	}

	get formArray(): FormArray {
		return this.form.get('formArray') as FormArray;
	}

	onChanges(localBetScore: AbstractControl, visitorBetScore: AbstractControl) {
		if (this.slides.isBeginning()) {
			// Establece el flag para habilitar/deshabilitar el checkbox isCopyChecked.
			this.validFirstSlide = localBetScore.valid && visitorBetScore.valid;

			// Cambios posteriores al onchange del checkbox deben actualizar los
			// controles según el valor del checkbox.
			if (this.isCopyChecked) {
				this.copyToAll();
			}
		}
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
		this.loadBets();
	}

	loadBets() {
		let userId: number = this.userProvider.user.userId;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getBetsByMatchIdAndUserId(this.match.matchId, userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaBetList = res.body;
				this.setFormValues();
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	updateBets() {
		if (!this.prepareSave()) {
			return;
		}

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

	copyCheckChange() {
		if (this.isCopyChecked) {
			this.copyToAll();
		}
	}

	copyToAll() {
		let localBetScoreValue1: number;
		let visitorBetScoreValue1: number;

		for (let index = 0; index < this.formArray.controls.length; index++) {
			let formGroup: any = this.formArray.controls[index];
			let localBetScore: AbstractControl = formGroup.controls.localBetScore;
			let visitorBetScore: AbstractControl = formGroup.controls.visitorBetScore;

			if (index == 0) {
				localBetScoreValue1 = localBetScore.value;
				visitorBetScoreValue1 = visitorBetScore.value;
			} else {
				localBetScore.setValue(localBetScoreValue1);
				visitorBetScore.setValue(visitorBetScoreValue1);
			}
		}
	}
}
