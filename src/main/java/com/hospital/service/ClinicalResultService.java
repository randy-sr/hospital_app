package com.hospital.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.model.ClinicalResult;
import com.hospital.model.Patient;
import com.hospital.repository.ClinicalResultRepository;
import com.hospital.repository.PatientRepository;

@Service
public class ClinicalResultService {
	   private final ClinicalResultRepository clinicalResultRepository;
	   private final PatientRepository patientRepository;
	
	   @Autowired
	   public ClinicalResultService(ClinicalResultRepository clinicalResultRepository,
			   PatientRepository patientRepository) {
			this.clinicalResultRepository = clinicalResultRepository;
			this.patientRepository = patientRepository;
	   }
	   
	   public List<ClinicalResult> findAllClinicalResults() {
	        return clinicalResultRepository.findAll();
	   }
	   
	   public Optional<ClinicalResult> findClinicalResultById(Long id) {
		   return clinicalResultRepository.findById(id);
	   }
	   
	   public List<ClinicalResult> findClinicalResultsByPatient(Patient patient) {
	        return clinicalResultRepository.findByPatient(patient);
	   }
	   
	   public List<ClinicalResult> findClinicalResultsByPatientId(Long patientId) {
	        return clinicalResultRepository.findByPatientIdOrderByTestDateDesc(patientId);
	   }
	   
	   public List<ClinicalResult> findClinicalResultsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
	        return clinicalResultRepository.findByTestDateBetween(startDate, endDate);
	   }
	   
	   @Transactional
	   public ClinicalResult saveClinicalResult(ClinicalResult clinicalResult, Long patientId) {
		   Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
		   clinicalResult.setPatient(patient);
		   return clinicalResultRepository.save(clinicalResult);
	   }
	   
	   public ClinicalResult updateClinicalResult(ClinicalResult clinicalResult) {
		   return clinicalResultRepository.save(clinicalResult);
	   }
	   
	   public void deleteClinicalResult(Long id) {
		   clinicalResultRepository.deleteById(id);
	   }
}
