import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditCollectPage } from './credit-collect';

@NgModule({
	declarations: [
		CreditCollectPage
	],
	imports: [
		IonicPageModule.forChild(CreditCollectPage),
		TranslateModule.forChild()
	],
	exports: [
		CreditCollectPage
	]
})
export class CreditCollectPageModule {}
