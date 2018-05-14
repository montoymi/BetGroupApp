import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { FriendListPage } from './friend-list';

@NgModule({
	declarations: [
		FriendListPage
	],
	imports: [
		IonicPageModule.forChild(FriendListPage),
		TranslateModule.forChild()
	],
	exports: [
		FriendListPage
	]
})
export class FriendListPageModule {}
