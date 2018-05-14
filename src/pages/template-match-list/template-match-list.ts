import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { TemplateProvider } from '../../providers/providers';
import { TemplateDetail } from '../../models/template/template-detail';
import { presentToast } from '../pages';

@IonicPage()
@Component({
	selector: 'page-template-match-list',
	templateUrl: 'template-match-list.html'
})
export class TemplateMatchListPage {
	templateDetailList: TemplateDetail[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl: ToastController,
		public templateProvider: TemplateProvider
	) {
		this.loadTemplateDetails();
	}

	loadTemplateDetails() {
		let templateId: number = this.navParams.get('templateId');

		this.templateProvider.getTemplateDetailsByTempHeaderId(templateId).subscribe(
			(res: any) => {
				this.templateDetailList = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	filter(ev) {
		// set val to the value of the ev target
		let name: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (name && name.trim() != '') {
			this.templateDetailList = this.templateDetailList.filter(templateDetail => {
				return templateDetail.match.localTeam.teamName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadTemplateDetails();
		}
	}

	cancel() {
		this.viewCtrl.dismiss();
	}
}
