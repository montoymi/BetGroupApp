import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, Slides } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { Match } from '../../models/tournament/match';
import { PollaBet } from '../../models/polla/polla-bet';
import { presentToast, presentLoading } from '../pages';
import { RESPONSE_ERROR } from '../../constants/constants';

import { ChangeDetectorRef } from '@angular/core';

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
	private betScoreRequiredError: string;
	private betSaveError: string;

	@ViewChild('slides') slides: Slides;

	form: FormGroup;

	validationMessages;

	localBetScore: AbstractControl;
	visitorBetScore: AbstractControl;
	flagWildcard: AbstractControl;

	// Flag del checkbox copytoall.
	isCopyChecked: boolean;
	// Para habilitar/deshabilitar el check isCopyChecked.
	validFirstSlide: boolean;
	// Para mostrar error al validar al grabar.
	hasError: boolean;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public formBuilder: FormBuilder,
		public loadingCtrl: LoadingController,
		private cdRef: ChangeDetectorRef
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
	}

	// Previene el error: expression has changed after it was checked.
	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			localBetScore: new FormControl('', Validators.required),
			visitorBetScore: new FormControl('', Validators.required),
			flagWildcard: new FormControl('')
		});

		this.localBetScore = this.form.get('localBetScore');
		this.visitorBetScore = this.form.get('visitorBetScore');
		this.flagWildcard = this.form.get('flagWildcard');

		// Emits an event every time the value of the control changes, in
		// the UI or programmatically (luego de la carga inicial de la
		// variable asociada a los controles).
		this.localBetScore.valueChanges.subscribe(val => {
			this.onChanges();
		});
		this.visitorBetScore.valueChanges.subscribe(val => {
			this.onChanges();
		});
	}

	onChanges() {
		// Es necesario acceder a estas propiedades por medio del control y no
		// del formulario. The valueChanges event is fired after the new value
		// is updated to the FormControl value, and before the change is bubbled
		// up to its parent and ancestors.
		let isValid: boolean = this.localBetScore.valid && this.visitorBetScore.valid;
		let isDirty: boolean = this.localBetScore.dirty || this.visitorBetScore.dirty;

		// Solo se debe ejecutar por los cambios del usuario.
		if (!isDirty) {
			return;
		}

		if (this.slides.isBeginning()) {
			// Establece el flag para habilitar/deshabilitar el checkbox isCopyChecked.
			this.validFirstSlide = isValid;

			// Cambios posteriores al onchange del checkbox deben actualizar los
			// controles según el valor del checkbox.
			if (this.isCopyChecked) {
				this.copyToAll();
			}
		}

		// Bloquea el slide si el formulario no es válido.
		this.slides.lockSwipes(!isValid);

		// Esta variable se establece en validateAll, pero necesita actualizarse
		// una vez que se ingresan los valores para que se borre el mensaje de
		// error.
		if (isValid) {
			this.hasError = false;
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
		if (this.validateAll()) {
			this.updateBets();
		}
	}

	validateAll() {
		let localBetScore: number;
		let visitorBetScor: number;

		for (let index = 0; index < this.slides.length(); index++) {
			localBetScore = this.pollaBetList[index].localBetScore;
			visitorBetScor = this.pollaBetList[index].visitorBetScore;

			if (!localBetScore || !visitorBetScor) {
				// Se posiciona en el slide con error.
				this.slides.slideTo(index);

				this.hasError = true;
				// Bloquea el slide.
				this.slides.lockSwipes(true);

				return false;
			}
		}

		this.hasError = false;
		// Desbloquea el slide.
		this.slides.lockSwipes(false);

		return true;
	}

	copyCheckChange() {
		if (this.isCopyChecked) {
			this.copyToAll();
		}
	}

	copyToAll() {
		let localBetScore1: number = this.pollaBetList[0].localBetScore;
		let visitorBetScor1: number = this.pollaBetList[0].visitorBetScore;

		// Copia el pronóstico del primer partido a todos los demás.
		for (let pollaBet of this.pollaBetList) {
			pollaBet.localBetScore = localBetScore1;
			pollaBet.visitorBetScore = visitorBetScor1;
		}
	}

	onSlideChange(slides: Slides) {
		let index: number = slides.getActiveIndex();
		let pollaBet = this.pollaBetList[index];

		if (pollaBet.status == 0) {
			this.localBetScore.disable();
			this.visitorBetScore.disable();
		} else {
			this.localBetScore.enable();
			this.visitorBetScore.enable();
		}

		if (pollaBet.status == 0 || pollaBet.pollaMatch.pollaHeader.modeWildcardFlag != 1) {
			this.flagWildcard.disable();
		} else {
			this.flagWildcard.enable();
		}
	}
}
