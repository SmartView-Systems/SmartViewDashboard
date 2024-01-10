import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import * as marked from 'marked';

@Component({
  selector: 'app-ai-analysis',
  templateUrl: './ai-analysis.component.html',
  styleUrls: ['./ai-analysis.component.css']
})
export class AiAnalysisComponent implements OnInit {
  deviceID: any; // Declare a variable to store the selected sensor data
  labApi: any;
  aiResponse: any = null;
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      this.deviceID = params['deviceID'];
      this.labApi = params['labApi'];
      console.log("DID: ", this.deviceID)
    });
    
    this.apiService.analyzeWithAI(this.labApi, this.deviceID).subscribe(
      (response) => {
        if (response.success) {
          console.log("SUCCESS");
          this.aiResponse = response.data;
          console.log(this.aiResponse);
        }
        else {
          console.log("Error when getting response");
        }
      },
      (error) => {
        console.log(error)
      }
    )

  }

  get htmlContent() {
    return marked.parse(this.aiResponse || '');
  }
}
