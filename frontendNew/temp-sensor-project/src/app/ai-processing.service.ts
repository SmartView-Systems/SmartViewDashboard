import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
const openAI = require('openai');

@Injectable({
  providedIn: 'root'
})
export class AiProcessingService {

  constructor(
    private apiService: ApiService
  ) { }

  async analyze(labApi: string, deviceID: string) {
    let thread_id;
    let run_id;
    try {
      // Fetching input from API
      this.apiService.getAIInput(labApi, deviceID).subscribe(
        (response) => {
          if (response.success) {
            thread_id = response.data.thread_id;
            run_id = response.data.run_id;
          } else {
            console.error(response.message);
          }
        },
        (error) => {
          console.error('Error fetching ai input:', error);
        }
      )

      // Assistants AI Analysis
    } catch (err) {

    }
  }
}
