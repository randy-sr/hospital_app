package com.hospital.controller;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.hospital.model.ClinicalResult;
import com.hospital.service.ClinicalResultService;
import com.hospital.service.PatientService;

@RestController
@RequestMapping("/api/clinical-results")
public class ClinicalResultController {

    private final ClinicalResultService clinicalResultService;
    private final PatientService patientService;

    @Autowired
    public ClinicalResultController(
            ClinicalResultService clinicalResultService,
            PatientService patientService) {
        this.clinicalResultService = clinicalResultService;
        this.patientService = patientService;
    }

    @GetMapping
    public List<ClinicalResult> getAllClinicalResults() {
        return clinicalResultService.findAllClinicalResults();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicalResult> getClinicalResultById(@PathVariable Long id) {
        return clinicalResultService.findClinicalResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<ClinicalResult> getClinicalResultsByPatientId(@PathVariable Long patientId) {
        return clinicalResultService.findClinicalResultsByPatientId(patientId);
    }

    @GetMapping("/date-range")
    public List<ClinicalResult> getClinicalResultsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return clinicalResultService.findClinicalResultsByDateRange(startDate, endDate);
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<ClinicalResult> createClinicalResult(
            @RequestBody ClinicalResult clinicalResult,
            @PathVariable Long patientId) {
        ClinicalResult savedResult = clinicalResultService.saveClinicalResult(clinicalResult, patientId);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedResult);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClinicalResult> updateClinicalResult(
            @PathVariable Long id,
            @RequestBody ClinicalResult clinicalResult) {
        return clinicalResultService.findClinicalResultById(id)
                .map(existingResult -> {
                    clinicalResult.setId(id);
                    return ResponseEntity.ok(clinicalResultService.updateClinicalResult(clinicalResult));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClinicalResult(@PathVariable Long id) {
        return clinicalResultService.findClinicalResultById(id)
                .map(result -> {
                    clinicalResultService.deleteClinicalResult(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
