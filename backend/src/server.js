<<<<<<< HEAD
import "dotenv/config";
=======

import { PORT } from "./utils/constants.js"
import { sequelize,connectDB } from "./config/database.js"
import app from "./app.js"
import "./models/index.js"
>>>>>>> bd45bbc909cb5697fa23209ff4cf43950ed08427

import app from "./app.js";
import { sequelize, connectDB } from "./config/database.js";
import "./models/index.js";
import { PORT } from "./utils/constants.js";

await connectDB();
await sequelize.sync({ alter: true });

app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
});
