//middleware\errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error("Unhandled error:", err.stack || err);

    if (err.code === 'ER_NO_DEFAULT_FOR_FIELD' && err.sqlMessage?.includes("'id'")) {
        return res.status(500).send("Database error: 'id' field needs to be auto-increment");
    }

    res.status(500).json({
        error: {
            message: err.message || "Something went wrong",
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        }
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({ error: "Route not found" });
};
