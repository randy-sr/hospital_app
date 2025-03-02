// doctors.js - Handles doctor-related functionality

$(document).ready(function() {
    // Event listener for doctors navigation (delegado a main.js, aquí definimos la función)
    $("#nav-doctors").click(function(e) {
        e.preventDefault();
        showDoctorsContent();
    });

    // Event listener for adding a new doctor
    $(document).on("click", "#addDoctor", function() {
        $("#doctorId").val("");
        $("#doctorForm")[0].reset();
        $("#doctorModalLabel").text("Add Doctor");
        $("#doctorModal").modal("show");
    });

    // Event listener for editing a doctor
    $(document).on("click", ".edit-doctor", function() {
        const doctorId = $(this).data("id");
        $.get(`/api/doctors/${doctorId}`, function(doctor) {
            $("#doctorId").val(doctor.id);
            $("#doctorFirstName").val(doctor.firstName || "");
            $("#doctorLastName").val(doctor.lastName || "");
            $("#specialization").val(doctor.specialization || "");
            $("#licenseNumber").val(doctor.licenseNumber || "");
            $("#doctorEmail").val(doctor.email || "");
            $("#doctorPhoneNumber").val(doctor.phoneNumber || "");
            $("#doctorModalLabel").text("Edit Doctor");
            $("#doctorModal").modal("show");
        }).fail(function(err) {
            console.error("Error loading doctor:", err);
            alert("Error loading doctor data.");
        });
    });

    // Event listener for saving a doctor
    $("#saveDoctor").click(function() {
        if (!$("#doctorForm")[0].checkValidity()) {
            $("#doctorForm")[0].reportValidity();
            return;
        }

        const doctorId = $("#doctorId").val();
        const doctorData = {
            firstName: $("#doctorFirstName").val(),
            lastName: $("#doctorLastName").val(),
            specialization: $("#specialization").val(),
            licenseNumber: $("#licenseNumber").val(),
            email: $("#doctorEmail").val(),
            phoneNumber: $("#doctorPhoneNumber").val()
        };

        const method = doctorId ? "PUT" : "POST";
        const url = doctorId ? `/api/doctors/${doctorId}` : "/api/doctors";

        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(doctorData),
            success: function() {
                $("#doctorModal").modal("hide");
                showDoctorsContent(); // Refrescar lista
                updateDoctorCount(); // Actualizar contador en dashboard
            },
            error: function(err) {
                console.error("Error saving doctor:", err);
                alert("Error saving doctor.");
            }
        });
    });

    // Event listener for deleting a doctor
    $(document).on("click", ".delete-doctor", function() {
        if (confirm("Are you sure you want to delete this doctor? This may affect patient assignments.")) {
            const doctorId = $(this).data("id");
            $.ajax({
                url: `/api/doctors/${doctorId}`,
                type: "DELETE",
                success: function() {
                    showDoctorsContent(); // Refrescar lista
                    updateDoctorCount(); // Actualizar contador
                },
                error: function(err) {
                    console.error("Error deleting doctor:", err);
                    alert("Error deleting doctor.");
                }
            });
        }
    });

    // Event listener for viewing doctor details
    $(document).on("click", ".view-doctor", function() {
        const doctorId = $(this).data("id");
        showDoctorDetails(doctorId);
    });
});

// Function to update doctor count on dashboard
function updateDoctorCount() {
    $.get("/api/doctors", function(data) {
        $("#doctor-count").text(data.length);
    }).fail(function(err) {
        console.error("Error updating doctor count:", err);
        $("#doctor-count").text("Error");
    });
}

// Function to show doctors content
function showDoctorsContent() {
    $("#dashboard-content, #patients-content, #nurses-content, #clinical-results-content").hide();
    const $content = $("#doctors-content");
    $content.empty();

    $content.append(`
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Doctors</h2>
            <button class="btn btn-primary" id="addDoctor">
                <i class="fas fa-plus me-2"></i>Add Doctor
            </button>
        </div>
        <div class="card">
            <div class="card-header">
                <h5>Doctor List</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Specialization</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="doctors-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="doctor-details" class="mt-4" style="display: none;"></div>
    `);

    $.get("/api/doctors", function(doctors) {
        const $tableBody = $("#doctors-table-body");
        $tableBody.empty();
        if (doctors.length === 0) {
            $tableBody.append('<tr><td colspan="6">No doctors found</td></tr>');
        } else {
            doctors.forEach(doctor => {
                $tableBody.append(`
                    <tr>
                        <td>${doctor.firstName || "N/A"}</td>
                        <td>${doctor.lastName || "N/A"}</td>
                        <td>${doctor.specialization || "N/A"}</td>
                        <td>${doctor.phoneNumber || "N/A"}</td>
                        <td>${doctor.email || "N/A"}</td>
                        <td>
                            <button class="btn btn-sm btn-info view-doctor" data-id="${doctor.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary edit-doctor" data-id="${doctor.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-doctor" data-id="${doctor.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    }).fail(function(err) {
        console.error("Error loading doctors:", err);
        $("#doctors-table-body").html('<tr><td colspan="6">Error loading data</td></tr>');
    });

    $content.show();
}

// Function to show doctor details
function showDoctorDetails(doctorId) {
    $.get(`/api/doctors/${doctorId}`, function(doctor) {
        const $details = $("#doctor-details");
        $details.empty();

        $details.append(`
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5>Doctor Details: Dr. ${doctor.firstName || "N/A"} ${doctor.lastName || "N/A"}</h5>
                    <button class="btn btn-sm btn-secondary" id="closeDetails">
                        <i class="fas fa-times me-2"></i>Close
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">First Name</dt>
                                <dd class="col-sm-8">${doctor.firstName || "N/A"}</dd>
                                <dt class="col-sm-4">Last Name</dt>
                                <dd class="col-sm-8">${doctor.lastName || "N/A"}</dd>
                                <dt class="col-sm-4">Specialization</dt>
                                <dd class="col-sm-8">${doctor.specialization || "N/A"}</dd>
                                <dt class="col-sm-4">License Number</dt>
                                <dd class="col-sm-8">${doctor.licenseNumber || "N/A"}</dd>
                            </dl>
                        </div>
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">Phone</dt>
                                <dd class="col-sm-8">${doctor.phoneNumber || "N/A"}</dd>
                                <dt class="col-sm-4">Email</dt>
                                <dd class="col-sm-8">${doctor.email || "N/A"}</dd>
                            </dl>
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
        console.error("Error loading doctor details:", err);
        alert("Error loading doctor details.");
    });
}

// Export functions for other modules
window.getDoctors = function() {
    return $.get("/api/doctors");
};

window.getDoctorById = function(id) {
    return $.get(`/api/doctors/${id}`);
};