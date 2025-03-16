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
		Optional<Patient> existingPatientOpt = patientRepository.findById(patientDTO.getId());
		
		if(existingPatientOpt.isPresent()) {
			Patient existingPatient = existingPatientOpt.get();
			
			existingPatient.setFirstName(patientDTO.getFirstName());
			existingPatient.setLastName(patientDTO.getLastName());
			existingPatient.setDateOfBirth(patientDTO.getDateOfBirth());
			existingPatient.setGender(patientDTO.getGender());
			existingPatient.setAddress(patientDTO.getAddress());
			existingPatient.setPhoneNumber(patientDTO.getPhoneNumber());
			existingPatient.setEmail(patientDTO.getEmail());
			existingPatient.setInsuranceDetails(patientDTO.getInsuranceDetails());
			
			if (patientDTO.getAssignedEmployees() != null && !patientDTO.getAssignedEmployees().isEmpty()) {
	        	Set<Employee> employees = new HashSet<>();
	        	
	        	for (EmployeeDTO empDTO : patientDTO.getAssignedEmployees()) {
	        		doctorRepository.findById(empDTO.getId()).ifPresent(employees::add);
	        		nurseRepository.findById(empDTO.getId()).ifPresent(employees::add);
	        	}
	        	
	        	existingPatient.setAssignedEmployees(employees);
	        }
			
		     Patient updatePatient = patientRepository.save(existingPatient);
		     
			return convertToDTO(updatePatient);
		}else {
	        throw new RuntimeException("El paciente con ID " + patientDTO.getId() + " no existe.");
	    }
           
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
