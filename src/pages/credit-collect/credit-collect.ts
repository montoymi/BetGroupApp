import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { TRANSACTION_TYPE, TRANSACTION_STATUS, RESPONSE_ERROR } from '../../constants/constants';
import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { Credit } from '../../models/credit/credit';
import { CreditDetail } from '../../models/credit/credit-detail';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-credit-collect',
	templateUrl: 'credit-collect.html'
})
export class CreditCollectPage {
	form: FormGroup;
	validationMessages;

	credit: Credit;
	creditAmount: number;

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private creditCollectSuccess: string;
	private creditAmountRequiredError: string;
	private creditCollectError: string;
	private creditCollectError2: string;
	private creditCollectError3: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private alertCtrl: AlertController,
		public userProvider: UserProvider,
		public creditProvider: CreditProvider,
		public formBuilder: FormBuilder,
		public logger: EventLoggerProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get([
				'CREDIT_COLLECT_CONFIRM_TITLE',
				'CREDIT_COLLECT_CONFIRM_MESSAGE',
				'CANCEL_BUTTON',
				'OK_BUTTON',
				'CREDIT_COLLECT_SUCCESS',
				'CREDIT_TO_COLLECT_REQUIRED_ERROR',
				'CREDIT_COLLECT_ERROR',
				'CREDIT_COLLECT_ERROR2',
				'CREDIT_COLLECT_ERROR3'
			])
			.subscribe(values => {
				this.confirmTitle = values['CREDIT_COLLECT_CONFIRM_TITLE'];
				this.confirmMessage = values['CREDIT_COLLECT_CONFIRM_MESSAGE'];
				this.cancelButton = values['CANCEL_BUTTON'];
				this.okButton = values['OK_BUTTON'];
				this.creditCollectSuccess = values['CREDIT_COLLECT_SUCCESS'];
				this.creditAmountRequiredError = values['CREDIT_TO_COLLECT_REQUIRED_ERROR'];
				this.creditCollectError = values['CREDIT_COLLECT_ERROR'];
				this.creditCollectError2 = values['CREDIT_COLLECT_ERROR2'];
				this.creditCollectError3 = values['CREDIT_COLLECT_ERROR3'];
			});

		this.credit = navParams.get('credit');

		this.validationMessages = {
			creditAmount: [{ type: 'required', message: this.creditAmountRequiredError }]
		};

		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			creditAmount: ['', Validators.required]
		});
	}

	prepareSave(): CreditDetail {
		if (!this.validateForm()) {
			return null;
		}

		const formModel = this.form.value;

		let creditDetail = new CreditDetail();
		creditDetail.credit = this.credit;
		creditDetail.userId = this.userProvider.user.userId;
		creditDetail.createdBy = this.userProvider.user.userId;
		creditDetail.comments = 'Créditos cobrados';
		creditDetail.transactionTypeId = TRANSACTION_TYPE.COLLECT_CREDIT;
		creditDetail.status = TRANSACTION_STATUS.PENDING;
		creditDetail.creditAmount = formModel.creditAmount;

		return creditDetail;
	}

	validateForm(): boolean {
		if (!this.form.valid) {
			// Marca los controles como modificados para mostrar los mensajes de error.
			Object.keys(this.form.controls).forEach(key => {
				this.form.get(key).markAsDirty();
			});

			return false;
		}

		return true;
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	saveCreditTransaction() {
		let creditDetail = this.prepareSave();
		if (!creditDetail) {
			return;
		}

		let loading = presentLoading(this.loadingCtrl);
		this.creditProvider.collectCredit(creditDetail).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.creditCollectSuccess);
				creditDetail = res.body;
				this.viewCtrl.dismiss(true);

				let params = {
					item_name: creditDetail.comments,
					value: creditDetail.creditAmount
				};
				this.logger.logEvent(this.navCtrl.getActive().name, 'earn_virtual_currency', params);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.CREDIT_COLLECT_ERROR:
						presentToast(this.toastCtrl, this.creditCollectError);
						break;
					case RESPONSE_ERROR.CREDIT_COLLECT_ERROR2:
						presentToast(this.toastCtrl, this.creditCollectError2);
						break;
					case RESPONSE_ERROR.CREDIT_COLLECT_ERROR3:
						presentToast(this.toastCtrl, this.creditCollectError3);
						break;
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
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
						this.saveCreditTransaction();
					}
				}
			]
		});
		alert.present();
	}

	done() {
		this.presentConfirm();
	}
}
