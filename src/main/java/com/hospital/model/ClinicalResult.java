package com.hospital.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
public class ClinicalResult {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String testName;
	private String result;
	private String units;
	private String normalRange;
	private String status;
	private LocalDateTime testDate;
	
	@Column(length = 1000)
	private String notes;
	
	@ManyToOne()
	@JoinColumn(name = "patient_id")
	private Patient patient;
	
	@ManyToOne()
	@JoinColumn(name = "doctor_id")
	private Doctor requestedBy;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getUnits() {
		return units;
	}

	public void setUnits(String units) {
		this.units = units;
	}

	public String getNormalRange() {
		return normalRange;
	}

	public void setNormalRange(String normalRange) {
		this.normalRange = normalRange;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getTestDate() {
		return testDate;
	}

	public void setTestDate(LocalDateTime testDate) {
		this.testDate = testDate;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Doctor getRequestedBy() {
		return requestedBy;
	}

	public void setRequestedBy(Doctor requestedBy) {
		this.requestedBy = requestedBy;
	}
}
