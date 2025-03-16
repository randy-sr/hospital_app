// patients.js - Handles patient-related functionality

$(document).ready(function() {
    // Event listener for patients navigation (delegado a main.js, aquí solo definimos la función)
    $("#nav-patients").click(function(e) {
        e.preventDefault();
        showPatientsContent();
    });

    // Event listener for adding a new patient
    $(document).on("click", "#addPatient", function() {
        $("#patientId").val("");
        $("#patientForm")[0].reset();
        $("#patientModalLabel").text("Add Patient");
        $("#patientModal").modal("show");
    });

    // Event listener for editing a patient
    $(document).on("click", ".edit-patient", function() {
        const patientId = $(this).data("id");
        $.get(`/api/patients/${patientId}`, function(patient) {
            $("#patientId").val(patient.id);
            $("#firstName").val(patient.firstName || "");
            $("#lastName").val(patient.lastName || "");
            $("#dateOfBirth").val(patient.dateOfBirth || "");
            $("#gender").val(patient.gender || "");
            $("#address").val(patient.address || "");
            $("#phoneNumber").val(patient.phoneNumber || "");
            $("#email").val(patient.email || "");
            $("#insuranceDetails").val(patient.insuranceDetails || "");
            $("#patientModalLabel").text("Edit Patient");
            $("#patientModal").modal("show");
        }).fail(function(err) {
            console.error("Error loading patient:", err);
            alert("Error loading patient data.");
        });
    });

    // Event listener for saving a patient
    $("#savePatient").click(function() {
        if (!$("#patientForm")[0].checkValidity()) {
            $("#patientForm")[0].reportValidity();
            return;
        }

        const patientId = $("#patientId").val();
        const patientData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            dateOfBirth: $("#dateOfBirth").val(),
            gender: $("#gender").val(),
            address: $("#address").val(),
            phoneNumber: $("#phoneNumber").val(),
            email: $("#email").val(),
            insuranceDetails: $("#insuranceDetails").val(),
            doctors: patientId ? undefined : [], // Inicializar solo en creación
            nurses: patientId ? undefined : []
        };

        const method = patientId ? "PUT" : "POST";
        const url = patientId ? `/api/patients/${patientId}` : "/api/patients";
		console.log(url)
        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(patientData),
            success: function() {
				console.log(patientData)
                $("#patientModal").modal("hide");
                showPatientsContent(); // Refrescar lista
                updatePatientCount(); // Actualizar contador en dashboard
                displayRecentPatients(); // Actualizar recientes en dashboard
            },
            error: function(err) {
                console.error("Error saving patient:", err);
                alert("Error saving patient.");
            }
        });
    });

    // Event listener for deleting a patient
    $(document).on("click", ".delete-patient", function() {
        if (confirm("Are you sure you want to delete this patient?")) {
            const patientId = $(this).data("id");
            $.ajax({
                url: `/api/patients/${patientId}`,
                type: "DELETE",
                success: function() {
                    showPatientsContent(); // Refrescar lista
                    updatePatientCount(); // Actualizar contador
                    displayRecentPatients(); // Actualizar recientes
                },
                error: function(err) {
                    console.error("Error deleting patient:", err);
                    alert("Error deleting patient.");
                }
            });
        }
    });

    // Event listener for assigning staff to a patient
    $(document).on("click", ".assign-staff", function() {
        const patientId = $(this).data("id");
        $("#assignPatientId").val(patientId);
        $("#staffType").val("");
        $("#doctorSelectDiv").hide();
        $("#nurseSelectDiv").hide();
        populateStaffDropdowns();
        $("#assignStaffModal").modal("show");
    });

    // Event listener for staff type change
    $("#staffType").change(function() {
        const staffType = $(this).val();
        $("#doctorSelectDiv").hide();
        $("#nurseSelectDiv").hide();
        if (staffType === "doctor") {
            $("#doctorSelectDiv").show();
        } else if (staffType === "nurse") {
            $("#nurseSelectDiv").show();
        }
    });

    // Event listener for saving staff assignment
    $("#saveAssignment").click(function() {
        const patientId = parseInt($("#assignPatientId").val());
        const staffType = $("#staffType").val();
        if (!staffType) {
            alert("Please select a staff type.");
            return;
        }

        let staffId;
        if (staffType === "doctor") {
            staffId = parseInt($("#assignDoctorSelect").val());
            if (!staffId) {
                alert("Please select a doctor.");
                return;
            }
            $.ajax({
                url: `/api/patients/${patientId}/doctors/${staffId}`,
                type: "POST",
                success: function() {
                    $("#assignStaffModal").modal("hide");
                    showPatientsContent(); // Refrescar lista
                },
                error: function(err) {
                    console.error("Error assigning doctor:", err);
                    alert("Error assigning doctor.");
                }
            });
        } else if (staffType === "nurse") {
            staffId = parseInt($("#assignNurseSelect").val());
            if (!staffId) {
                alert("Please select a nurse.");
                return;
            }
            $.ajax({
                url: `/api/patients/${patientId}/nurses/${staffId}`,
                type: "POST",
                success: function() {
                    $("#assignStaffModal").modal("hide");
                    showPatientsContent(); // Refrescar lista
                },
                error: function(err) {
                    console.error("Error assigning nurse:", err);
                    alert("Error assigning nurse.");
                }
            });
        }
    });

    // Event listener for viewing patient details
    $(document).on("click", ".view-patient", function() {
        const patientId = $(this).data("id");
        showPatientDetails(patientId);
    });
});

