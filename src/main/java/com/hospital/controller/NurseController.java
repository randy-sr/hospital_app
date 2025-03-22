package com.hospital.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.dto.NurseDTO;
import com.hospital.model.Nurse;
import com.hospital.service.NurseService;

@RestController
@RequestMapping("/api/nurses")
public class NurseController {

    private final NurseService nurseService;

    @Autowired
    public NurseController(NurseService nurseService) {
        this.nurseService = nurseService;
    }

    @GetMapping
    public List<Nurse> getAllNurses() {
        return nurseService.findAllNurses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nurse> getNurseById(@PathVariable Long id) {
        return nurseService.findNurseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    public List<Nurse> getNursesByDepartment(@PathVariable String department) {
        return nurseService.findNursesByDepartment(department);
    }

    @GetMapping("/search")
    public List<Nurse> searchNurses(@RequestParam String lastName) {
        return nurseService.findNursesByLastName(lastName);
    }

    @PostMapping
    public ResponseEntity<Nurse> createNurse(@RequestBody NurseDTO nurseDTO) {
        Nurse savedNurse = nurseService.saveNurse(nurseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNurse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nurse> updateNurse(
            @PathVariable Long id, @RequestBody NurseDTO nurseDTO) {
    	nurseDTO.setId(id);
    	Nurse updateNurse = nurseService.saveNurse(nurseDTO);
    	return ResponseEntity.ok(updateNurse);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNurse(@PathVariable Long id) {
        return nurseService.findNurseById(id)
                .map(nurse -> {
                    nurseService.deleteNurse(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}