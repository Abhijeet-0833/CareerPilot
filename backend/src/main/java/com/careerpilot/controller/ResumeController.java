package com.careerpilot.controller;

import com.careerpilot.domain.MasterResume;
import com.careerpilot.dto.ResumeDTOs.*;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@Tag(name = "Advanced AI Resume Engine", description = "PDF/DOCX parser, ATS score analyzer, Diff generator, Version control, and Quality check APIs")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload-analyze")
    @Operation(summary = "Upload raw resume text and execute ATS score analysis")
    public ResponseEntity<ATSAnalysisResult> uploadAndAnalyze(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ResumeUploadRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.uploadAndAnalyzeResume(userId, request));
    }

    @PostMapping(value = "/upload-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload binary PDF/DOCX file for text extraction and ATS analysis")
    public ResponseEntity<ATSAnalysisResult> uploadFile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.uploadAndAnalyzeFile(userId, file));
    }

    @PostMapping("/analyze-structure")
    @Operation(summary = "Analyze resume section hierarchy and detect ATS-unfriendly formatting (tables, text boxes, images)")
    public ResponseEntity<StructureAnalysisResult> analyzeStructure(@RequestBody String rawText) {
        return ResponseEntity.ok(resumeService.analyzeStructure(rawText));
    }

    @PostMapping("/skill-confirmation")
    @Operation(summary = "Generate truthful keyword confirmation list (categorize HIGH/MEDIUM/LOW priority without fabricating experience)")
    public ResponseEntity<List<SkillConfirmationItem>> getSkillConfirmation(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody TailoredResumeRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        MasterResume master = resumeService.getMasterResume(userId);
        return ResponseEntity.ok(resumeService.getSkillConfirmationItems(master.getRawText(), request.getTargetJdText()));
    }

    @PostMapping("/generate-tailored")
    @Operation(summary = "Generate job-customized tailored resume with visual Diffs and BEFORE vs AFTER score comparison")
    public ResponseEntity<TailoredResumeResult> generateTailoredResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody TailoredResumeRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.generateTailoredResume(userId, request));
    }

    @PostMapping("/quality-check")
    @Operation(summary = "Execute pre-export quality validation (missing contact info, broken links, duplicate bullets)")
    public ResponseEntity<QualityCheckResult> runQualityCheck(@RequestBody String resumeText) {
        return ResponseEntity.ok(resumeService.runQualityCheck(resumeText));
    }

    @GetMapping("/master")
    @Operation(summary = "Get user Master Resume facts and scores")
    public ResponseEntity<MasterResume> getMasterResume(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.getMasterResume(userId));
    }

    @GetMapping("/versions")
    @Operation(summary = "List user saved resume versions")
    public ResponseEntity<List<ResumeVersionDTO>> getVersions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.getUserVersions(userId));
    }

    @PostMapping("/versions")
    @Operation(summary = "Save a new job-specific resume version")
    public ResponseEntity<ResumeVersionDTO> createVersion(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ResumeVersionDTO dto) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.createVersion(
                userId, dto.getVersionName(), dto.getTargetRole(), dto.getCompanyName(), dto.getTailoredText()));
    }

    @DeleteMapping("/versions/{id}")
    @Operation(summary = "Delete a saved resume version")
    public ResponseEntity<Void> deleteVersion(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        SecurityUtils.getRequiredUserId(userPrincipal);
        resumeService.deleteVersion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    @Operation(summary = "Get resume ATS score analysis audit history")
    public ResponseEntity<List<ResumeAnalysisHistoryDTO>> getHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(resumeService.getAnalysisHistory(userId));
    }

    @PostMapping(value = "/export-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Export tailored resume as downloadable PDF document")
    public ResponseEntity<byte[]> exportPdf(@RequestBody ResumeExportRequest request) {
        byte[] pdfBytes = resumeService.generateResumePdfBytes(request.getTitle(), request.getContent());
        String filename = (request.getFileName() != null ? request.getFileName() : "careerpilot_resume") + ".pdf";
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(pdfBytes);
    }
}
