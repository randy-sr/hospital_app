package com.hospital.model;

import jakarta.persistence.Entity;


@Entity
public class Nurse extends Employee {
	
	private String department;
	private String certificationNumber;
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getCertificationNumber() {
		return certificationNumber;
	}
	public void setCertificationNumber(String certificationNumber) {
		this.certificationNumber = certificationNumber;
	}
}
