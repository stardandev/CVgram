import { UserDetailsFeatureKey } from './../../reducers/user-details.reducer';
import { AppUser } from './../../models/AppUser';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import * as fromUserDetailsStore from '../../reducers/user-details.reducer';
import { State, Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { deleteUserSession } from '../../actions/user-details.actions';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	public currentLanguage: string = '';
	public userLoggedIn: boolean;
	constructor(
		public translate: TranslateService,
		private _storage: StorageService,
		private _dialog: MatDialog,
		private globalStore: Store<fromGlobalStore.State>,
		private userDetailsStore: Store<fromUserDetailsStore.State>,
		private authService: AuthService,
		private router: Router
	) {
		this._storage.getCurrentLanguage()
			.subscribe(res => {
				if (res == 'fr' || res == 'fr-FR') {
					this.currentLanguage = 'French';
				} else {
					this.currentLanguage = 'English';
				}
			});

		let selectore = fromUserDetailsStore.UserDetailsFeatureKey as any;
		this.userDetailsStore.select(selectore)
			.subscribe(res => {
				this.userLoggedIn = res.user ? true : false;
			});

		// navigation bar 
		// $(window).scroll(function () {
		// 	var top = $(window).scrollTop();
		// 	if (top >= 40) {
		// 		$(".cv-mobile-navbar").addClass('secondary');
		// 	}
		// 	else {
		// 		if ($(".cv-mobile-navbar").hasClass('secondary')) {
		// 			$(".cv-mobile-navbar").removeClass('secondary');

		// 		};
		// 	}
		// });
		// $(window).scroll(function () {
		// 	var $w = $(this),
		// 		st = $w.scrollTop(),
		// 		navbar = $('.ftco_navbar'),
		// 		sd = $('.js-scroll-wrap');

		// 	if (st > 150) {
		// 		if (!navbar.hasClass('scrolled')) {
		// 			navbar.addClass('scrolled');
		// 		}
		// 	}
		// 	if (st < 150) {
		// 		if (navbar.hasClass('scrolled')) {
		// 			navbar.removeClass('scrolled sleep');
		// 		}
		// 	}
		// 	if (st > 350) {
		// 		if (!navbar.hasClass('awake')) {
		// 			navbar.addClass('awake');
		// 		}

		// 		if (sd.length > 0) {
		// 			sd.addClass('sleep');
		// 		}
		// 	}
		// 	if (st < 350) {
		// 		if (navbar.hasClass('awake')) {
		// 			navbar.removeClass('awake');
		// 			navbar.addClass('sleep');
		// 		}
		// 		if (sd.length > 0) {
		// 			sd.removeClass('sleep');
		// 		}
		// 	}
		// });
	}


	changeLanguage(language) {
		this._storage.updateCurrentLanuage(language);
		if (language == 'fr' || language == 'fr-FR') {
			this.translate.use('fr');
		} else {
			this.translate.use('en');
		}
	}

	signIn() {
		const dialogRef =	this._dialog.open(LoginComponent, {
			disableClose: true,
			data: null
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
					this.router.navigate(['/dashboard/cv']);
			}
		});
	}

	signUp() {
		const dialogRef = this._dialog.open(SignupComponent, {
			disableClose: true,
			data: null
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (res) {

			}
		});
	}

	logOut() {
		this.authService.logOut()
			.subscribe(res => {
				this.userDetailsStore.dispatch(deleteUserSession({}));
				this.router.navigate(['/']);
			});
	}

	navigateToHome() {
		if(this.userLoggedIn) {
			this.router.navigate(['/dashboard/cv'])
		}else {
			this.router.navigate(['/'])
		}
	}

}
