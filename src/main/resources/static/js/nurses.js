// nurses.js - Handles nurse-related functionality

$(document).ready(function() {
    // Event listener for nurses navigation (delegado a main.js, aquí definimos la función)
    $("#nav-nurses").click(function(e) {
        e.preventDefault();
        showNursesContent();
    });

    // Event listener for adding a new nurse
    $(document).on("click", "#addNurse", function() {
        $("#nurseId").val("");
        $("#nurseForm")[0].reset();
        $("#nurseModalLabel").text("Add Nurse");
        $("#nurseModal").modal("show");
    });

    // Event listener for editing a nurse
    $(document).on("click", ".edit-nurse", function() {
        const nurseId = $(this).data("id");
        $.get(`/api/nurses/${nurseId}`, function(nurse) {
            $("#nurseId").val(nurse.id);
            $("#nurseFirstName").val(nurse.firstName || "");
            $("#nurseLastName").val(nurse.lastName || "");
            $("#department").val(nurse.department || "");
            $("#certificationNumber").val(nurse.certificationNumber || "");
            $("#nurseEmail").val(nurse.email || "");
            $("#nursePhoneNumber").val(nurse.phoneNumber || "");
            $("#nurseModalLabel").text("Edit Nurse");
            $("#nurseModal").modal("show");
        }).fail(function(err) {
            console.error("Error loading nurse:", err);
            alert("Error loading nurse data.");
        });
    });

    // Event listener for saving a nurse
    $("#saveNurse").click(function() {
        if (!$("#nurseForm")[0].checkValidity()) {
            $("#nurseForm")[0].reportValidity();
            return;
        }

        const nurseId = $("#nurseId").val();
        const nurseData = {
            firstName: $("#nurseFirstName").val(),
            lastName: $("#nurseLastName").val(),
            department: $("#department").val(),
            certificationNumber: $("#certificationNumber").val(),
            email: $("#nurseEmail").val(),
            phoneNumber: $("#nursePhoneNumber").val()
        };

        const method = nurseId ? "PUT" : "POST";
        const url = nurseId ? `/api/nurses/${nurseId}` : "/api/nurses";

        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(nurseData),
            success: function() {
                $("#nurseModal").modal("hide");
                showNursesContent(); // Refrescar lista
                updateNurseCount(); // Actualizar contador en dashboard
            },
            error: function(err) {
                console.error("Error saving nurse:", err);
                alert("Error saving nurse.");
            }
        });
    });

    // Event listener for deleting a nurse
    $(document).on("click", ".delete-nurse", function() {
        if (confirm("Are you sure you want to delete this nurse? This may affect patient assignments.")) {
            const nurseId = $(this).data("id");
            $.ajax({
                url: `/api/nurses/${nurseId}`,
                type: "DELETE",
                success: function() {
                    showNursesContent(); // Refrescar lista
                    updateNurseCount(); // Actualizar contador
                },
                error: function(err) {
                    console.error("Error deleting nurse:", err);
                    alert("Error deleting nurse.");
                }
            });
        }
    });

    // Event listener for viewing nurse details
    $(document).on("click", ".view-nurse", function() {
        const nurseId = $(this).data("id");
        showNurseDetails(nurseId);
    });
});

// Function to update nurse count on dashboard
function updateNurseCount() {
    $.get("/api/nurses", function(data) {
        $("#nurse-count").text(data.length);
    }).fail(function(err) {
        console.error("Error updating nurse count:", err);
        $("#nurse-count").text("Error");
    });
}

// Function to show nurses content
function showNursesContent() {
    $("#dashboard-content, #patients-content, #doctors-content, #clinical-results-content").hide();
    const $content = $("#nurses-content");
    $content.empty();

    $content.append(`
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Nurses</h2>
            <button class="btn btn-primary" id="addNurse">
                <i class="fas fa-plus me-2"></i>Add Nurse
            </button>
        </div>
        <div class="card">
            <div class="card-header">
                <h5>Nurse List</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Department</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="nurses-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="nurse-details" class="mt-4" style="display: none;"></div>
    `);

    $.get("/api/nurses", function(nurses) {
        const $tableBody = $("#nurses-table-body");
        $tableBody.empty();
        if (nurses.length === 0) {
            $tableBody.append('<tr><td colspan="6">No nurses found</td></tr>');
        } else {
            nurses.forEach(nurse => {
                $tableBody.append(`
                    <tr>
                        <td>${nurse.firstName || "N/A"}</td>
                        <td>${nurse.lastName || "N/A"}</td>
                        <td>${nurse.department || "N/A"}</td>
                        <td>${nurse.phoneNumber || "N/A"}</td>
                        <td>${nurse.email || "N/A"}</td>
                        <td>
                            <button class="btn btn-sm btn-info view-nurse" data-id="${nurse.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary edit-nurse" data-id="${nurse.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-nurse" data-id="${nurse.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    }).fail(function(err) {
        console.error("Error loading nurses:", err);
        $("#nurses-table-body").html('<tr><td colspan="6">Error loading data</td></tr>');
    });

    $content.show();
}

// Function to show nurse details
function showNurseDetails(nurseId) {
    $.get(`/api/nurses/${nurseId}`, function(nurse) {
        const $details = $("#nurse-details");
        $details.empty();

        $details.append(`
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5>Nurse Details: ${nurse.firstName || "N/A"} ${nurse.lastName || "N/A"}</h5>
                    <button class="btn btn-sm btn-secondary" id="closeDetails">
                        <i class="fas fa-times me-2"></i>Close
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">First Name</dt>
                                <dd class="col-sm-8">${nurse.firstName || "N/A"}</dd>
                                <dt class="col-sm-4">Last Name</dt>
                                <dd class="col-sm-8">${nurse.lastName || "N/A"}</dd>
                                <dt class="col-sm-4">Department</dt>
                                <dd class="col-sm-8">${nurse.department || "N/A"}</dd>
                                <dt class="col-sm-4">Certification</dt>
                                <dd class="col-sm-8">${nurse.certificationNumber || "N/A"}</dd>
                            </dl>
                        </div>
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">Phone</dt>
                                <dd class="col-sm-8">${nurse.phoneNumber || "N/A"}</dd>
                                <dt class="col-sm-4">Email</dt>
                                <dd class="col-sm-8">${nurse.email || "N/A"}</dd>
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
        console.error("Error loading nurse details:", err);
        alert("Error loading nurse details.");
    });
}

// Export functions for other modules
window.getNurses = function() {
    return $.get("/api/nurses");
};

window.getNurseById = function(id) {
    return $.get(`/api/nurses/${id}`);
};