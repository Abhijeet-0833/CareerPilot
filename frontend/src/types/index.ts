export type UserRole = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN' | 'COLLEGE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  token?: string;
}

export interface UserProfile {
  id?: number;
  userId?: number;
  phone?: string;
  location?: string;
  preferredLocations?: string;
  experienceYears?: number;
  education?: string;
  technicalSkills?: string;
  softSkills?: string;
  targetRole?: string;
  expectedSalary?: number;
  workPreference?: string;
  noticePeriod?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary?: string;
}

export interface ATSAnalysisResult {
  resumeId: number;
  overallAtsScore: number;
  keywordsScore: number;
  skillsScore: number;
  experienceScore: number;
  projectsScore: number;
  formattingScore: number;
  readabilityScore?: number;
  detectedSkills: string[];
  missingKeywords: string[];
  formattingSuggestions: string[];
  actionableRecommendations: string[];
}

export interface DiffItem {
  id: string;
  changeType: string; // ADDED (green), MODIFIED (yellow), REMOVED (red)
  section: string;
  originalText: string;
  optimizedText: string;
  accepted: boolean;
}

export interface SkillConfirmationItem {
  skillName: string;
  priority: string; // HIGH, MEDIUM, LOW
  inResume: boolean;
  inJd: boolean;
  userConfirmed: boolean;
  recommendationNote: string;
}

export interface StructureAnalysisResult {
  sectionsDetected: string[];
  missingSections: string[];
  hasAtsUnfriendlyFormatting: boolean;
  formattingAlerts: string[];
}

export interface ScoreComparisonResult {
  beforeAtsScore: number;
  afterAtsScore: number;
  scoreImprovement: number; // e.g. +17 ATS Improvement
  beforeCategoryScores: Record<string, number>;
  afterCategoryScores: Record<string, number>;
  keywordsAdded: string[];
  scoreImprovementExplanations: string[];
}

export interface QualityCheckResult {
  passed: boolean;
  missingContactInfo: boolean;
  brokenLinks: string[];
  duplicateBulletPoints: string[];
  spellingGrammarWarnings: string[];
  formattingIssues: string[];
}

export interface TailoredResumeResult {
  candidateName: string;
  optimizedSummary: string;
  reorderedSkills: string[];
  tailoredExperienceBullets: string[];
  highlightedProjects: string[];
  matchingKeywordsAdded: string[];
  proposedDiffs?: DiffItem[];
  scoreComparison?: ScoreComparisonResult;
}

export interface ResumeVersionDTO {
  id: number;
  userId: number;
  versionName: string;
  targetRole: string;
  companyName: string;
  templateName: string;
  originalAtsScore: number;
  optimizedAtsScore: number;
  tailoredText?: string;
  createdAt: string;
}

export interface ResumeAnalysisHistoryDTO {
  id: number;
  targetJobTitle: string;
  companyName: string;
  beforeAtsScore: number;
  afterAtsScore: number;
  scoreImprovement: number;
  createdAt: string;
}

export interface MarketSkillAnalytics {
  targetRole: string;
  totalJDsAnalyzed: number;
  topSkillsDemand: Record<string, number>;
  highDemandKeywords: string[];
}

export interface JDAnalysisResponse {
  jobId: number;
  jobTitle: string;
  companyName: string;
  location: string;
  experienceRequired: string;
  salaryRange: string;
  mustHaveSkills: string[];
  goodToHaveSkills: string[];
  responsibilities: string[];
  extractedKeywords: string[];
}

export interface JobMatchResponse {
  matchId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  readinessScore: number;
  techSkillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  projectsMatch: number;
  keywordsMatch: number;
  missingSkills: string[];
  weakSkills: string[];
  strongSkills: string[];
  top3ActionItems: string[];
}

export interface RoadmapTask {
  id: string;
  topic: string;
  objective: string;
  subtopics: string[];
  practiceTasks: string[];
  interviewQuestions: string[];
  miniProject: string;
  isCompleted: boolean;
}

export interface WeeklyPlan {
  weekNumber: number;
  weekTitle: string;
  tasks: RoadmapTask[];
}

export interface ProjectRecommendation {
  title: string;
  problemStatement: string;
  keyFeatures: string[];
  architecture: string;
  techStack: string;
  apiEndpoints: string[];
  resumeBulletPoints: string[];
  interviewExplanation: string;
}

export interface RoadmapResponse {
  roadmapId: number;
  targetRole: string;
  durationWeeks: number;
  progressPercent: number;
  weeklyPlans: WeeklyPlan[];
  recommendedProjects: ProjectRecommendation[];
}

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'ASSESSMENT' | 'INTERVIEW' | 'HR' | 'OFFER' | 'REJECTED';

export interface ApplicationItem {
  id: number;
  userId: number;
  companyName: string;
  jobTitle: string;
  location?: string;
  salaryRange?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  followUpDate?: string;
  contactPerson?: string;
  notes?: string;
  jdText?: string;
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  technicalClarity: string;
  grammarFeedback: string;
  detectedFillerWords: string[];
  improvedExampleAnswer: string;
  practiceSuggestion: string;
  nextQuestionText: string;
  isFinalQuestion: boolean;
}

export interface FinalEvaluationResponse {
  sessionId: number;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  keyStrengths: string[];
  areasToImprove: string[];
  summaryFeedback: string;
}

export interface SubscriptionStatus {
  id: number;
  userId: number;
  planTier: 'FREE' | 'PRO' | 'PREMIUM' | 'BUSINESS' | 'COLLEGE';
  status: string;
  pricePaid: number;
  expiresAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  readStatus: boolean;
  actionUrl?: string;
  createdAt: string;
}
