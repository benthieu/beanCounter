import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ElectronService} from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
    private electronService: ElectronService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.electronService.ipcRenderer.send('downloadYT', {link: 'https://www.youtube.com/watch?v=vBtYtWlO8Kg'});
    this.electronService.ipcRenderer.on('downloadYTProcess', (event, data) => {
      console.log('data', data);
    })
  }

}
