package com.careerpilot.service.ai;

import com.careerpilot.domain.JobDescription;
import com.careerpilot.domain.MasterResume;
import com.careerpilot.domain.UserProfile;
import com.careerpilot.dto.JobDTOs.JDAnalysisResponse;
import com.careerpilot.dto.JobDTOs.JobMatchResponse;
import com.careerpilot.dto.ResumeDTOs.ATSAnalysisResult;
import com.careerpilot.dto.ResumeDTOs.TailoredResumeResult;
import com.careerpilot.dto.RoadmapDTOs.*;
import com.careerpilot.dto.InterviewDTOs.AnswerEvaluation;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MockAIProvider implements AIProvider {

    private static final List<String> TECH_DICTIONARY = List.of(
            "Java", "Spring Boot", "REST API", "SQL", "PostgreSQL", "MySQL", "Hibernate",
            "Microservices", "Docker", "Kubernetes", "AWS", "Kafka", "React", "TypeScript",
            "JavaScript", "HTML", "CSS", "Tailwind CSS", "Git", "Maven", "JUnit", "Mockito",
            "System Design", "OOP", "Data Structures", "Algorithms", "Redis"
    );

    @Override
    public ATSAnalysisResult analyzeResume(String rawText) {
        String lower = rawText != null ? rawText.toLowerCase() : "";
        List<String> detected = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String tech : TECH_DICTIONARY) {
            if (lower.contains(tech.toLowerCase())) {
                detected.add(tech);
            } else {
                missing.add(tech);
            }
        }

        int skillsScore = Math.min(95, Math.max(50, detected.size() * 8));
        int keywordsScore = Math.min(98, Math.max(55, detected.size() * 7 + 25));
        int experienceScore = lower.contains("experience") || lower.contains("developed") || lower.contains("built") ? 85 : 65;
        int projectsScore = lower.contains("project") || lower.contains("github") ? 88 : 60;
        int formattingScore = lower.contains("@") && lower.contains("phone") || lower.contains("email") ? 92 : 75;
        int overall = (skillsScore + keywordsScore + experienceScore + projectsScore + formattingScore) / 5;

        List<String> suggestions = List.of(
                "Ensure standard bullet points under work experience.",
                "Use measurable impact metrics (e.g., 'Improved API performance by 35%').",
                "Ensure your GitHub and LinkedIn links are explicitly listed at the top."
        );

        List<String> recommendations = List.of(
                "Add REST API and Spring Boot experience to your skills section if it accurately reflects your background.",
                "Include concrete system design details in your top 2 projects.",
                "Verify standard font hierarchy and ATS readable section headings."
        );

        return ATSAnalysisResult.builder()
                .overallAtsScore(overall)
                .keywordsScore(keywordsScore)
                .skillsScore(skillsScore)
                .experienceScore(experienceScore)
                .projectsScore(projectsScore)
                .formattingScore(formattingScore)
                .detectedSkills(detected)
                .missingKeywords(missing.subList(0, Math.min(5, missing.size())))
                .formattingSuggestions(suggestions)
                .actionableRecommendations(recommendations)
                .build();
    }

    @Override
    public TailoredResumeResult generateTailoredResume(MasterResume masterResume, JobDescription job) {
        String rawResume = masterResume != null && masterResume.getRawText() != null ? masterResume.getRawText() : "";
        String rawJd = job != null && job.getRawJdText() != null ? job.getRawJdText() : "";

        String candidateName = extractCandidateName(rawResume);
        String targetTitle = job != null && job.getJobTitle() != null && !job.getJobTitle().isBlank()
                ? job.getJobTitle() : extractJobTitle(rawJd);
        String companyName = job != null && job.getCompanyName() != null && !job.getCompanyName().isBlank()
                ? job.getCompanyName() : extractCompanyName(rawJd);

        List<String> matchedSkills = extractSkills(rawResume, rawJd);

        String topTechStr = matchedSkills.size() >= 3 
                ? String.join(", ", matchedSkills.subList(0, Math.min(4, matchedSkills.size())))
                : "Java 17, Spring Boot 3, and REST APIs";

        String optimizedSummary = String.format(
                "Results-driven %s with 3+ years of production software engineering experience specializing in %s. " +
                "Demonstrated track record of architecting high-throughput microservices, optimizing PostgreSQL query performance by up to 45%%, and deploying zero-downtime containerized cloud applications tailored for %s's engineering team.",
                targetTitle, topTechStr, companyName
        );

        List<String> bullets = new ArrayList<>();
        bullets.add(String.format(
                "Architected and deployed production-grade %s REST microservices using %s, handling 100,000+ daily active API requests with sub-100ms P99 latency.",
                targetTitle, matchedSkills.size() >= 2 ? String.join(" and ", matchedSkills.subList(0, 2)) : "Spring Boot 3 and Java 17"
        ));
        bullets.add("Optimized SQL query execution plans, JPA ORM caching, and database indexing, reducing response latency by 45% and lowering database CPU load.");
        bullets.add("Engineered automated CI/CD deployment pipelines utilizing Docker containers and Kubernetes, accelerating software release velocity by 60%.");
        bullets.add("Implemented stateless JWT authentication filters and role-based access control (RBAC), ensuring 100% security compliance across REST endpoints.");
        bullets.add("Collaborated with cross-functional product teams to design responsive, scalable web interfaces with robust API integration.");

        List<String> projects = List.of(
                "AI Career Operating System — Production SaaS platform with automated ATS resume parser, JD matcher, and mock interview simulator.",
                "High-Throughput Microservices Platform — Distributed order processing microservice engine built with Spring Boot, PostgreSQL, Kafka, and Docker."
        );

        return TailoredResumeResult.builder()
                .candidateName(candidateName)
                .optimizedSummary(optimizedSummary)
                .reorderedSkills(matchedSkills)
                .tailoredExperienceBullets(bullets)
                .highlightedProjects(projects)
                .matchingKeywordsAdded(matchedSkills.subList(0, Math.min(5, matchedSkills.size())))
                .build();
    }

    private String extractCandidateName(String text) {
        if (text == null || text.isBlank()) return "Alex Morgan";
        String[] lines = text.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() > 2 && trimmed.length() < 40 
                    && !trimmed.toLowerCase().contains("summary") 
                    && !trimmed.toLowerCase().contains("resume") 
                    && !trimmed.contains("@") 
                    && !trimmed.contains("http")) {
                return trimmed.replaceAll("[^a-zA-Z\\s.]", "");
            }
        }
        return "Alex Morgan";
    }

    private String extractJobTitle(String jdText) {
        if (jdText == null || jdText.isBlank()) return "Senior Java Backend Engineer";
        String lower = jdText.toLowerCase();
        if (lower.contains("full stack") || lower.contains("fullstack")) return "Full Stack Software Engineer";
        if (lower.contains("frontend") || lower.contains("react") || lower.contains("angular")) return "Senior Frontend Engineer";
        if (lower.contains("backend") || lower.contains("java") || lower.contains("spring")) return "Senior Java Backend Engineer";
        if (lower.contains("devops") || lower.contains("cloud")) return "Cloud DevOps Engineer";
        if (lower.contains("data engineer")) return "Senior Data Engineer";
        if (lower.contains("python")) return "Senior Python Engineer";
        return "Senior Software Engineer";
    }

    private String extractCompanyName(String jdText) {
        if (jdText == null || jdText.isBlank()) return "Stripe";
        String lower = jdText.toLowerCase();
        if (lower.contains("stripe")) return "Stripe";
        if (lower.contains("datadog")) return "Datadog";
        if (lower.contains("google")) return "Google";
        if (lower.contains("amazon") || lower.contains("aws")) return "Amazon";
        if (lower.contains("microsoft")) return "Microsoft";
        if (lower.contains("meta")) return "Meta";
        return "Tech Global";
    }

    private List<String> extractSkills(String resumeText, String jdText) {
        String combined = (resumeText + " " + jdText).toLowerCase();
        List<String> list = new ArrayList<>();
        
        List<String> catalog = List.of(
                "Java 17", "Spring Boot 3", "REST APIs", "SQL", "PostgreSQL", 
                "Docker", "Kubernetes", "AWS", "Kafka", "React.js", "TypeScript", 
                "Microservices", "Git", "Redis", "Python", "Node.js", "GraphQL", "CI/CD"
        );

        for (String item : catalog) {
            String clean = item.split(" ")[0].toLowerCase();
            if (combined.contains(clean)) {
                list.add(item);
            }
        }

        if (list.size() < 5) {
            list = List.of("Java 17", "Spring Boot 3", "REST APIs", "SQL / PostgreSQL", "Docker", "React.js", "Git");
        }

        return list;
    }

    @Override
    public JDAnalysisResponse analyzeJD(String rawJdText, String title, String company) {
        String text = (rawJdText != null ? rawJdText : "").toLowerCase();
        
        List<String> mustHave = new ArrayList<>();
        List<String> goodToHave = new ArrayList<>();
        
        for (String tech : TECH_DICTIONARY) {
            if (text.contains(tech.toLowerCase())) {
                if (mustHave.size() < 5) mustHave.add(tech);
                else goodToHave.add(tech);
            }
        }
        
        if (mustHave.isEmpty()) {
            mustHave = List.of("Java", "Spring Boot", "REST API", "SQL");
            goodToHave = List.of("Docker", "AWS", "Kafka", "React");
        }

        return JDAnalysisResponse.builder()
                .jobTitle(title != null && !title.isBlank() ? title : "Java Full Stack Developer")
                .companyName(company != null && !company.isBlank() ? company : "Tech Corp")
                .location("Remote / San Francisco, CA")
                .experienceRequired("2 - 5 Years")
                .salaryRange("$90,000 - $130,000")
                .mustHaveSkills(mustHave)
                .goodToHaveSkills(goodToHave)
                .responsibilities(List.of(
                        "Design and implement scalable backend APIs using Java and Spring Boot.",
                        "Collaborate with cross-functional teams to build responsive frontend interfaces.",
                        "Write unit and integration tests using JUnit 5 and Mockito.",
                        "Participate in agile code reviews and maintain clean architecture standards."
                ))
                .extractedKeywords(List.of("Java", "Spring Boot", "REST API", "SQL", "Microservices", "Docker", "Git"))
                .build();
    }

    @Override
    public JobMatchResponse matchJob(UserProfile profile, MasterResume resume, JobDescription job) {
        int matchScore = 87;
        int readinessScore = 78;

        return JobMatchResponse.builder()
                .jobId(job != null ? job.getId() : 1L)
                .jobTitle(job != null ? job.getJobTitle() : "Java Developer")
                .companyName(job != null ? job.getCompanyName() : "Tech Global")
                .matchScore(matchScore)
                .readinessScore(readinessScore)
                .techSkillsMatch(90)
                .experienceMatch(80)
                .educationMatch(95)
                .projectsMatch(85)
                .keywordsMatch(88)
                .missingSkills(List.of("Docker Containerization", "AWS S3 / EC2"))
                .weakSkills(List.of("Kafka Event Streaming", "System Design Scalability"))
                .strongSkills(List.of("Java 17 Core", "Spring Boot 3 REST", "SQL Query Optimization", "React Frontend"))
                .top3ActionItems(List.of(
                        "Complete Docker containerization tutorial and build a sample Dockerfile.",
                        "Review System Design caching strategies using Redis.",
                        "Practice 3 mock interview questions on Java Concurrency and Multithreading."
                ))
                .build();
    }

    @Override
    public RoadmapResponse generateLearningRoadmap(UserProfile profile, MasterResume resume) {
        RoadmapTask t1 = RoadmapTask.builder()
                .id("t1")
                .topic("Java 17 & OOP Fundamentals")
                .objective("Master modern Java features including Records, Sealed Classes, and Pattern Matching.")
                .subtopics(List.of("Records & Sealed Interfaces", "Streams API & Collectors", "Optional & Exception Handling"))
                .practiceTasks(List.of("Implement a custom Stream filter", "Refactor anonymous classes to Lambdas"))
                .interviewQuestions(List.of("What is the difference between final, finally, and finalize?", "How do Java 17 Records work under the hood?"))
                .miniProject("Build a CLI Banking Transaction Processor")
                .isCompleted(true)
                .build();

        RoadmapTask t2 = RoadmapTask.builder()
                .id("t2")
                .topic("Spring Boot 3 & REST API Architecture")
                .objective("Build production-ready RESTful web services with DTOs and Validation.")
                .subtopics(List.of("Spring MVC Controllers & Request Mapping", "Spring Data JPA & Hibernate", "Global Exception Handling (@ControllerAdvice)"))
                .practiceTasks(List.of("Create a CRUD REST API for Employee Management", "Add Bean Validation annotations"))
                .interviewQuestions(List.of("Explain Spring Bean Lifecycle.", "What is Dependency Injection and how does Spring implement it?"))
                .miniProject("Build an E-Commerce Product Catalog REST Service")
                .isCompleted(false)
                .build();

        RoadmapTask t3 = RoadmapTask.builder()
                .id("t3")
                .topic("Spring Security & JWT Authentication")
                .objective("Secure REST endpoints using stateless JWT token authentication.")
                .subtopics(List.of("SecurityFilterChain configuration", "JwtAuthenticationFilter", "Password Hashing with BCrypt"))
                .practiceTasks(List.of("Implement Login & Register endpoints", "Secure API routes based on User Roles"))
                .interviewQuestions(List.of("How does JWT token verification work?", "What is the role of SecurityContextHolder?"))
                .miniProject("Build User Authentication Microservice")
                .isCompleted(false)
                .build();

        RoadmapTask t4 = RoadmapTask.builder()
                .id("t4")
                .topic("SQL Optimization & Relational Database Design")
                .objective("Write high-performance SQL queries and configure JPA indexes.")
                .subtopics(List.of("PostgreSQL Indexing & Execution Plans", "JPA N+1 Problem & EntityGraph", "Database Transactions (@Transactional)"))
                .practiceTasks(List.of("Optimize a slow JOIN query", "Configure composite database indexes"))
                .interviewQuestions(List.of("How do you resolve the JPA N+1 select issue?", "What are ACID properties in SQL?"))
                .miniProject("Build High-Throughput Analytics Schema")
                .isCompleted(false)
                .build();

        WeeklyPlan w1 = WeeklyPlan.builder().weekNumber(1).weekTitle("Core Java & OOP").tasks(List.of(t1)).build();
        WeeklyPlan w2 = WeeklyPlan.builder().weekNumber(2).weekTitle("Spring Boot & REST").tasks(List.of(t2)).build();
        WeeklyPlan w3 = WeeklyPlan.builder().weekNumber(3).weekTitle("Spring Security & JWT").tasks(List.of(t3)).build();
        WeeklyPlan w4 = WeeklyPlan.builder().weekNumber(4).weekTitle("SQL & Database Performance").tasks(List.of(t4)).build();

        ProjectRecommendation p1 = ProjectRecommendation.builder()
                .title("AI Career Operating System (SaaS)")
                .problemStatement("Job seekers struggle to align their resumes with real job descriptions and track applications effectively.")
                .keyFeatures(List.of("ATS Resume Analysis", "JD Matching Engine", "Dynamic AI Mock Interviews", "Kanban Application Tracker"))
                .architecture("Modular Spring Boot 3 Backend + React Glassmorphism Frontend")
                .techStack("Java 17, Spring Boot, Spring Security, JWT, React, Tailwind CSS, Recharts")
                .apiEndpoints(List.of("POST /api/resumes/analyze-ats", "POST /api/jobs/match", "POST /api/interviews/respond"))
                .resumeBulletPoints(List.of(
                        "Engineered full-stack AI SaaS platform utilizing Java 17 Spring Boot microservices and React TypeScript.",
                        "Designed automated ATS parser analyzing 25+ technical keywords with sub-200ms processing times."
                ))
                .interviewExplanation("Explain how JWT stateless authentication was configured using Spring Security 3 FilterChain and custom filters.")
                .build();

        return RoadmapResponse.builder()
                .roadmapId(1L)
                .targetRole("Java Full Stack Developer")
                .durationWeeks(4)
                .progressPercent(25)
                .weeklyPlans(List.of(w1, w2, w3, w4))
                .recommendedProjects(List.of(p1))
                .build();
    }

    @Override
    public AnswerEvaluation evaluateInterviewAnswer(String interviewType, String questionText, String userAnswer, int questionIndex) {
        String answer = userAnswer != null ? userAnswer.toLowerCase() : "";
        
        List<String> fillerWordsFound = new ArrayList<>();
        String[] fillers = {"like", "um", "uh", "you know", "basically", "actually", "literally"};
        for (String f : fillers) {
            if (answer.contains(f)) {
                fillerWordsFound.add(f);
            }
        }

        int score = 70;
        if (answer.length() > 60) score += 15;
        if (answer.contains("spring") || answer.contains("java") || answer.contains("database") || answer.contains("api") || answer.contains("class")) score += 10;
        score = Math.min(96, score);

        String feedback = "Good explanation of core concepts. Make sure to emphasize practical hands-on production experience.";
        String grammarFeedback = fillerWordsFound.isEmpty() ? 
                "Excellent vocabulary and clear structure without unnecessary filler words." :
                "Watch out for filler words such as: " + String.join(", ", fillerWordsFound) + ". Aim for concise, direct statements.";

        String improvedAnswer = "In my previous experience, I implemented " + (interviewType != null ? interviewType : "software engineering") + 
                " principles by adhering to clean architecture, writing comprehensive unit tests, and optimizing response latency.";

        String nextQuestion = switch (questionIndex) {
            case 0 -> "How do you handle transactional rollback in Spring Boot using @Transactional?";
            case 1 -> "What strategies do you use to resolve JPA N+1 select performance issues?";
            case 2 -> "How do you design a stateless JWT authentication system for microservices?";
            default -> "Congratulations! You have completed all technical interview questions.";
        };

        return AnswerEvaluation.builder()
                .score(score)
                .feedback(feedback)
                .technicalClarity("High — Technical terminology used correctly.")
                .grammarFeedback(grammarFeedback)
                .detectedFillerWords(fillerWordsFound)
                .improvedExampleAnswer(improvedAnswer)
                .practiceSuggestion("Practice stating your answer within 60 seconds with clear problem-solution-result framing.")
                .nextQuestionText(nextQuestion)
                .isFinalQuestion(questionIndex >= 3)
                .build();
    }

    @Override
    public String generateOutreachMessage(UserProfile profile, JobDescription job, String type) {
        String company = job != null && job.getCompanyName() != null ? job.getCompanyName() : "Tech Company";
        String title = job != null && job.getJobTitle() != null ? job.getJobTitle() : "Java Developer";
        String name = profile != null && profile.getUserId() != null ? "John Doe" : "Candidate";

        if ("RECRUITER_EMAIL".equalsIgnoreCase(type)) {
            return "Subject: Experienced " + title + " — Application Inquiry for " + company + "\n\n" +
                    "Dear Hiring Team,\n\n" +
                    "I am writing to express my strong interest in the " + title + " position at " + company + ". " +
                    "With hands-on experience in Java 17, Spring Boot microservices, REST APIs, and database performance optimization, " +
                    "I am confident in my ability to deliver immediate value to your engineering team.\n\n" +
                    "Best regards,\n" + name;
        } else if ("LINKEDIN".equalsIgnoreCase(type)) {
            return "Hi! I noticed " + company + " is hiring for a " + title + ". " +
                    "I specialize in Java, Spring Boot, and scalable API architecture and would love to connect and learn more about the team's engineering goals!";
        } else {
            return "Dear Hiring Manager at " + company + ",\n\n" +
                    "Please accept my application for the " + title + " role. " +
                    "I bring proven experience building high-performance backend systems and responsive web applications.\n\n" +
                    "Sincerely,\n" + name;
        }
    }

    @Override
    public String chatCareerCoach(UserProfile profile, MasterResume resume, String userMessage) {
        String msg = userMessage != null ? userMessage.toLowerCase() : "";

        if (msg.contains("resume") || msg.contains("ats")) {
            return "Based on your Master Resume analysis, your current ATS Score is **85/100**. To reach 90+, consider adding measurable impact metrics to your top 2 projects and ensuring keywords like **Spring Boot 3** and **Docker** are clearly listed.";
        } else if (msg.contains("learn") || msg.contains("roadmap") || msg.contains("skill")) {
            return "Your primary skill gap for target role **Java Full Stack Developer** is **Docker containerization** and **AWS deployment**. I recommend focusing on Week 3 of your Personalized Learning Roadmap!";
        } else if (msg.contains("interview") || msg.contains("ready")) {
            return "You're in great shape! Your technical readiness score is **78%**. I recommend taking a 10-minute AI Mock Interview in Spring Boot to boost your confidence before tomorrow's call.";
        } else {
            return "Hello! I am your AI Career Coach. I am reviewing your profile, resume, and active application pipeline. How can I assist your career search today?";
        }
    }
}
