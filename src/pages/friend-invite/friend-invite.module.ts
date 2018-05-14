import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendInvitePage } from './friend-invite';

@NgModule({
	declarations: [
		FriendInvitePage
	],
	imports: [
		IonicPageModule.forChild(FriendInvitePage),
		TranslateModule.forChild()
	],
	exports: [
		FriendInvitePage
	]
})
export class FriendInvitePageModule {}
