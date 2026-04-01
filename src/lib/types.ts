export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  visa_type: string;
  proposed_endeavor: string | null;
  soc_code: string | null;
  soc_title: string | null;
  location_city: string | null;
  location_state: string | null;
  company_name: string | null;
  company_type: string | null;
  naics_code: string | null;
  status: string;
  docs_folder_path: string | null;
  drive_folder_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  client_profiles?: ClientProfile | null;
}

export interface ClientProfile {
  id: string;
  client_id: string;
  full_name: string | null;
  nationality: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  education: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  work_experience: any[];
  total_years_experience: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evidence_inventory: any[];
  total_evidence_count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publications: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  media_coverage: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  awards: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  financial_data: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  satellite_letters_needed: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eb1a_criteria: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dhanasar_pillars: Record<string, any>;
  raw_extracted_text: string | null;
  extracted_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  doc_type: string;
  doc_subtype: string | null;
  version: number;
  status: string;
  system_used: string | null;
  output_file_path: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quality_score: Record<string, any>;
  quality_passed: boolean | null;
  quality_notes: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uscis_risk_score: Record<string, any>;
  generation_time_seconds: number | null;
  generated_at: string;
}

export interface ErrorRule {
  id: string;
  rule_type: string;
  doc_type: string | null;
  rule_description: string;
  rule_pattern: string | null;
  rule_action: string;
  auto_fix_replacement: string | null;
  severity: string;
  source: string;
  active: boolean;
  times_triggered: number;
  created_at: string;
  github_commit_sha: string | null;
}

export interface FileInventory {
  number: number;
  type: 'pdf' | 'docx' | 'image';
  file_path: string;
  file_name: string;
  description: string;
  size_bytes: number;
}

export interface ExtractionResult {
  prompt: string;
  inventory: FileInventory[];
  textExtracted: string;
  totalFiles: number;
  totalTextLength: number;
}

export interface GenerationResult {
  prompt: string;
  metadata: {
    system: string;
    version: string;
    rules_count: number;
    estimated_tokens: number;
    files_read: string[];
  };
}

export interface SystemConfig {
  name: string;
  symlinkDir: string;
  preferredModel: string;
  requiresProfile: boolean;
  requiresDeepResearch: boolean;
  outputFormat: 'docx' | 'pdf' | 'md' | 'pptx';
  estimatedTokens: number;
  multiAgent: boolean;
  sequentialPrompts?: number;
  heterogeneity?: boolean;
  skillFile?: string;
}
