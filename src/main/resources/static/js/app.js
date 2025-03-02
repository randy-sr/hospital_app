// main.js
$(document).ready(function() {
    // Navigation handling
    $('#nav-dashboard').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#dashboard-content').show();
        $('#patients-content, #doctors-content, #nurses-content, #clinical-results-content').hide();
        loadDashboardData();
    });

    $('#nav-patients').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#patients-content').show();
        $('#dashboard-content, #doctors-content, #nurses-content, #clinical-results-content').hide();
        loadPatientsView();
    });

    $('#nav-doctors').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#doctors-content').show();
        $('#dashboard-content, #patients-content, #nurses-content, #clinical-results-content').hide();
        loadDoctorsView();
    });

    $('#nav-nurses').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#nurses-content').show();
        $('#dashboard-content, #patients-content, #doctors-content, #clinical-results-content').hide();
        loadNursesView();
    });

    $('#nav-clinical-results').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#clinical-results-content').show();
        $('#dashboard-content, #patients-content, #doctors-content, #nurses-content').hide();
        loadClinicalResultsView();
    });

    // Staff type selection in assignment modal
    $('#staffType').change(function() {
        const staffType = $(this).val();
        if (staffType === 'doctor') {
            $('#doctorSelectDiv').show();
            $('#nurseSelectDiv').hide();
        } else if (staffType === 'nurse') {
            $('#doctorSelectDiv').hide();
            $('#nurseSelectDiv').show();
        } else {
            $('#doctorSelectDiv, #nurseSelectDiv').hide();
        }
    });

    // Load dashboard data on page load
    loadDashboardData();
});

