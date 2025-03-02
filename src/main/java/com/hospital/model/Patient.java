package com.hospital.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Patient {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String firstName;
	private String lastName;
	private LocalDate dateOfBirth;
	private String gender;
	private String address;
	private String phoneNumber;
	private String email;
	private String insuranceDetails;
	
	@ManyToMany
	@JoinTable(
			name = "patient_employee",
			joinColumns = @JoinColumn(name = "patient_id"),
			inverseJoinColumns = @JoinColumn(name = "employee_id")
	)
	
	@JsonManagedReference
	private Set<Employee> assignedEmployees = new HashSet<>();
	
	@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ClinicalResult> clinicalResults = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getInsuranceDetails() {
		return insuranceDetails;
	}

	public void setInsuranceDetails(String insuranceDetails) {
		this.insuranceDetails = insuranceDetails;
	}

	public Set<Employee> getAssignedEmployees() {
		return assignedEmployees;
	}

	public void setAssignedEmployees(Set<Employee> assignedEmployees) {
		this.assignedEmployees = assignedEmployees;
	}

	public List<ClinicalResult> getClinicalResults() {
		return clinicalResults;
	}

	public void setClinicalResult(List<ClinicalResult> clinicalResults) {
		this.clinicalResults = clinicalResults;
	}
	
	// Helper methods
	public void addEmployee(Employee employee) {
		assignedEmployees.add(employee);
		employee.getPatients().add(this);
	}
	
	public void removeEmployee(Employee employee) {
		assignedEmployees.remove(employee);
		employee.getPatients().remove(this);
	}
	
	public void addClinicalResult(ClinicalResult result) {
		clinicalResults.add(result);
		result.setPatient(this);
	}
	
	public void removeClinicalResult(ClinicalResult result) {
		clinicalResults.remove(result);
		result.setPatient(null);
	}
}
