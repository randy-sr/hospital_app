package com.hospital.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.model.Doctor;
import com.hospital.model.enums.Specialization;
import com.hospital.repository.DoctorRepository;

@Service
public class DoctorService {
	private final DoctorRepository doctorRepository;
	
	@Autowired
	public DoctorService(DoctorRepository doctorRepository) {
		this.doctorRepository = doctorRepository;
	}
	
	public List<Doctor> findAllDoctors() {
		return doctorRepository.findAll();
	}
	
	public Optional<Doctor> findDoctorById(Long id) {
		return doctorRepository.findById(id);
	}
	
	public List<Doctor> findDoctorsBySpecialization(Specialization specialization) {
		return doctorRepository.findBySpecialization(specialization);
	}
	
	public List<Doctor> findDoctorsByLastName(String lastName) {
		return doctorRepository.findByLastNameContainingIgnoreCase(lastName);
	}
	
	public Doctor saveDoctor(Doctor doctor) {
		return doctorRepository.save(doctor);
	}
	
	public void deleteDoctor(Long id) {
		doctorRepository.deleteById(id);
	}
}
