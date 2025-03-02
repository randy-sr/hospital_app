package com.hospital.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospital.model.Patient;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>{
	List<Patient> findByLastNameContainingIgnoreCase(String lastName);
}
