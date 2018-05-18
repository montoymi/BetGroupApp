import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';

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

	private creditCollectSuccess: string;
	private creditCollectError: string;
	private creditCollectError2: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public creditProvider: CreditProvider,
		public logger: EventLoggerProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate
			.get(['CREDIT_COLLECT_SUCCESS', 'CREDIT_COLLECT_ERROR', 'CREDIT_COLLECT_ERROR2'])
			.subscribe(values => {
				this.creditCollectSuccess = values['CREDIT_COLLECT_SUCCESS'];
				this.creditCollectError = values['CREDIT_COLLECT_ERROR'];
				this.creditCollectError2 = values['CREDIT_COLLECT_ERROR2'];
			});

		this.credit = navParams.get('credit');
		this.creditDetail = new CreditDetail();
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
					default:
						presentToast(this.toastCtrl, err.message);
						break;
				}
			}
		);
	}

	done() {
		this.saveCreditTransaction();
	}
}
