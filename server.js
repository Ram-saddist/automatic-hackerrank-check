const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
    processExcel
} = require("./excelProcessor");

const app = express();

app.use(cors());

app.use(express.json());


// =======================================
// Serve Frontend
// =======================================

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// =======================================
// File Upload
// =======================================

const upload =
    multer({
        dest: "uploads/"
    });


// =======================================
// API Test
// =======================================

app.get("/api", (req, res) => {

    res.json({
        message:
            "HackerRank Progress Tracker API is running"
    });

});


// =======================================
// Excel Processing
// =======================================

app.post(
    "/api/check-excel",
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Excel file is required"
                });

            }

            console.log(
                "\nExcel received:"
            );

            console.log(
                req.file.originalname
            );


            const results =
                await processExcel(
                    req.file.path
                );


            // Delete temporary Excel file

            fs.unlink(
                req.file.path,
                () => {}
            );


            res.json({

                success: true,

                totalStudents:
                    results.length,

                results

            });

        } catch (error) {

            console.error(
                "Excel processing error:",
                error
            );


            // Delete temporary file
            // if processing failed

            if (
                req.file &&
                req.file.path
            ) {

                fs.unlink(
                    req.file.path,
                    () => {}
                );

            }


            res.status(500).json({

                success: false,

                message:
                    "Unable to process Excel file",

                error:
                    error.message

            });

        }

    }
);


// =======================================
// Start Server
// =======================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);