package com.hospital.dto;

import java.time.LocalDate;
import java.util.Set;

public class PatientDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String phoneNumber;
    private String email;
    private String insuranceDetails;
    private Set<EmployeeDTO> assignedEmployees;

    // Constructor vacío (obligatorio para Jackson)
    public PatientDTO() {}

    // Constructor que recibe una entidad Patient y la convierte a DTO
//    public PatientDTO(Patient patient) {
//        this.id = patient.getId();
//        this.firstName = patient.getFirstName();
//        this.lastName = patient.getLastName();
//        this.dateOfBirth = patient.getDateOfBirth();
//        this.gender = patient.getGender();
//        this.address = patient.getAddress();
//        this.phoneNumber = patient.getPhoneNumber();
//        this.email = patient.getEmail();
//        this.insuranceDetails = patient.getInsuranceDetails();
//    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getInsuranceDetails() { return insuranceDetails; }
    public void setInsuranceDetails(String insuranceDetails) { this.insuranceDetails = insuranceDetails; }
    
    public Set<EmployeeDTO> getAssignedEmployees() {
        return assignedEmployees;
    }

    public void setAssignedEmployees(Set<EmployeeDTO> assignedEmployees) {
        this.assignedEmployees = assignedEmployees;
    }
}
