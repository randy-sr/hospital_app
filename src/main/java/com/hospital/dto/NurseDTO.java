package com.hospital.dto;

public class NurseDTO extends EmployeeDTO {
    private String department;
    private String certificationNumber;

    // Constructor vacío
    public NurseDTO() {}

    // Constructor con parámetros
    public NurseDTO(Long id, String firstName, String lastName, String email, String phoneNumber, 
                    String department, String certificationNumber) {
        this.department = department;
        this.certificationNumber = certificationNumber;
    }

    // Getters y Setters
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
