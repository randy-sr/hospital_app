package com.hospital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.dto.NurseDTO;
import com.hospital.model.Nurse;
import com.hospital.repository.NurseRepository;
import java.util.List;
import java.util.Optional;


@Service
public class NurseService {
private final NurseRepository nurseRepository;
	
	@Autowired
	public NurseService(NurseRepository nurseRepository) {
		this.nurseRepository = nurseRepository;
	}
	
	public Nurse saveNurse(NurseDTO nurseDTO) {
		Optional<Nurse> existingNurseOpt = nurseRepository.findById(nurseDTO.getId());
		
		if(existingNurseOpt.isPresent()) {
			Nurse existingNurse = existingNurseOpt.get();
			existingNurse.setFirstName(nurseDTO.getFirstName());
			existingNurse.setLastName(nurseDTO.getLastName());
			existingNurse.setPhoneNumber(nurseDTO.getPhoneNumber());
			existingNurse.setEmail(nurseDTO.getEmail());
			existingNurse.setEmail(nurseDTO.getDepartment());
			existingNurse.setEmail(nurseDTO.getCertificationNumber());
			Nurse savedNurse = nurseRepository.save(existingNurse);
			
			return savedNurse;
		}else {
	        throw new RuntimeException("El enfermero con ID " + nurseDTO.getId() + " no existe.");
	    }
	}
	
	public List<Nurse> findAllNurses() {
		return nurseRepository.findAll();
	}
	
	public Optional<Nurse> findNurseById(Long id) {
		return nurseRepository.findById(id);
	}
	
	public List<Nurse> findNursesByDepartment(String department) {
		return nurseRepository.findByDepartment(department);
	}
	
	public List<Nurse> findNursesByLastName(String lastName) {
		return nurseRepository.findByLastNameContainingIgnoreCase(lastName);
	}
	
	public Nurse saveNurse(Nurse nurse) {
		return nurseRepository.save(nurse);
	}
	
	public void deleteNurse(Long id) {
		nurseRepository.deleteById(id);
	}
}
