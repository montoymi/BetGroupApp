import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
//import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { CreditDetail } from '../../models/credit/credit-detail';
import { presentToast, presentLoading } from '../pages';

import { TRANSACTION_TYPE, TRANSACTION_STATUS, RESPONSE_ERROR } from '../../constants/constants';
import { Config } from '../../config';

@IonicPage()
@Component({
	selector: 'page-credit-add',
	templateUrl: 'credit-add.html'
})
export class CreditAddPage {
	form: FormGroup;
	validationMessages;

	creditAmount: number;

	private confirmTitle: string;
	private confirmMessage: string;
	private cancelButton: string;
	private okButton: string;
	private creditAddSuccess: string;
	private creditAmountRequiredError: string;
	private creditAddError: string;
	private creditAddError2: string;

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
		//,		private payPal: PayPal
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
		creditDetail.userId = this.userProvider.user.userId;
		creditDetail.createdBy = this.userProvider.user.userId;
		creditDetail.comments = 'Créditos comprados';
		creditDetail.transactionTypeId = TRANSACTION_TYPE.ADD_CREDIT;
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
		this.creditProvider.addCredit(creditDetail).subscribe(
			(res: any) => {
				loading.dismiss();
				presentToast(this.toastCtrl, this.creditAddSuccess);
				creditDetail = res.body;
				this.viewCtrl.dismiss(true);

				let params = {
					item_name: creditDetail.comments,
					value: creditDetail.creditAmount
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
						this.makePayment();
					}
				}
			]
		});
		alert.present();
	}

	done() {
		this.presentConfirm();
	}

	/*
	 * Muestra la página de paypal para realizar el pago.
	 */
	makePayment() {
		let creditDetail = this.prepareSave();
		if (!creditDetail) {
			return;
		}

		// Environment (Sandbox or Production)
		let payPalEnvironment: string = 'payPalEnvironmentSandbox';

		// Crea el objeto payment.
		let amount: string = creditDetail.creditAmount.toString();
		let currency: string = 'USD';
		let shortDescription: string = creditDetail.comments;
		let intent: string = creditDetail.transactionTypeId.toString(); // Intención, propósito.
	/*	let payment: PayPalPayment = new PayPalPayment(amount, currency, shortDescription, intent);

		this.payPal
			.init({
				PayPalEnvironmentProduction: Config.payPalEnvironmentProduction,
				PayPalEnvironmentSandbox: Config.payPalEnvironmentSandbox
			})
			.then(
				() => {
					this.payPal.prepareToRender(payPalEnvironment, new PayPalConfiguration({})).then(
						() => {
							this.payPal.renderSinglePaymentUI(payment).then(
								response => {
									if (response.response.state == 'approved') {
										this.saveCreditTransaction();
									}

									console.log(response);
								},
								e => {
									// Error or render dialog closed without being successful
									console.error(e);
								}
							);
						},
						e => {
							// Error in configuration
							console.error(e);
						}
					);
				},
				e => {
					// Error in initialization, maybe PayPal isn't supported or something else.
					// Cuando se ejecuta desde el navegador entra a esta parte, porque no carga las librerias de cordova.
					console.error(e);

					presentToast(this.toastCtrl, 'Esta opción no esta disponible en modo web');
				}
			);
	*/
	}
}
