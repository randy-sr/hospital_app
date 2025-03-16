package com.hospital.service;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.dto.EmployeeDTO;
import com.hospital.dto.PatientDTO;
import com.hospital.model.Employee;
import com.hospital.model.Patient;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.NurseRepository;
import com.hospital.repository.PatientRepository;

@Service
public class PatientService {
	private final PatientRepository patientRepository;
	private final DoctorRepository doctorRepository;
	private final NurseRepository nurseRepository;
	
	@Autowired
	public PatientService(PatientRepository patientRepository, DoctorRepository doctorRepository, NurseRepository nurseRepository) {
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.nurseRepository = nurseRepository;
	}
	
	public PatientDTO savePatient(PatientDTO patientDTO) {
        // Convertir DTO a Entidad
        Patient patient = new Patient();
        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setDateOfBirth(patientDTO.getDateOfBirth());
        patient.setGender(patientDTO.getGender());
        patient.setAddress(patientDTO.getAddress());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        patient.setEmail(patientDTO.getEmail());
        patient.setInsuranceDetails(patientDTO.getInsuranceDetails());

        if (patientDTO.getAssignedEmployees() != null && !patientDTO.getAssignedEmployees().isEmpty()) {
        	Set<Employee> employees = new HashSet<>();
        	
        	for (EmployeeDTO empDTO : patientDTO.getAssignedEmployees()) {
        		doctorRepository.findById(empDTO.getId()).ifPresent(employees::add);
        		nurseRepository.findById(empDTO.getId()).ifPresent(employees::add);
        	}
        	
        	patient.setAssignedEmployees(employees);
        }
        
        Patient savedPatient = patientRepository.save(patient);
        
		return convertToDTO(savedPatient);
    }
	
	private PatientDTO convertToDTO(Patient patient) {
	    Set<EmployeeDTO> assignedEmployeesDTO = new HashSet<>();
	    
	    if (patient.getAssignedEmployees() != null) {
	        for (Employee emp : patient.getAssignedEmployees()) {
	            if (emp != null) { // Evitar NullPointerException en caso de datos inconsistentes
	                assignedEmployeesDTO.add(new EmployeeDTO(
	                ));
	            }
	        }
	    }

	    return new PatientDTO(
	    );
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
