import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { UserSavePage } from './user-save';

@NgModule({
	declarations: [
		UserSavePage
	],
	imports: [
		IonicPageModule.forChild(UserSavePage),
		TranslateModule.forChild()
	],
	exports: [
		UserSavePage
	]
})
export class UserSavePageModule {}
