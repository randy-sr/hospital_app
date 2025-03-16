// clinical-results.js - Handles clinical results-related functionality

$(document).ready(function() {
    // Event listener for clinical results navigation
    $("#nav-clinical-results").click(function(e) {
        e.preventDefault();
        showClinicalResultsContent();
    });

    // Event listener for adding a new clinical result
    $(document).on("click", "#addClinicalResult", function() {
        $("#clinicalResultId").val("");
        $("#clinicalResultForm")[0].reset();
        $("#clinicalResultModalLabel").text("Add Clinical Result");
        populatePatientDropdown();
        $("#clinicalResultModal").modal("show");
    });

    // Event listener for editing a clinical result
    $(document).on("click", ".edit-result", function() {
        const resultId = $(this).data("id");
        $.get(`/api/clinical-results/${resultId}`).done(function(result) {
            $("#clinicalResultId").val(result.id);
            $("#patientSelect").val(result.patient.id);
            $("#doctorSelect").val(result.doctorId || ""); // Asumiendo que hay un doctor asociado
            $("#testName").val(result.testName || "");
            $("#result").val(result.result || "");
            $("#units").val(result.units || "");
            $("#normalRange").val(result.normalRange || "");
            $("#status").val(result.status || "");
            $("#testDate").val(result.testDate ? result.testDate.replace("Z", "") : "");
            $("#notes").val(result.notes || "");
            $("#clinicalResultModalLabel").text("Edit Clinical Result");
            populatePatientDropdown();
            $("#clinicalResultModal").modal("show");
        }).fail(function(err) {
            console.error("Error loading clinical result:", err);
            alert("Error loading clinical result.");
        });
    });

    // Event listener for saving a clinical result
    $("#saveClinicalResult").click(function() {
        if (!$("#clinicalResultForm")[0].checkValidity()) {
            $("#clinicalResultForm")[0].reportValidity();
            return;
        }

        const resultId = $("#clinicalResultId").val();
        const resultData = {
            id: resultId ? parseInt(resultId) : null,
            patient: { id: parseInt($("#patientSelect").val()) },
            testName: $("#testName").val(),
            result: $("#result").val(),
            units: $("#units").val(),
            normalRange: $("#normalRange").val(),
            status: $("#status").val(),
            testDate: $("#testDate").val(),
            notes: $("#notes").val()
        };

        const method = resultId ? "PUT" : "POST";
        const url = resultId ? `/api/clinical-results/${resultId}` : "/api/clinical-results";

        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(resultData),
            success: function() {
                $("#clinicalResultModal").modal("hide");
                showClinicalResultsContent();
                updateResultCount(); // Actualizar contador en dashboard
            },
            error: function(err) {
                console.error("Error saving clinical result:", err);
                alert("Error saving clinical result: " + (err.responseText || "Unknown error"));
            }
        });
    });

    // Event listener for deleting a clinical result
    $(document).on("click", ".delete-result", function() {
        if (confirm("Are you sure you want to delete this clinical result?")) {
            const resultId = $(this).data("id");
            $.ajax({
                url: `/api/clinical-results/${resultId}`,
                type: "DELETE",
                success: function() {
                    showClinicalResultsContent();
                    updateResultCount();
                },
                error: function(err) {
                    console.error("Error deleting clinical result:", err);
                    alert("Error deleting clinical result.");
                }
            });
        }
    });

    // Event listener for viewing clinical result details
    $(document).on("click", ".view-result", function() {
        const resultId = $(this).data("id");
        showClinicalResultDetails(resultId);
    });
});

// Function to update clinical result count on dashboard
function updateResultCount() {
    $.get("/api/clinical-results")
        .done(function(data) {
            $("#result-count").text(data.length);
        })
        .fail(function(err) {
            console.error("Error updating result count:", err);
            $("#result-count").text("Error");
        });
}

