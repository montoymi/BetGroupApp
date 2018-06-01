import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ParticipantSavePage } from './participant-save';

@NgModule({
	declarations: [
		ParticipantSavePage
	],
	imports: [
		IonicPageModule.forChild(ParticipantSavePage),
		TranslateModule.forChild()
	],
	exports: [
		ParticipantSavePage
	]
})
export class ParticipantSavePageModule {}
