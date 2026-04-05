import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../service/RoomService/room-service';
import { RoomState } from '../../../service/RoomState/room-state';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-card.html',
  styleUrls: ['./room-card.css'],
})
export class RoomCard implements OnInit, OnChanges {

  @Input() hotelId!: number;

  constructor(
    private roomServ: RoomService,
    public roomStat: RoomState,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hotelId'] && !changes['hotelId'].firstChange) {
      this.loadRooms();
    }
  }

  seeMore(id:number){
    this.router.navigate(["/room-detail",id])
  }
  editRoom(id: number) {
    console.log('Navigating to room-edit:', id);
    this.router.navigate(['/room-edit', id]);
  }
  loadRooms() {
    if (!this.hotelId) return;
    
    this.roomStat.clearRooms();
    this.roomServ.getAllRoom().subscribe({
      next: (res) => {
        const filtered = res.filter(r => r.hotelId === this.hotelId);
        this.roomStat.setRoom(filtered);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  delete(id:number){
    this.roomServ.deleteRoom(id).subscribe({
      next:()=>{
        this.roomStat.removeRoom(id);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }
}
