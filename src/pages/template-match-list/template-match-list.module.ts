import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { TemplateMatchListPage } from './template-match-list';

@NgModule({
	declarations: [
		TemplateMatchListPage
	],
	imports: [
		IonicPageModule.forChild(TemplateMatchListPage),
		TranslateModule.forChild()
	]
})
export class TemplateMatchListPageModule {}
