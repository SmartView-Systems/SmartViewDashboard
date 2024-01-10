import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-sensor-modal',
  templateUrl: './edit-sensor-modal.component.html',
  styleUrls: ['./edit-sensor-modal.component.css'],
})
export class EditSensorModalComponent {
  @Input() editedSensor: any;
  @Output() saveChangesEvent = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  editedSensorCopy: any;

  sendTemp: any;
  sendHum: any;
  sendCO: any;
  sendAlc: any;
  sendCO2: any;
  sendTol: any;
  sendNH4: any;
  sendAct: any;

  ngOnInit() {
    this.editedSensorCopy = { ...this.editedSensor };
    this.sendTemp = !!parseInt(this.editedSensor.SendData[0]);
    this.sendHum = !!parseInt(this.editedSensor.SendData[1]);
    this.sendCO = !!parseInt(this.editedSensor.SendData[2]);
    this.sendCO2 = !!parseInt(this.editedSensor.SendData[2]);
    this.sendAlc = !!parseInt(this.editedSensor.SendData[4]);
    this.sendTol = !!parseInt(this.editedSensor.SendData[5]);
    this.sendNH4 = !!parseInt(this.editedSensor.SendData[6]);
    this.sendAct = !!parseInt(this.editedSensor.SendData[7]);
  }

  boolToIntString(boolIn: boolean): string {
    let stringOut = boolIn ? '1' : '0';
    return stringOut;
  }

  saveChanges(): void {
    let updatedSendData = this.boolToIntString(this.sendTemp) + this.boolToIntString(this.sendHum) + this.boolToIntString(this.sendCO) + this.boolToIntString(this.sendAlc) + this.boolToIntString(this.sendCO2) + this.boolToIntString(this.sendTol) + this.boolToIntString(this.sendNH4) + this.boolToIntString(this.sendAct);
    console.log("Updated Send Data: ", updatedSendData);
    this.editedSensorCopy = { ...this.editedSensor };
    this.editedSensorCopy.SendData = updatedSendData;

    this.saveChangesEvent.emit(this.editedSensorCopy);
  }

  closeModal(): void {
    // Implement your logic to close the modal
    this.closeModalEvent.emit();
  }
}