// Function to show clinical results content
function showClinicalResultsContent() {
    $("#dashboard-content, #patients-content, #doctors-content, #nurses-content").hide();
    const $content = $("#clinical-results-content");
    $content.empty();

    $content.append(`
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Clinical Results</h2>
            <button class="btn btn-primary" id="addClinicalResult">
                <i class="fas fa-plus me-2"></i>Add Clinical Result
            </button>
        </div>
        <div class="card">
            <div class="card-header">
                <h5>Clinical Results List</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Test Name</th>
                                <th>Result</th>
                                <th>Status</th>
                                <th>Test Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="clinical-results-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="clinical-result-details" class="mt-4" style="display: none;"></div>
    `);

    $.get("/api/clinical-results")
        .done(function(results) {
            const $tableBody = $("#clinical-results-table-body");
            $tableBody.empty();
            if (!results || results.length === 0) {
                $tableBody.append('<tr><td colspan="6">No clinical results found</td></tr>');
            } else {
                results.forEach(result => {
                    $tableBody.append(`
                        <tr>
                            <td>${result.patient.firstName || "N/A"} ${result.patient.lastName || "N/A"}</td>
                            <td>${result.testName || "N/A"}</td>
                            <td>${result.result || "N/A"} ${result.units || ""}</td>
                            <td>${result.status || "N/A"}</td>
                            <td>${formatDateTime(result.testDate)}</td>
                            <td>
                                <button class="btn btn-sm btn-info view-result" data-id="${result.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-primary edit-result" data-id="${result.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger delete-result" data-id="${result.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });
            }
        })
        .fail(function(err) {
            console.error("Error loading clinical results:", err);
            $("#clinical-results-table-body").html('<tr><td colspan="6">Error loading data</td></tr>');
        });

    $content.show();
}

// Function to show clinical result details
function showClinicalResultDetails(resultId) {
    $.get(`/api/clinical-results/${resultId}`).done(function(result) {
        const $details = $("#clinical-result-details");
        $details.empty();

        $details.append(`
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5>Clinical Result Details: ${result.testName || "N/A"}</h5>
                    <button class="btn btn-sm btn-secondary" id="closeDetails">
                        <i class="fas fa-times me-2"></i>Close
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">Patient</dt>
                                <dd class="col-sm-8">${result.patient.firstName || "N/A"} ${result.patient.lastName || "N/A"}</dd>
                                <dt class="col-sm-4">Test Name</dt>
                                <dd class="col-sm-8">${result.testName || "N/A"}</dd>
                                <dt class="col-sm-4">Result</dt>
                                <dd class="col-sm-8">${result.result || "N/A"} ${result.units || ""}</dd>
                                <dt class="col-sm-4">Units</dt>
                                <dd class="col-sm-8">${result.units || "N/A"}</dd>
                            </dl>
                        </div>
                        <div class="col-md-6">
                            <dl class="row">
                                <dt class="col-sm-4">Normal Range</dt>
                                <dd class="col-sm-8">${result.normalRange || "N/A"}</dd>
                                <dt class="col-sm-4">Status</dt>
                                <dd class="col-sm-8">${result.status || "N/A"}</dd>
                                <dt class="col-sm-4">Test Date</dt>
                                <dd class="col-sm-8">${formatDateTime(result.testDate)}</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <h6>Notes</h6>
                            <p>${result.notes || "No notes available"}</p>
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
        console.error("Error loading clinical result details:", err);
        alert("Error loading clinical result details.");
    });
}

// Function to populate patient dropdown in the modal
function populatePatientDropdown() {
    const $patientSelect = $("#patientSelect");
    $patientSelect.empty();
    $patientSelect.append('<option value="">Select Patient</option>');
    
    $.get("/api/patients")
        .done(function(patients) {
            if (!Array.isArray(patients) || patients.length === 0) {
                $patientSelect.append('<option value="">No patients available</option>');
                return;
            }
            patients.forEach(patient => {
                $patientSelect.append(`<option value="${patient.id}">${patient.firstName || "N/A"} ${patient.lastName || "N/A"}</option>`);
            });
        })
        .fail(function(err) {
            console.error("Error loading patients:", err);
            $patientSelect.append('<option value="">Error loading patients</option>');
        });
}

// Helper function to format date and time
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return "N/A";
    const dateTime = new Date(dateTimeString);
    return `${dateTime.getDate().toString().padStart(2, "0")}/${(dateTime.getMonth() + 1).toString().padStart(2, "0")}/${dateTime.getFullYear()} ${dateTime.getHours().toString().padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`;
}