// Function to update patient count on dashboard
function updatePatientCount() {
    $.get("/api/patients", function(data) {
        $("#patient-count").text(data.length);
    }).fail(function(err) {
        console.error("Error updating patient count:", err);
        $("#patient-count").text("Error");
    });
}

// Function to display recent patients on dashboard
function displayRecentPatients() {
    const $table = $("#recent-patients-table tbody");
    $table.empty();

    $.get("/api/patients", function(data) {
        const recentPatients = data.slice(-5).reverse(); // Últimos 5 pacientes
        recentPatients.forEach(patient => {
            $table.append(`
                <tr>
                    <td>${patient.firstName || "N/A"} ${patient.lastName || "N/A"}</td>
                    <td>${patient.gender || "N/A"}</td>
                    <td>${patient.phoneNumber || "N/A"}</td>
                </tr>
            `);
        });
    }).fail(function(err) {
        console.error("Error loading recent patients:", err);
        $table.append('<tr><td colspan="3">Error loading data</td></tr>');
    });
}

// Function to show patients content
function showPatientsContent() {
    $("#dashboard-content, #doctors-content, #nurses-content, #clinical-results-content").hide();
    const $content = $("#patients-content");
    $content.empty();

    $content.append(`
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Patients</h2>
            <button class="btn btn-primary" id="addPatient">
                <i class="fas fa-plus me-2"></i>Add Patient
            </button>
        </div>
        <div class="card">
            <div class="card-header">
                <h5>Patient List</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Date of Birth</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="patients-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="patient-details" class="mt-4" style="display: none;"></div>
    `);

    $.get("/api/patients", function(patients) {
        const $tableBody = $("#patients-table-body");
        $tableBody.empty();
        if (patients.length === 0) {
            $tableBody.append('<tr><td colspan="6">No patients found</td></tr>');
        } else {
            patients.forEach(patient => {
                $tableBody.append(`
                    <tr>
                        <td>${patient.firstName || "N/A"}</td>
                        <td>${patient.lastName || "N/A"}</td>
                        <td>${patient.gender || "N/A"}</td>
                        <td>${formatDate(patient.dateOfBirth)}</td>
                        <td>${patient.phoneNumber || "N/A"}</td>
                        <td>${patient.email || "N/A"}</td>
                        <td>
                            <button class="btn btn-sm btn-info view-patient" data-id="${patient.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary edit-patient" data-id="${patient.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-patient" data-id="${patient.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-success assign-staff" data-id="${patient.id}">
                                <i class="fas fa-user-md"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    }).fail(function(err) {
        console.error("Error loading patients:", err);
        $("#patients-table-body").html('<tr><td colspan="6">Error loading data</td></tr>');
    });

    $content.show();
}

// Function to show patient details
function showPatientDetails(patientId) {
    $.get(`/api/patients/${patientId}`, function(patient) {
        const $details = $("#patient-details");
        $details.empty();

		const assignedDoctors = (patient.assignedEmployees  || [])
								.filter(emp => emp.specialization)
								.map(d => `${d.firstName} ${d.lastName} (${d.specialization || "N/A"})`)
								.join(", ") || "None";
		const assignedNurses = (patient.assignedEmployees  || [])
								.filter(emp => !emp.specialization)
								.map(n => `${n.firstName} ${n.lastName}`)
								.join(", ") || "None";
		
		console.log("Doctor", assignedDoctors)						
		console.log("Nurse", assignedNurses)	
		
        const birthDate = new Date(patient.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        $details.append(`
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5>Patient Details: ${patient.firstName + " " + patient.lastName}</h5>
                    <button class="btn btn-sm btn-secondary" id="closeDetails">
                        <i class="fas fa-times me-2"></i>Close
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">First Name</dt>
                                <dd class="col-sm-8">${patient.firstName || "N/A"}</dd>
                                <dt class="col-sm-4">Last Name</dt>
                                <dd class="col-sm-8">${patient.lastName || "N/A"}</dd>
                                <dt class="col-sm-4">Gender</dt>
                                <dd class="col-sm-8">${patient.gender || "N/A"}</dd>
                                <dt class="col-sm-4">Date of Birth</dt>
                                <dd class="col-sm-8">${formatDate(patient.dateOfBirth)} (Age: ${age})</dd>
                                <dt class="col-sm-4">Address</dt>
                                <dd class="col-sm-8">${patient.address || "N/A"}</dd>
                            </dl>
                        </div>
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">Phone</dt>
                                <dd class="col-sm-8">${patient.phoneNumber || "N/A"}</dd>
                                <dt class="col-sm-4">Email</dt>
                                <dd class="col-sm-8">${patient.email || "N/A"}</dd>
                                <dt class="col-sm-4">Insurance</dt>
                                <dd class="col-sm-8">${patient.insuranceDetails || "N/A"}</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h6>Assigned Doctors</h6>
                            <p>${assignedDoctors}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Assigned Nurses</h6>
                            <p>${assignedNurses}</p>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <h6>Clinical Results</h6>
                            <p>${patient.clinicalResults || "No clinical results available"}</p>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $("#closeDetails").click(function() {
            $details.hide();
        });

        $details.show();
    }).fail(function(err) {
        console.error("Error loading patient details:", err);
        alert("Error loading patient details.");
    });
}

// Function to populate staff dropdowns in the assign staff modal
function populateStaffDropdowns() {
    const $doctorSelect = $("#assignDoctorSelect");
    $doctorSelect.empty();
    $doctorSelect.append('<option value="">Select Doctor</option>');
    
    $.get("/api/doctors")
        .done(function(doctors) {
            if (!Array.isArray(doctors) || doctors.length === 0) {
                $doctorSelect.append('<option value="">No doctors available</option>');
                return;
            }
            doctors.forEach(doctor => {
                const doctorName = `${doctor.firstName || "N/A"} ${doctor.lastName || "N/A"}`;
                $doctorSelect.append(`<option value="${doctor.id}">${doctorName} (${doctor.specialization || "N/A"})</option>`);
            });
        })
        .fail(function(err) {
            console.error("Error loading doctors:", err);
            $doctorSelect.append('<option value="">Error loading doctors</option>');
        });

    const $nurseSelect = $("#assignNurseSelect");
    $nurseSelect.empty();
    $nurseSelect.append('<option value="">Select Nurse</option>');
    
    $.get("/api/nurses")
        .done(function(nurses) {
            if (!Array.isArray(nurses) || nurses.length === 0) {
                $nurseSelect.append('<option value="">No nurses available</option>');
                return;
            }
            nurses.forEach(nurse => {
                const nurseName = `${nurse.firstName || "N/A"} ${nurse.lastName || "N/A"}`;
                $nurseSelect.append(`<option value="${nurse.id}">${nurseName} (${nurse.department || "N/A"})</option>`);
            });
        })
        .fail(function(err) {
            console.error("Error loading nurses:", err);
            $nurseSelect.append('<option value="">Error loading nurses</option>');
        });
}

// Helper function to format date (YYYY-MM-DD to DD/MM/YYYY)
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

// Export functions for other modules (opcional, si otros módulos lo necesitan)
window.getPatients = function() {
    return $.get("/api/patients");
};

window.getPatientById = function(id) {
    return $.get(`/api/patients/${id}`);
};