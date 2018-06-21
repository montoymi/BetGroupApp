import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareAppPage } from './share-app';

@NgModule({
	declarations: [
		ShareAppPage
	],
	imports: [
		IonicPageModule.forChild(ShareAppPage),
		TranslateModule.forChild()
	],
	exports: [
		ShareAppPage
	]
})
export class ShareAppPageModule {}
