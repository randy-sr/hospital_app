package com.hospital.dto;

import com.hospital.model.enums.Specialization;

public class DoctorDTO extends EmployeeDTO {
    private Specialization specialization;
    private String licenseNumber;

    // Constructor vacío
    public DoctorDTO() {}

    // Constructor con parámetros
    public DoctorDTO(Long id, String firstName, String lastName, String email, String phoneNumber, 
                     Specialization specialization, String licenseNumber) {
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
    }

    // Getters y Setters
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
