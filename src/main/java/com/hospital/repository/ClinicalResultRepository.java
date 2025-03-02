package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospital.model.ClinicalResult;
import com.hospital.model.Patient;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ClinicalResultRepository extends JpaRepository<ClinicalResult, Long>{
	List<ClinicalResult> findByPatient(Patient patient);
	List<ClinicalResult> findByPatientIdOrderByTestDateDesc(Long patientId);
	List<ClinicalResult> findByTestDateBetween(LocalDateTime start, LocalDateTime end);
}
