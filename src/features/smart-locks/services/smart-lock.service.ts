import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmartLockService {
  private apiUrl: string = `${environment.serverApiUrl}/iot`
}
