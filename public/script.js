const excelFile =
    document.getElementById(
        "excelFile"
    );


const checkButton =
    document.getElementById(
        "checkButton"
    );


const resetButton =
    document.getElementById(
        "resetButton"
    );


const fileName =
    document.getElementById(
        "fileName"
    );


const message =
    document.getElementById(
        "message"
    );


const loading =
    document.getElementById(
        "loading"
    );


const resultsSection =
    document.getElementById(
        "resultsSection"
    );


const resultsBody =
    document.getElementById(
        "resultsBody"
    );


const totalStudents =
    document.getElementById(
        "totalStudents"
    );


// =======================================
// File Selected
// =======================================

excelFile.addEventListener(
    "change",
    () => {

        const file =
            excelFile.files[0];


        if (!file) {

            fileName.textContent = "";

            return;

        }


        fileName.textContent =
            `Selected file: ${file.name}`;

    }
);


// =======================================
// Check HackerRank
// =======================================

checkButton.addEventListener(
    "click",
    async () => {

        const file =
            excelFile.files[0];


        // -------------------------------
        // Validate file
        // -------------------------------

        if (!file) {

            showMessage(
                "Please select an Excel file.",
                "error"
            );

            return;

        }


        // -------------------------------
        // Validate extension
        // -------------------------------

        const validExtensions =
            [".xlsx", ".xls"];


        const extension =
            file.name
                .substring(
                    file.name.lastIndexOf(".")
                )
                .toLowerCase();


        if (
            !validExtensions.includes(
                extension
            )
        ) {

            showMessage(
                "Please select an Excel file (.xlsx or .xls).",
                "error"
            );

            return;

        }


        // -------------------------------
        // Prepare FormData
        // -------------------------------

        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );


        // -------------------------------
        // UI
        // -------------------------------

        checkButton.disabled = true;

        loading.classList.remove(
            "hidden"
        );

        resultsSection.classList.add(
            "hidden"
        );

        message.textContent = "";

        resultsBody.innerHTML = "";


        try {

            // -------------------------------
            // Send to Node backend
            // -------------------------------

            const response =
                await fetch(
                    "/api/check-excel",
                    {

                        method: "POST",

                        body: formData

                    }
                );


            const data =
                await response.json();


            // -------------------------------
            // Backend Error
            // -------------------------------

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to process Excel"
                );

            }


            // -------------------------------
            // Display Results
            // -------------------------------

            displayResults(
                data.results
            );


        } catch (error) {

            console.error(
                error
            );


            showMessage(
                error.message ||
                "Something went wrong.",
                "error"
            );


        } finally {

            loading.classList.add(
                "hidden"
            );

            checkButton.disabled =
                false;

        }

    }
);


// =======================================
// Display Results
// =======================================

function displayResults(
    results
) {

    resultsBody.innerHTML = "";


    totalStudents.textContent =
        `Total Students: ${results.length}`;


    results.forEach(
        (student, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            const statusClass =
                student.status === "Success"
                    ? "success"
                    : "failed";


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            student.studentName
                        )}
                    </strong>
                </td>

                <td>
                    ${
                        student.username
                            ? escapeHtml(
                                student.username
                            )
                            : "-"
                    }
                </td>

                <td>
                    ${
                        student.cStars !== ""
                            ? " " +
                              student.cStars
                            : "-"
                    }
                </td>

                <td>
                    ${
                        student.problemsSolved !== ""
                            ? student.problemsSolved
                            : "-"
                    }
                </td>

                <td>
                    ${
                        student.totalChallenges !== ""
                            ? student.totalChallenges
                            : "-"
                    }
                </td>

                <td class="${statusClass}">
                    ${
                        student.status === "Success"
                            ? "✓ Success"
                            : "✕ " +
                              escapeHtml(
                                  student.status
                              )
                    }
                </td>

            `;


            resultsBody.appendChild(
                row
            );

        }
    );


    resultsSection.classList.remove(
        "hidden"
    );

}


// =======================================
// Reset
// =======================================

resetButton.addEventListener(
    "click",
    () => {

        excelFile.value = "";

        fileName.textContent = "";

        message.textContent = "";

        resultsBody.innerHTML = "";

        resultsSection.classList.add(
            "hidden"
        );

    }
);


// =======================================
// Message
// =======================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        `message ${type}`;

}


// =======================================
// HTML Escape
// =======================================

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}