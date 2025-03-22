package com.hospital.service;

import java.util.Optional;

import com.hospital.model.Employee;

public interface EmployeeService<T extends Employee> {
    Optional<T> findEmployeeById(Long id);
}