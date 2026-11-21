import { Component, Input, signal } from '@angular/core';
import { Member } from '../../core/data/bts.data';

@Component({
  selector: 'app-member-card',
  standalone: true,
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  @Input({ required: true }) member!: Member;
  photoOk = signal(true);
}