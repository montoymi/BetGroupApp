import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditAddPage } from './credit-add';

@NgModule({
	declarations: [
		CreditAddPage
	],
	imports: [
		IonicPageModule.forChild(CreditAddPage),
		TranslateModule.forChild()
	],
	exports: [
		CreditAddPage
	]
})
export class CreditAddPageModule {}
