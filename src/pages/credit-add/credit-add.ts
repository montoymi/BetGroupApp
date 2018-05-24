import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { CreditDetail } from '../../models/credit/credit-detail';
import { presentToast, presentLoading } from '../pages';
import { TRANSACTION_TYPE, TRANSACTION_STATUS, RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-credit-add',
	templateUrl: 'credit-add.html'
})
export class CreditAddPage {
	creditDetail: CreditDetail;

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private creditAddSuccess: string;
	private creditAmountRequiredError: string;
	private creditAddError: string;
	private creditAddError2: string;

	form: FormGroup;

	validationMessages;

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
				'CREDIT_ADD_CONFIRM_TITLE',
				'CREDIT_ADD_CONFIRM_MESSAGE',
				'CANCEL_BUTTON',
				'OK_BUTTON',
				'CREDIT_ADD_SUCCESS',
				'CREDIT_TO_BUY_REQUIRED_ERROR',
				'CREDIT_ADD_ERROR',
				'CREDIT_ADD_ERROR2'
			])
			.subscribe(values => {
				this.confirmTitle = values['CREDIT_ADD_CONFIRM_TITLE'];
				this.confirmMessage = values['CREDIT_ADD_CONFIRM_MESSAGE'];
				this.cancelButton = values['CANCEL_BUTTON'];
				this.okButton = values['OK_BUTTON'];
				this.creditAddSuccess = values['CREDIT_ADD_SUCCESS'];
				this.creditAmountRequiredError = values['CREDIT_TO_BUY_REQUIRED_ERROR'];
				this.creditAddError = values['CREDIT_ADD_ERROR'];
				this.creditAddError2 = values['CREDIT_ADD_ERROR2'];
			});

		this.creditDetail = new CreditDetail();

		this.validationMessages = {
			creditAmount: [{ type: 'required', message: this.creditAmountRequiredError }]
		};
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			creditAmount: new FormControl('', Validators.required)
		});
	}

	saveCreditTransaction() {
		this.creditDetail.userId = this.userProvider.user.userId;
		this.creditDetail.createdBy = this.userProvider.user.userId;
		this.creditDetail.comments = 'Créditos comprados';
		this.creditDetail.transactionTypeId = TRANSACTION_TYPE.ADD_CREDIT;
		this.creditDetail.status = TRANSACTION_STATUS.PENDING;

		let loading = presentLoading(this.loadingCtrl);
		this.creditProvider.addCredit(this.creditDetail).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.creditAddSuccess);
				this.creditDetail = res.body;
				this.viewCtrl.dismiss(true);

				let params = {
					item_name: this.creditDetail.comments,
					value: this.creditDetail.creditAmount
				};
				this.logger.logEvent(this.navCtrl.getActive().name, 'spend_virtual_currency', params);
			},
			err => {
				loading.dismiss();
				switch (err.error) {
					case RESPONSE_ERROR.CREDIT_ADD_ERROR:
						presentToast(this.toastCtrl, this.creditAddError);
						break;
					case RESPONSE_ERROR.CREDIT_ADD_ERROR2:
						presentToast(this.toastCtrl, this.creditAddError2);
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