function loadDashboardData() {
    // Load counts
    $.ajax({
        url: '/api/patients',
        type: 'GET',
        success: function(data) {
            $('#patientCount').text(data.length);
        },
        error: function(err) {
            console.error('Error loading patient count:', err);
            $('#patientCount').text('Error');
        }
    });
    
    $.ajax({
        url: '/api/doctors',
        type: 'GET',
        success: function(data) {
            $('#doctorCount').text(data.length);
        },
        error: function(err) {
            console.error('Error loading doctor count:', err);
            $('#doctorCount').text('Error');
        }
    });
    
    $.ajax({
        url: '/api/nurses',
        type: 'GET',
        success: function(data) {
            $('#nurseCount').text(data.length);
        },
        error: function(err) {
            console.error('Error loading nurse count:', err);
            $('#nurseCount').text('Error');
        }
    });
    
    $.ajax({
        url: '/api/clinical-results',
        type: 'GET',
        success: function(data) {
            $('#resultCount').text(data.length);
        },
        error: function(err) {
            console.error('Error loading clinical results count:', err);
            $('#resultCount').text('Error');
        }
    });
    
    // Load recent patients
    $.ajax({
        url: '/api/patients?sort=registrationDate,desc&size=5',
        type: 'GET',
        success: function(data) {
            const recentPatientsList = $('#recentPatientsList');
            recentPatientsList.empty();
            
            if (data.length === 0) {
                recentPatientsList.append('<li class="list-group-item">No patients found</li>');
                return;
            }
            
            data.forEach(patient => {
                const date = new Date(patient.registrationDate).toLocaleDateString();
                recentPatientsList.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${patient.firstName} ${patient.lastName}</strong><br>
                            <small class="text-muted">Reg: ${date}</small>
                        </div>
                        <span class="badge bg-primary rounded-pill">${patient.patientId}</span>
                    </li>
                `);
            });
        },
        error: function(err) {
            console.error('Error loading recent patients:', err);
            $('#recentPatientsList').html('<li class="list-group-item">Error loading data</li>');
        }
    });
    
    // Load recent clinical results
    $.ajax({
        url: '/api/clinical-results?sort=resultDate,desc&size=5',
        type: 'GET',
        success: function(data) {
            const recentResultsList = $('#recentResultsList');
            recentResultsList.empty();
            
            if (data.length === 0) {
                recentResultsList.append('<li class="list-group-item">No clinical results found</li>');
                return;
            }
            
            data.forEach(result => {
                const date = new Date(result.resultDate).toLocaleDateString();
                recentResultsList.append(`
                    <li class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${result.resultType}</h6>
                            <small>${date}</small>
                        </div>
                        <p class="mb-1">Patient: ${result.patientName || 'Unknown'}</p>
                        <small>${result.resultSummary || 'No summary available'}</small>
                    </li>
                `);
            });
        },
        error: function(err) {
            console.error('Error loading recent clinical results:', err);
            $('#recentResultsList').html('<li class="list-group-item">Error loading data</li>');
        }
    });
}

function loadPatientsView() {
    // Load patients data for the table
    $.ajax({
        url: '/api/patients',
        type: 'GET',
        success: function(data) {
            const patientsTable = $('#patientsTable tbody');
            patientsTable.empty();
            
            if (data.length === 0) {
                patientsTable.append('<tr><td colspan="7" class="text-center">No patients found</td></tr>');
                return;
            }
            
            data.forEach(patient => {
                const birthDate = patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'N/A';
                const regDate = patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'N/A';
                
                patientsTable.append(`
                    <tr>
                        <td>${patient.patientId}</td>
                        <td>${patient.firstName} ${patient.lastName}</td>
                        <td>${birthDate}</td>
                        <td>${patient.gender || 'N/A'}</td>
                        <td>${patient.contactNumber || 'N/A'}</td>
                        <td>${regDate}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-patient" data-id="${patient.id}">View</button>
                            <button class="btn btn-sm btn-warning edit-patient" data-id="${patient.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-patient" data-id="${patient.id}">Delete</button>
                            <button class="btn btn-sm btn-info assign-staff" data-id="${patient.id}" data-name="${patient.firstName} ${patient.lastName}">Assign Staff</button>
                        </td>
                    </tr>
                `);
            });
            
            // Set up event handlers for patient actions
            setupPatientActionHandlers();
        },
        error: function(err) {
            console.error('Error loading patients:', err);
            $('#patientsTable tbody').html('<tr><td colspan="7" class="text-center">Error loading data</td></tr>');
        }
    });
    
    // Populate doctors and nurses dropdowns for the assignment modal
    $.ajax({
        url: '/api/doctors',
        type: 'GET',
        success: function(data) {
            const doctorSelect = $('#doctorSelect');
            doctorSelect.empty();
            doctorSelect.append('<option value="">Select Doctor</option>');
            
            data.forEach(doctor => {
                doctorSelect.append(`<option value="${doctor.id}">Dr. ${doctor.firstName} ${doctor.lastName}</option>`);
            });
        },
        error: function(err) {
            console.error('Error loading doctors:', err);
        }
    });
    
    $.ajax({
        url: '/api/nurses',
        type: 'GET',
        success: function(data) {
            const nurseSelect = $('#nurseSelect');
            nurseSelect.empty();
            nurseSelect.append('<option value="">Select Nurse</option>');
            
            data.forEach(nurse => {
                nurseSelect.append(`<option value="${nurse.id}">${nurse.firstName} ${nurse.lastName}</option>`);
            });
        },
        error: function(err) {
            console.error('Error loading nurses:', err);
        }
    });
}

function setupPatientActionHandlers() {
    // View patient details
    $('.view-patient').click(function() {
        const patientId = $(this).data('id');
        
        $.ajax({
            url: `/api/patients/${patientId}`,
            type: 'GET',
            success: function(patient) {
                $('#patientDetailsModal .modal-title').text(`Patient: ${patient.firstName} ${patient.lastName}`);
                
                const detailsHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID:</strong> ${patient.patientId}</p>
                            <p><strong>Name:</strong> ${patient.firstName} ${patient.lastName}</p>
                            <p><strong>Birth Date:</strong> ${patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Gender:</strong> ${patient.gender || 'N/A'}</p>
                            <p><strong>Blood Type:</strong> ${patient.bloodType || 'N/A'}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Contact:</strong> ${patient.contactNumber || 'N/A'}</p>
                            <p><strong>Email:</strong> ${patient.email || 'N/A'}</p>
                            <p><strong>Address:</strong> ${patient.address || 'N/A'}</p>
                            <p><strong>Registration Date:</strong> ${patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <h5>Medical Information</h5>
                            <p><strong>Allergies:</strong> ${patient.allergies || 'None reported'}</p>
                            <p><strong>Medical History:</strong> ${patient.medicalHistory || 'No records available'}</p>
                        </div>
                    </div>
                `;
                
                $('#patientDetailsContent').html(detailsHtml);
                $('#patientDetailsModal').modal('show');
                
                // Load assigned staff
                $.ajax({
                    url: `/api/patients/${patientId}/staff`,
                    type: 'GET',
                    success: function(staff) {
                        let staffHtml = '<h5 class="mt-3">Assigned Staff</h5>';
                        
                        if (!staff || ((!staff.doctors || staff.doctors.length === 0) && (!staff.nurses || staff.nurses.length === 0))) {
                            staffHtml += '<p>No staff assigned to this patient</p>';
                        } else {
                            if (staff.doctors && staff.doctors.length > 0) {
                                staffHtml += '<h6>Doctors:</h6><ul>';
                                staff.doctors.forEach(doctor => {
                                    staffHtml += `<li>Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialization || 'No specialization'})</li>`;
                                });
                                staffHtml += '</ul>';
                            }
                            
                            if (staff.nurses && staff.nurses.length > 0) {
                                staffHtml += '<h6>Nurses:</h6><ul>';
                                staff.nurses.forEach(nurse => {
                                    staffHtml += `<li>${nurse.firstName} ${nurse.lastName}</li>`;
                                });
                                staffHtml += '</ul>';
                            }
                        }
                        
                        $('#patientDetailsContent').append(staffHtml);
                    },
                    error: function(err) {
                        console.error('Error loading patient staff:', err);
                        $('#patientDetailsContent').append('<p class="text-danger">Error loading assigned staff information</p>');
                    }
                });
                
                // Load clinical results
                $.ajax({
                    url: `/api/patients/${patientId}/clinicalResults`,
                    type: 'GET',
                    success: function(results) {
                        let resultsHtml = '<h5 class="mt-3">Clinical Results</h5>';
                        
                        if (!results || results.length === 0) {
                            resultsHtml += '<p>No clinical results available</p>';
                        } else {
                            resultsHtml += '<div class="list-group">';
                            results.forEach(result => {
                                const date = new Date(result.resultDate).toLocaleDateString();
                                resultsHtml += `
                                    <a href="#" class="list-group-item list-group-item-action">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h6 class="mb-1">${result.resultType}</h6>
                                            <small>${date}</small>
                                        </div>
                                        <p class="mb-1">${result.resultSummary || 'No summary available'}</p>
                                    </a>
                                `;
                            });
                            resultsHtml += '</div>';
                        }
                        
                        $('#patientDetailsContent').append(resultsHtml);
                    },
                    error: function(err) {
                        console.error('Error loading patient clinical results:', err);
                        $('#patientDetailsContent').append('<p class="text-danger">Error loading clinical results</p>');
                    }
                });
            },
            error: function(err) {
                console.error('Error loading patient details:', err);
                alert('Error loading patient details. Please try again.');
            }
        });
    });
    
    // Edit patient
    $('.edit-patient').click(function() {
        const patientId = $(this).data('id');
        
        $.ajax({
            url: `/api/patients/${patientId}`,
            type: 'GET',
            success: function(patient) {
                // Populate form with patient data
                $('#editPatientId').val(patient.id);
                $('#editFirstName').val(patient.firstName);
                $('#editLastName').val(patient.lastName);
                $('#editBirthDate').val(patient.birthDate ? patient.birthDate.split('T')[0] : '');
                $('#editGender').val(patient.gender || '');
                $('#editBloodType').val(patient.bloodType || '');
                $('#editContact').val(patient.contactNumber || '');
                $('#editEmail').val(patient.email || '');
                $('#editAddress').val(patient.address || '');
                $('#editAllergies').val(patient.allergies || '');
                $('#editMedicalHistory').val(patient.medicalHistory || '');
                
                // Show modal
                $('#editPatientModal').modal('show');
            },
            error: function(err) {
                console.error('Error loading patient data for edit:', err);
                alert('Error loading patient data. Please try again.');
            }
        });
    });
    
    // Delete patient
    $('.delete-patient').click(function() {
        const patientId = $(this).data('id');
        
        if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
            $.ajax({
                url: `/api/patients/${patientId}`,
                type: 'DELETE',
                success: function() {
                    alert('Patient deleted successfully');
                    loadPatientsView(); // Reload the patients list
                },
                error: function(err) {
                    console.error('Error deleting patient:', err);
                    alert('Error deleting patient. Please try again.');
                }
            });
        }
    });
    
    // Assign staff to patient
    $('.assign-staff').click(function() {
        const patientId = $(this).data('id');
        const patientName = $(this).data('name');
        
        $('#assignModalPatientId').val(patientId);
        $('#assignModalTitle').text(`Assign Staff to ${patientName}`);
        $('#staffType').val('').trigger('change');
        $('#assignStaffModal').modal('show');
    });
}

