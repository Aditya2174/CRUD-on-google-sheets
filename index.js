console.log(`App listening on port hi `);
const express = require("express");
const process = require("process");

const credentials = require(`./my-project-yes-394708-87cbc149c158.json`);
const { google } = require("googleapis");

const app = express();

// const cors = require("cors"); //
// // Allow all origins (*) - This can be restricted to specific domains in production
// app.use(cors({
//   origin: '*',credentials:true
// }));
app.use(cors());
app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);

app.enable("trust proxy");
app.use(express.static(__dirname + "/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/robots', (req, res) => {
  res.status(200).sendFile(__dirname + '/robots.txt')
});
app.get('/robots.txt', (req, res) => {
  res.status(200).sendFile(__dirname + '/robots.txt')
});

app.get("/", (req, res) => {
  res.status(200).send("Up and running")
});

app.get("/sheets", (req, res) => {
  (async () => {
    try {
      const response = await getSpreadsheet();
      res.status(200).send(response);
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  })();
});



console.log(`App listening on port `);
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

// ... (other parts of the code)

app.get("/write", (req, res) => {
  const newValue = "I am writing"; // Replace this with the value you want to write to the cell
  const cellAddress = "A2"; // Replace this with the cell address where you want to write (e.g., "A1")

  (async () => {
    try {
      await writeCell(cellAddress, newValue);
      res.status(200).send(`Successfully wrote '${newValue}' to cell '${cellAddress}'.`);
    } catch (e) {
      console.error(e);
      res.status(500).send("Error writing to the cell.");
    }
  })();
});

async function writeCell(cellAddress, value) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1t_XfUhwZcEsJsyTr6NPQquazjnxmvS1jWenxg5QbMu0"; // Replace with your actual Google Sheets document ID

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!${cellAddress}`, // Replace "Sheet1" with the sheet name if different
      valueInputOption: "RAW",
      resource: {
        values: [[value]],
      },
    });

    if (response.data && response.data.updatedCells > 0) {
      console.log(`Successfully wrote '${value}' to cell '${cellAddress}'.`);
    } else {
      console.error("Error writing to the cell. No cells updated.");
      throw new Error("No cells updated.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}




async function getSpreadsheet() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1t_XfUhwZcEsJsyTr6NPQquazjnxmvS1jWenxg5QbMu0"; // Replace with your actual Google Sheets document ID

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1", // Replace with the specific sheet and range you want to read
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      let response = "";
      rows.forEach((row) => {
        response += row.join(" ") + " ";
      });
      return response;
    } else {
      return "No data found.";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
