package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospital.model.Doctor;
import com.hospital.model.enums.Specialization;
import java.util.List;


@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long>{
	List<Doctor> findBySpecialization(Specialization specialization);
	List<Doctor> findByLastNameContainingIgnoreCase(String lastName);
}
