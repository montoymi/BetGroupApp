import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ChangePasswordPage } from './change-password';

@NgModule({
	declarations: [
		ChangePasswordPage
	],
	imports: [
		IonicPageModule.forChild(ChangePasswordPage),
		TranslateModule.forChild()
	],
	exports: [
		ChangePasswordPage
	]
})
export class ChangePasswordPageModule {}
