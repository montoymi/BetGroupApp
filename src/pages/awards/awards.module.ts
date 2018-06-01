import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AwardsPage } from './awards';

@NgModule({
	declarations: [
		AwardsPage
	],
	imports: [
		IonicPageModule.forChild(AwardsPage)
	],
	exports: [
		AwardsPage
	]
})
export class AwardsPageModule {}
