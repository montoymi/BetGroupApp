import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { Credit } from '../../models/credit/credit';
import { CreditDetail } from '../../models/credit/credit-detail';
import { presentToast, presentLoading } from '../pages';
import { TRANSACTION_TYPE, TRANSACTION_STATUS, RESPONSE_ERROR } from '../../constants/constants';

@IonicPage()
@Component({
	selector: 'page-credit-collect',
	templateUrl: 'credit-collect.html'
})
export class CreditCollectPage {
	credit: Credit;
	creditDetail: CreditDetail;

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private creditCollectSuccess: string;
	private creditAmountRequiredError: string;
	private creditCollectError: string;
	private creditCollectError2: string;
	private creditCollectError3: string;

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

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	saveCreditTransaction() {
		this.creditDetail.credit = this.credit;
		this.creditDetail.userId = this.userProvider.user.userId;
		this.creditDetail.createdBy = this.userProvider.user.userId;
		this.creditDetail.comments = 'Créditos cobrados';
		this.creditDetail.transactionTypeId = TRANSACTION_TYPE.COLLECT_CREDIT;
		this.creditDetail.status = TRANSACTION_STATUS.PENDING;

		let loading = presentLoading(this.loadingCtrl);
		this.creditProvider.collectCredit(this.creditDetail).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.creditCollectSuccess);
				this.creditDetail = res.body;
				this.viewCtrl.dismiss(true);

				let params = {
					item_name: this.creditDetail.comments,
					value: this.creditDetail.creditAmount
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
