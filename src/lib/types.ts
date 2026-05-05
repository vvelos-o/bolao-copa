export interface User { id: string; full_name: string; pin_hash: string; golden_boot: string | null; golden_ball: string | null; created_at: string; }
export interface Match { id: string; group_label: string | null; stage: "group"|"round16"|"quarter"|"semi"|"third"|"final"; home_team: string; away_team: string; home_flag: string; away_flag: string; venue: string; kickoff: string; home_score: number | null; away_score: number | null; is_completed: boolean; }
export interface Prediction { id: string; user_id: string; match_id: string; home_score: number; away_score: number; points_awarded: number | null; created_at: string; }
export interface RankedUser { id: string; full_name: string; total_points: number; exact_scores: number; correct_outcomes: number; predictions_made: number; }
