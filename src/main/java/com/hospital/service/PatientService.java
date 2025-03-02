package com.hospital.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hospital.model.Employee;
import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;

@Service
public class PatientService {
	private final PatientRepository patientRepository;
	
	@Autowired
	public PatientService(PatientRepository patientRepository) {
		this.patientRepository = patientRepository;
	}
	
	public List<Patient> findAllPatients() {
		return patientRepository.findAll();
	}
	
	public Optional<Patient> findPatientById(Long id) {
		return patientRepository.findById(id);
	}
	
	public List<Patient> findPatientsByLastName(String lastname) {
		return patientRepository.findByLastNameContainingIgnoreCase(lastname);
	}
	
	public Patient savePatient(Patient patient) {
		return patientRepository.save(patient);
	}
	
	public void deletePatient(Long id) {
		patientRepository.deleteById(id);
	}
	
	@Transactional
	public Patient assignEmployeeToPatient(Long patientId, Employee employee) {
		Patient patient = patientRepository.findById(patientId)
				.orElseThrow(()-> new RuntimeException("Patient not found"));
		patient.addEmployee(employee);
		return patientRepository.save(patient);
	}
	
	@Transactional
	public Patient removeEmployeeFromPatient(Long patientId, Employee employee) {
		Patient patient = patientRepository.findById(patientId)
				.orElseThrow(()-> new RuntimeException("Patient not found"));
		patient.removeEmployee(employee);
		return patientRepository.save(patient);
	}
}
