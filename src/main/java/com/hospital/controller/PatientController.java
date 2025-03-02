package com.hospital.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.model.Patient;
import com.hospital.service.DoctorService;
import com.hospital.service.NurseService;
import com.hospital.service.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
	
	private final PatientService patientService;
	private final DoctorService doctorService;
	private final NurseService nurseService;
	
	@Autowired
	public PatientController(PatientService patientService, DoctorService doctorService, NurseService nurseService) {
		this.patientService = patientService;
		this.doctorService = doctorService;
		this.nurseService = nurseService;
	}
	
	@GetMapping
	public List<Patient> getAllPatients() {
		return patientService.findAllPatients();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
		return patientService.findPatientById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
	
	@GetMapping("/search")
	public List<Patient> searchPatients(@RequestParam String lastName) {
		return patientService.findPatientsByLastName(lastName);
	}
	
	@PostMapping
	public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
		Patient savedPatient = patientService.savePatient(patient);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
		return patientService.findPatientById(id)
				.map(existingPatient -> {
					patient.setId(id);
					return ResponseEntity.ok(patientService.savePatient(patient));
				})
				.orElse(ResponseEntity.notFound().build());
	}
	
	@DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        return patientService.findPatientById(id)
                .map(patient -> {
                    patientService.deletePatient(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
	
	 @PostMapping("/{patientId}/doctors/{doctorId}")
	    public ResponseEntity<Patient> assignDoctorToPatient(
	            @PathVariable Long patientId, @PathVariable Long doctorId) {
	        return doctorService.findDoctorById(doctorId)
	                .map(doctor -> {
	                    Patient updated = patientService.assignEmployeeToPatient(patientId, doctor);
	                    return ResponseEntity.ok(updated);
	                })
	                .orElse(ResponseEntity.notFound().build());
	    }

	    @PostMapping("/{patientId}/nurses/{nurseId}")
	    public ResponseEntity<Patient> assignNurseToPatient(
	            @PathVariable Long patientId, @PathVariable Long nurseId) {
	        return nurseService.findNurseById(nurseId)
	                .map(nurse -> {
	                    Patient updated = patientService.assignEmployeeToPatient(patientId, nurse);
	                    return ResponseEntity.ok(updated);
	                })
	                .orElse(ResponseEntity.notFound().build());
	    }

	    @DeleteMapping("/{patientId}/doctors/{doctorId}")
	    public ResponseEntity<Patient> removeDoctorFromPatient(
	            @PathVariable Long patientId, @PathVariable Long doctorId) {
	        return doctorService.findDoctorById(doctorId)
	                .map(doctor -> {
	                    Patient updated = patientService.removeEmployeeFromPatient(patientId, doctor);
	                    return ResponseEntity.ok(updated);
	                })
	                .orElse(ResponseEntity.notFound().build());
	    }

	    @DeleteMapping("/{patientId}/nurses/{nurseId}")
	    public ResponseEntity<Patient> removeNurseFromPatient(
	            @PathVariable Long patientId, @PathVariable Long nurseId) {
	        return nurseService.findNurseById(nurseId)
	                .map(nurse -> {
	                    Patient updated = patientService.removeEmployeeFromPatient(patientId, nurse);
	                    return ResponseEntity.ok(updated);
	                })
	                .orElse(ResponseEntity.notFound().build());
	    }
	
}
