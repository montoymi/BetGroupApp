import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider, ParamValueProvider } from '../../providers/providers';
import { User } from '../../models/account/user';
import { presentToast, presentLoading } from '../pages';

export interface Card {
	idCard: number;
	cardType: string;
	title: string;
	content1: string;
	content2: string;
	image1: string;
	image2: string;
	status: number;
	startDate: any;
	endDate: any;
	publicationDate: any;
}

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	cardList: Card[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public paramValueProvider: ParamValueProvider,
		public loadingCtrl: LoadingController
	) {}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.loadHome();
	}

	loadHome() {
		let user: User = this.userProvider.user;

		let loading = presentLoading(this.loadingCtrl);
		this.paramValueProvider.getHome(user.userId, user.preferredLang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.cardList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}
}
