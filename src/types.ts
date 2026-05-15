export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizSettings {
  currentClass: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  seed: string;
  limit: number;
  durationMinutes: number;
}

export interface QuizQuestion {
  question: string;
  has_image: boolean;
  image_prompt: string | null;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizResponse {
  step_info: {
    current_class: string;
    selected_subject: string;
    selected_topic: string;
    difficulty: string;
  };
  question_box: QuizQuestion;
  random_seed_used: string;
}

export enum AppStep {
  CLASS_SELECTION,
  SUBJECT_SELECTION,
  TOPIC_SELECTION,
  LEVEL_SELECTION,
  LENGTH_SELECTION,
  QUIZ_ACTIVE,
  QUIZ_RESULT
}
