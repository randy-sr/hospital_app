package com.hospital.model;

import com.hospital.model.enums.Specialization;
import jakarta.persistence.*;

@Entity
public class Doctor extends Employee {
	
	@Enumerated(EnumType.STRING)
	private Specialization specialization;
	
	private String licenseNumber;

	public Specialization getSpecialization() {
		return specialization;
	}

	public void setSpecialization(Specialization specialization) {
		this.specialization = specialization;
	}

	public String getLicenseNumber() {
		return licenseNumber;
	}

	public void setLicenseNumber(String licenseNumber) {
		this.licenseNumber = licenseNumber;
	}
}
