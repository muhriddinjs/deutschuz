export interface Question {
  id: string;
  display: string;
  expectedAnswer: string | string[]; // Can accept multiple valid formats
  feedbackType?: 'informell' | 'formell' | 'number' | 'none';
  meta?: any; // For extra data needed for feedback
}
