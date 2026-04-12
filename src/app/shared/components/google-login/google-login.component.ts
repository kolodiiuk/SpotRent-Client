import { Component, EventEmitter, Output, OnInit, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';

declare const google: any;

@Component({
    selector: 'app-google-login',
    standalone: true,
    templateUrl: './google-login.component.html',
    styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit, OnDestroy {
    @Input() clientId: string = '103104858818-jb3c2g0a3jkflgfif33vsjv66vcm8nrp.apps.googleusercontent.com';
    @Output() success = new EventEmitter<string>();
    @Output() error = new EventEmitter<any>();

    @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;

    private scriptId = 'google-jssdk';

    ngOnInit(): void {
        if (typeof google === 'undefined' || !google.accounts) {
            this.loadGoogleScript();
        } else {
            this.initGoogleAuth();
        }
    }

    ngOnDestroy(): void {
    }

    private loadGoogleScript(): void {
        if (document.getElementById(this.scriptId)) {
            return;
        }

        const script = document.createElement('script');
        script.id = this.scriptId;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.initGoogleAuth();
        script.onerror = () => this.error.emit('Failed to load Google script');
        document.head.appendChild(script);
    }

    private initGoogleAuth(): void {
        try {
            google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleCredentialResponse.bind(this)
            });

            google.accounts.id.renderButton(
                this.googleBtn.nativeElement,
                { theme: 'outline', size: 'large', width: '100%' }
            );
        } catch (err) {
            this.error.emit(err);
        }
    }

    private handleCredentialResponse(response: any): void {
        if (response && response.credential) {
            this.success.emit(response.credential);
        } else {
            this.error.emit('Invalid Google credential response');
        }
    }
}
