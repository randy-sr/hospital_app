package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospital.model.Nurse;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, Long>{
	List<Nurse> findByDepartment(String department);
	List<Nurse> findByLastNameContainingIgnoreCase(String lastName);
}
