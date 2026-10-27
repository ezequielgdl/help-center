import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatPanel } from './assistant/chat-panel/chat-panel';

@Component({
  imports: [RouterOutlet, ChatPanel],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
