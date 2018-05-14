import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ParticipantListPage } from './participant-list';

@NgModule({
	declarations: [
		ParticipantListPage
	],
	imports: [
		IonicPageModule.forChild(ParticipantListPage),
		TranslateModule.forChild()
	],
	exports: [
		ParticipantListPage
	]
})
export class ParticipantListPageModule {}
