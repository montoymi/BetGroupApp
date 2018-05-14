import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { RulesPage } from './rules';

@NgModule({
	declarations: [
		RulesPage
	],
	imports: [
		IonicPageModule.forChild(RulesPage),
		TranslateModule.forChild()
	],
	exports: [
		RulesPage
	]
})
export class RulesPageModule {}
