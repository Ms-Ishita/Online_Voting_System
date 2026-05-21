import "dotenv/config";

import app from "./app.js";
import { sequelize, connectDB } from "./config/database.js";
import "./models/index.js";
import { PORT } from "./utils/constants.js";

await connectDB();
await sequelize.sync({ alter: true });

app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
});
