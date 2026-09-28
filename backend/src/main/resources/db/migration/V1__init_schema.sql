-- CareerPilot Initial Schema Migration V1
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'JOB_SEEKER',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone VARCHAR(50),
    location VARCHAR(255),
    preferred_locations VARCHAR(255),
    experience_years INT,
    education VARCHAR(255),
    technical_skills TEXT,
    soft_skills TEXT,
    target_role VARCHAR(255),
    expected_salary DOUBLE PRECISION,
    work_preference VARCHAR(50),
    notice_period VARCHAR(50),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    summary TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS master_resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255),
    raw_text TEXT,
    parsed_skills_json TEXT,
    experience_json TEXT,
    projects_json TEXT,
    education_json TEXT,
    ats_score INT,
    keywords_score INT,
    skills_score INT,
    experience_score INT,
    projects_score INT,
    formatting_score INT,
    recommendations_json TEXT,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_descriptions (
    id BIGSERIAL PRIMARY KEY,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    location VARCHAR(255),
    experience_required VARCHAR(100),
    salary_range VARCHAR(100),
    raw_jd_text TEXT,
    must_have_skills_json TEXT,
    good_to_have_skills_json TEXT,
    responsibilities_json TEXT,
    keywords_json TEXT,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'SAVED',
    applied_date VARCHAR(50),
    follow_up_date VARCHAR(50),
    contact_person VARCHAR(255),
    notes TEXT,
    jd_text TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