// Handle add new patient form submission
$('#addPatientForm').submit(function(e) {
    e.preventDefault();
    
    const patientData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        birthDate: $('#birthDate').val(),
        gender: $('#gender').val(),
        bloodType: $('#bloodType').val(),
        contactNumber: $('#contact').val(),
        email: $('#email').val(),
        address: $('#address').val(),
        allergies: $('#allergies').val(),
        medicalHistory: $('#medicalHistory').val(),
        registrationDate: new Date().toISOString()
    };
    
    $.ajax({
        url: '/api/patients',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(patientData),
        success: function() {
            $('#addPatientModal').modal('hide');
            $('#addPatientForm')[0].reset();
            alert('Patient added successfully');
            loadPatientsView();
        },
        error: function(err) {
            console.error('Error adding patient:', err);
            alert('Error adding patient. Please check your data and try again.');
        }
    });
});

// Handle edit patient form submission
$('#editPatientForm').submit(function(e) {
    e.preventDefault();
    
    const patientId = $('#editPatientId').val();
    const patientData = {
        firstName: $('#editFirstName').val(),
        lastName: $('#editLastName').val(),
        birthDate: $('#editBirthDate').val(),
        gender: $('#editGender').val(),
        bloodType: $('#editBloodType').val(),
        contactNumber: $('#editContact').val(),
        email: $('#editEmail').val(),
        address: $('#editAddress').val(),
        allergies: $('#editAllergies').val(),
        medicalHistory: $('#editMedicalHistory').val()
    };
    
    $.ajax({
        url: `/api/patients/${patientId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(patientData),
        success: function() {
            $('#editPatientModal').modal('hide');
            alert('Patient updated successfully');
            loadPatientsView();
        },
        error: function(err) {
            console.error('Error updating patient:', err);
            alert('Error updating patient. Please check your data and try again.');
        }
    });
});

// Handle assign staff form submission
$('#assignStaffForm').submit(function(e) {
    e.preventDefault();
    
    const patientId = $('#assignModalPatientId').val();
    const staffType = $('#staffType').val();
    let staffId;
    
    if (staffType === 'doctor') {
        staffId = $('#doctorSelect').val();
    } else if (staffType === 'nurse') {
        staffId = $('#nurseSelect').val();
    } else {
        alert('Please select a staff type');
        return;
    }
    
    if (!staffId) {
        alert('Please select a staff member');
        return;
    }
    
    $.ajax({
        url: `/api/patients/${patientId}/assign${staffType.charAt(0).toUpperCase() + staffType.slice(1)}/${staffId}`,
        type: 'POST',
        success: function() {
            $('#assignStaffModal').modal('hide');
            alert(`${staffType.charAt(0).toUpperCase() + staffType.slice(1)} assigned successfully`);
            loadPatientsView();
        },
        error: function(err) {
            console.error(`Error assigning ${staffType}:`, err);
            alert(`Error assigning ${staffType}. Please try again.`);
        }
    });
});

function loadDoctorsView() {
    $.ajax({
        url: '/api/doctors',
        type: 'GET',
        success: function(data) {
            const doctorsTable = $('#doctorsTable tbody');
            doctorsTable.empty();
            
            if (data.length === 0) {
                doctorsTable.append('<tr><td colspan="7" class="text-center">No doctors found</td></tr>');
                return;
            }
            
            data.forEach(doctor => {
                doctorsTable.append(`
                    <tr>
                        <td>${doctor.employeeId || 'N/A'}</td>
                        <td>Dr. ${doctor.firstName} ${doctor.lastName}</td>
                        <td>${doctor.specialization || 'N/A'}</td>
                        <td>${doctor.contactNumber || 'N/A'}</td>
                        <td>${doctor.email || 'N/A'}</td>
                        <td>${doctor.status || 'Active'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-doctor" data-id="${doctor.id}">View</button>
                            <button class="btn btn-sm btn-warning edit-doctor" data-id="${doctor.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-doctor" data-id="${doctor.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });
            
            setupDoctorActionHandlers();
        },
        error: function(err) {
            console.error('Error loading doctors:', err);
            $('#doctorsTable tbody').html('<tr><td colspan="7" class="text-center">Error loading data</td></tr>');
        }
    });
}

function setupDoctorActionHandlers() {
    // View doctor details
    $('.view-doctor').click(function() {
        const doctorId = $(this).data('id');
        
        $.ajax({
            url: `/api/${doctorId}`,
            type: 'GET',
            success: function(doctor) {
                $('#doctorDetailsModal .modal-title').text(`Dr. ${doctor.firstName} ${doctor.lastName}`);
                
                const detailsHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID:</strong> ${doctor.employeeId}</p>
                            <p><strong>Name:</strong> Dr. ${doctor.firstName} ${doctor.lastName}</p>
                            <p><strong>Specialization:</strong> ${doctor.specialization || 'N/A'}</p>
                            <p><strong>Department:</strong> ${doctor.department || 'N/A'}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Contact:</strong> ${doctor.contactNumber || 'N/A'}</p>
                            <p><strong>Email:</strong> ${doctor.email || 'N/A'}</p>
                            <p><strong>Status:</strong> ${doctor.status || 'Active'}</p>
                            <p><strong>License Number:</strong> ${doctor.licenseNumber || 'N/A'}</p>
                        </div>
                    </div>
                `;
                
                $('#doctorDetailsContent').html(detailsHtml);
                
                // Get assigned patients
                $.ajax({
                    url: `/api/${doctorId}/patients`,
                    type: 'GET',
                    success: function(patients) {
                        let patientsHtml = '<h5 class="mt-3">Assigned Patients</h5>';
                        
                        if (!patients || patients.length === 0) {
                            patientsHtml += '<p>No patients assigned</p>';
                        } else {
                            patientsHtml += '<ul class="list-group">';
                            patients.forEach(patient => {
                                patientsHtml += `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        ${patient.firstName} ${patient.lastName}
                                        <span class="badge bg-primary rounded-pill">${patient.patientId}</span>
                                    </li>
                                `;
                            });
                            patientsHtml += '</ul>';
                        }
                        
                        $('#doctorDetailsContent').append(patientsHtml);
                        $('#doctorDetailsModal').modal('show');
                    },
                    error: function(err) {
                        console.error('Error loading doctor patients:', err);
                        $('#doctorDetailsContent').append('<p class="text-danger">Error loading assigned patients</p>');
                        $('#doctorDetailsModal').modal('show');
                    }
                });
            },
            error: function(err) {
                console.error('Error loading doctor details:', err);
                alert('Error loading doctor details. Please try again.');
            }
        });
    });
    
    // Edit doctor
    $('.edit-doctor').click(function() {
        const doctorId = $(this).data('id');
        
        $.ajax({
            url: `/api/${doctorId}`,
            type: 'GET',
            success: function(doctor) {
                $('#editDoctorId').val(doctor.id);
                $('#editDoctorFirstName').val(doctor.firstName);
                $('#editDoctorLastName').val(doctor.lastName);
                $('#editDoctorSpecialization').val(doctor.specialization || '');
                $('#editDoctorDepartment').val(doctor.department || '');
                $('#editDoctorContact').val(doctor.contactNumber || '');
                $('#editDoctorEmail').val(doctor.email || '');
                $('#editDoctorLicense').val(doctor.licenseNumber || '');
                $('#editDoctorStatus').val(doctor.status || 'Active');
                
                $('#editDoctorModal').modal('show');
            },
            error: function(err) {
                console.error('Error loading doctor data for edit:', err);
                alert('Error loading doctor data. Please try again.');
            }
        });
    });
    
    // Delete doctor
    $('.delete-doctor').click(function() {
        const doctorId = $(this).data('id');
        
        if (confirm('Are you sure you want to delete this doctor? This may affect patient assignments.')) {
            $.ajax({
                url: `/api/${doctorId}`,
                type: 'DELETE',
                success: function() {
                    alert('Doctor deleted successfully');
                    loadDoctorsView();
                },
                error: function(err) {
                    console.error('Error deleting doctor:', err);
                    alert('Error deleting doctor. Please try again.');
                }
            });
        }
    });
}

// Handle add new doctor form submission
$('#addDoctorForm').submit(function(e) {
    e.preventDefault();
    
    const doctorData = {
        firstName: $('#doctorFirstName').val(),
        lastName: $('#doctorLastName').val(),
        employeeType: 'DOCTOR',
        specialization: $('#doctorSpecialization').val(),
        department: $('#doctorDepartment').val(),
        contactNumber: $('#doctorContact').val(),
        email: $('#doctorEmail').val(),
        licenseNumber: $('#doctorLicense').val(),
        status: $('#doctorStatus').val() || 'Active'
    };
    
    $.ajax({
        url: '/api/employees',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(doctorData),
        success: function() {
            $('#addDoctorModal').modal('hide');
            $('#addDoctorForm')[0].reset();
            alert('Doctor added successfully');
            loadDoctorsView();
        },
        error: function(err) {
            console.error('Error adding doctor:', err);
            alert('Error adding doctor. Please check your data and try again.');
        }
    });
});

// Handle edit doctor form submission
$('#editDoctorForm').submit(function(e) {
    e.preventDefault();
    
    const doctorId = $('#editDoctorId').val();
    const doctorData = {
        firstName: $('#editDoctorFirstName').val(),
        lastName: $('#editDoctorLastName').val(),
        employeeType: 'DOCTOR',
        specialization: $('#editDoctorSpecialization').val(),
        department: $('#editDoctorDepartment').val(),
        contactNumber: $('#editDoctorContact').val(),
        email: $('#editDoctorEmail').val(),
        licenseNumber: $('#editDoctorLicense').val(),
        status: $('#editDoctorStatus').val()
    };
    
    $.ajax({
        url: `/api/${doctorId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(doctorData),
        success: function() {
            $('#editDoctorModal').modal('hide');
            alert('Doctor updated successfully');
            loadDoctorsView();
        },
        error: function(err) {
            console.error('Error updating doctor:', err);
            alert('Error updating doctor. Please check your data and try again.');
        }
    });
});

function loadNursesView() {
    $.ajax({
        url: '/api/nurses',
        type: 'GET',
        success: function(data) {
            const nursesTable = $('#nursesTable tbody');
            nursesTable.empty();
            
            if (data.length === 0) {
                nursesTable.append('<tr><td colspan="6" class="text-center">No nurses found</td></tr>');
                return;
            }
            
            data.forEach(nurse => {
                nursesTable.append(`
                    <tr>
                        <td>${nurse.employeeId || 'N/A'}</td>
                        <td>${nurse.firstName} ${nurse.lastName}</td>
                        <td>${nurse.department || 'N/A'}</td>
                        <td>${nurse.contactNumber || 'N/A'}</td>
                        <td>${nurse.status || 'Active'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-nurse" data-id="${nurse.id}">View</button>
                            <button class="btn btn-sm btn-warning edit-nurse" data-id="${nurse.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-nurse" data-id="${nurse.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });
            
            setupNurseActionHandlers();
        },
        error: function(err) {
            console.error('Error loading nurses:', err);
            $('#nursesTable tbody').html('<tr><td colspan="6" class="text-center">Error loading data</td></tr>');
        }
    });
}

function setupNurseActionHandlers() {
    // View nurse details
    $('.view-nurse').click(function() {
        const nurseId = $(this).data('id');
        
        $.ajax({
            url: `/api/${nurseId}`,
            type: 'GET',
            success: function(nurse) {
                $('#nurseDetailsModal .modal-title').text(`${nurse.firstName} ${nurse.lastName}`);
                
                const detailsHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID:</strong> ${nurse.employeeId}</p>
                            <p><strong>Name:</strong> ${nurse.firstName} ${nurse.lastName}</p>
                            <p><strong>Department:</strong> ${nurse.department || 'N/A'}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Contact:</strong> ${nurse.contactNumber || 'N/A'}</p>
                            <p><strong>Email:</strong> ${nurse.email || 'N/A'}</p>
                            <p><strong>Status:</strong> ${nurse.status || 'Active'}</p>
                        </div>
                    </div>
                `;
                
                $('#nurseDetailsContent').html(detailsHtml);
                
                // Get assigned patients
                $.ajax({
                    url: `/api/${nurseId}/patients`,
                    type: 'GET',
                    success: function(patients) {
                        let patientsHtml = '<h5 class="mt-3">Assigned Patients</h5>';
                        
                        if (!patients || patients.length === 0) {
                            patientsHtml += '<p>No patients assigned</p>';
                        } else {
                            patientsHtml += '<ul class="list-group">';
                            patients.forEach(patient => {
                                patientsHtml += `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        ${patient.firstName} ${patient.lastName}
                                        <span class="badge bg-primary rounded-pill">${patient.patientId}</span>
                                    </li>
                                `;
                            });
                            patientsHtml += '</ul>';
                        }
                        
                        $('#nurseDetailsContent').append(patientsHtml);
                        $('#nurseDetailsModal').modal('show');
                    },
                    error: function(err) {
                        console.error('Error loading nurse patients:', err);
                        $('#nurseDetailsContent').append('<p class="text-danger">Error loading assigned patients</p>');
                        $('#nurseDetailsModal').modal('show');
                    }
                });
            },
            error: function(err) {
                console.error('Error loading nurse details:', err);
                alert('Error loading nurse details. Please try again.');
            }
        });
    });
    
    // Edit nurse
    $('.edit-nurse').click(function() {
        const nurseId = $(this).data('id');
        
        $.ajax({
            url: `/api/${nurseId}`,
            type: 'GET',
            success: function(nurse) {
                $('#editNurseId').val(nurse.id);
                $('#editNurseFirstName').val(nurse.firstName);
                $('#editNurseLastName').val(nurse.lastName);
                $('#editNurseDepartment').val(nurse.department || '');
                $('#editNurseContact').val(nurse.contactNumber || '');
                $('#editNurseEmail').val(nurse.email || '');
                $('#editNurseStatus').val(nurse.status || 'Active');
                
                $('#editNurseModal').modal('show');
            },
            error: function(err) {
                console.error('Error loading nurse data for edit:', err);
                alert('Error loading nurse data. Please try again.');
            }
        });
    });
    
    // Delete nurse
    $('.delete-nurse').click(function() {
        const nurseId = $(this).data('id');
        
        if (confirm('Are you sure you want to delete this nurse? This may affect patient assignments.')) {
            $.ajax({
                url: `/api/${nurseId}`,
                type: 'DELETE',
                success: function() {
                    alert('Nurse deleted successfully');
                    loadNursesView();
                },
                error: function(err) {
                    console.error('Error deleting nurse:', err);
                    alert('Error deleting nurse. Please try again.');
                }
            });
        }
    });
}

// Handle add new nurse form submission
$('#addNurseForm').submit(function(e) {
    e.preventDefault();
    
    const nurseData = {
        firstName: $('#nurseFirstName').val(),
        lastName: $('#nurseLastName').val(),
        employeeType: 'NURSE',
        department: $('#nurseDepartment').val(),
        contactNumber: $('#nurseContact').val(),
        email: $('#nurseEmail').val(),
        status: $('#nurseStatus').val() || 'Active'
    };
    
    $.ajax({
        url: '/api/employees',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nurseData),
        success: function() {
            $('#addNurseModal').modal('hide');
            $('#addNurseForm')[0].reset();
            alert('Nurse added successfully');
            loadNursesView();
        },
        error: function(err) {
            console.error('Error adding nurse:', err);
            alert('Error adding nurse. Please check your data and try again.');
        }
    });
});

// Handle edit nurse form submission
$('#editNurseForm').submit(function(e) {
    e.preventDefault();
    
    const nurseId = $('#editNurseId').val();
    const nurseData = {
        firstName: $('#editNurseFirstName').val(),
        lastName: $('#editNurseLastName').val(),
        employeeType: 'NURSE',
        department: $('#editNurseDepartment').val(),
        contactNumber: $('#editNurseContact').val(),
        email: $('#editNurseEmail').val(),
        status: $('#editNurseStatus').val()
    };
    
    $.ajax({
        url: `/api/${nurseId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(nurseData),
        success: function() {
            $('#editNurseModal').modal('hide');
            alert('Nurse updated successfully');
            loadNursesView();
        },
        error: function(err) {
            console.error('Error updating nurse:', err);
            alert('Error updating nurse. Please check your data and try again.');
        }
    });
});

function loadClinicalResultsView() {
    $.ajax({
        url: '/api/clinical-results',
        type: 'GET',
        success: function(data) {
            const resultsTable = $('#clinicalResultsTable tbody');
            resultsTable.empty();
            
            if (data.length === 0) {
                resultsTable.append('<tr><td colspan="7" class="text-center">No clinical results found</td></tr>');
                return;
            }
            
            data.forEach(result => {
                const date = result.resultDate ? new Date(result.resultDate).toLocaleDateString() : 'N/A';
                resultsTable.append(`
                    <tr>
                        <td>${result.resultId || 'N/A'}</td>
                        <td>${result.patientName || 'Unknown'}</td>
                        <td>${result.resultType || 'N/A'}</td>
                        <td>${date}</td>
                        <td>${result.performedBy || 'N/A'}</td>
                        <td>${result.status || 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-result" data-id="${result.id}">View</button>
                            <button class="btn btn-sm btn-warning edit-result" data-id="${result.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-result" data-id="${result.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });
            
            setupClinicalResultActionHandlers();
        },
        error: function(err) {
            console.error('Error loading clinical results:', err);
            $('#clinicalResultsTable tbody').html('<tr><td colspan="7" class="text-center">Error loading data</td></tr>');
        }
    });
    
    // Populate patient dropdown for add result modal
    $.ajax({
        url: '/api/patients',
        type: 'GET',
        success: function(data) {
            const patientSelect = $('#resultPatientId');
            patientSelect.empty();
            patientSelect.append('<option value="">Select Patient</option>');
            
            data.forEach(patient => {
                patientSelect.append(`<option value="${patient.id}">${patient.firstName} ${patient.lastName}</option>`);
            });
        },
        error: function(err) {
            console.error('Error loading patients for dropdown:', err);
        }
    });
}

function setupClinicalResultActionHandlers() {
    // View clinical result details
    $('.view-result').click(function() {
        const resultId = $(this).data('id');
        
        $.ajax({
            url: `/api/clinical-results/${resultId}`,
            type: 'GET',
            success: function(result) {
                $('#resultDetailsModal .modal-title').text(`${result.resultType}`);
                
                const date = result.resultDate ? new Date(result.resultDate).toLocaleDateString() : 'N/A';
                const detailsHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID:</strong> ${result.resultId}</p>
                            <p><strong>Patient:</strong> ${result.patientName || 'Unknown'}</p>
                            <p><strong>Type:</strong> ${result.resultType || 'N/A'}</p>
                            <p><strong>Date:</strong> ${date}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Performed By:</strong> ${result.performedBy || 'N/A'}</p>
                            <p><strong>Status:</strong> ${result.status || 'N/A'}</p>
                            <p><strong>Units:</strong> ${result.units || 'N/A'}</p>
                            <p><strong>Reference Range:</strong> ${result.referenceRange || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <h5>Result Details</h5>
                            <p><strong>Value:</strong> ${result.resultValue || 'N/A'}</p>
                            <p><strong>Summary:</strong> ${result.resultSummary || 'No summary available'}</p>
                            <p><strong>Notes:</strong> ${result.notes || 'No notes available'}</p>
                        </div>
                    </div>
                `;
                
                $('#resultDetailsContent').html(detailsHtml);
                $('#resultDetailsModal').modal('show');
            },
            error: function(err) {
                console.error('Error loading clinical result details:', err);
                alert('Error loading clinical result details. Please try again.');
            }
        });
    });
    
    // Other handlers would be similar to previous sections
    // Edit clinical result
    $('.edit-result').click(function() {
        const resultId = $(this).data('id');
        
        $.ajax({
            url: `/api/clinical-results/${resultId}`,
            type: 'GET',
            success: function(result) {
                // Populate form fields
                $('#editResultId').val(result.id);
                // You might need to load patients for the dropdown
                // Similar to the code in loadClinicalResultsView()
                $('#editResultType').val(result.resultType || '');
                $('#editResultDate').val(result.resultDate ? result.resultDate.split('T')[0] : '');
                $('#editPerformedBy').val(result.performedBy || '');
                $('#editResultValue').val(result.resultValue || '');
                $('#editResultUnits').val(result.units || '');
                $('#editReferenceRange').val(result.referenceRange || '');
                $('#editResultSummary').val(result.resultSummary || '');
                $('#editResultNotes').val(result.notes || '');
                $('#editResultStatus').val(result.status || '');
                
                $('#editResultModal').modal('show');
            },
            error: function(err) {
                console.error('Error loading clinical result data for edit:', err);
                alert('Error loading clinical result data. Please try again.');
            }
        });
    });
    
    // Delete clinical result
    $('.delete-result').click(function() {
        const resultId = $(this).data('id');
        
        if (confirm('Are you sure you want to delete this clinical result? This action cannot be undone.')) {
            $.ajax({
                url: `/api/clinical-results/${resultId}`,
                type: 'DELETE',
                success: function() {
                    alert('Clinical result deleted successfully');
                    loadClinicalResultsView();
                },
                error: function(err) {
                    console.error('Error deleting clinical result:', err);
                    alert('Error deleting clinical result. Please try again.');
                }
            });
        }
    });
}

// Handle add new clinical result form submission
$('#addResultForm').submit(function(e) {
    e.preventDefault();
    
    const resultData = {
        patientId: $('#resultPatientId').val(),
        resultType: $('#resultType').val(),
        resultDate: $('#resultDate').val(),
        performedBy: $('#performedBy').val(),
        resultValue: $('#resultValue').val(),
        units: $('#resultUnits').val(),
        referenceRange: $('#referenceRange').val(),
        resultSummary: $('#resultSummary').val(),
        notes: $('#resultNotes').val(),
        status: $('#resultStatus').val() || 'Completed'
    };
    
    $.ajax({
        url: '/api/clinical-results',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(resultData),
        success: function() {
            $('#addResultModal').modal('hide');
            $('#addResultForm')[0].reset();
            alert('Clinical result added successfully');
            loadClinicalResultsView();
        },
        error: function(err) {
            console.error('Error adding clinical result:', err);
            alert('Error adding clinical result. Please check your data and try again.');
        }
    });
});

// Handle edit clinical result form submission
$('#editResultForm').submit(function(e) {
    e.preventDefault();
    
    const resultId = $('#editResultId').val();
    const resultData = {
        resultType: $('#editResultType').val(),
        resultDate: $('#editResultDate').val(),
        performedBy: $('#editPerformedBy').val(),
        resultValue: $('#editResultValue').val(),
        units: $('#editResultUnits').val(),
        referenceRange: $('#editReferenceRange').val(),
        resultSummary: $('#editResultSummary').val(),
        notes: $('#editResultNotes').val(),
        status: $('#editResultStatus').val()
    };
    
    $.ajax({
        url: `/api/clinical-results/${resultId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(resultData),
        success: function() {
            $('#editResultModal').modal('hide');
            alert('Clinical result updated successfully');
            loadClinicalResultsView();
        },
        error: function(err) {
            console.error('Error updating clinical result:', err);
            alert('Error updating clinical result. Please check your data and try again.');
        }
    });
});