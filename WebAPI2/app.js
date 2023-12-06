const express = require('express');
const app = express();
const port = 3004;
const { connectToDatabase, initializeLabs, login, getCollection, insertTestData, getAllConfig, editDeviceConfig, getAllAlarms, removeDevice, getAllHomePageData, addAlarm, editAlarm, removeAlarm } = require('./db');

let database; // Define the database variable

app.use(express.json());

app.get('/', (req, res) => {
  res.send('LabSensors API is Active');
});

// General Finder
app.get('/login', async (req, res) => {
  const nameOfLab = req.query.labName;
  const passwordOfLab = req.query.labPassword;

  connectToDatabase((err, db) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    login(db, nameOfLab, passwordOfLab, (loginErr, success) => {
      if (loginErr) {
        console.error(loginErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (success) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        return res.status(401).json({ success: false, message: 'Login failed' });
      }
    });
  });
});

///////////////////////
// Homepage endpoints
///////////////////////

// Gets All Home Page Data
app.get('/GetHomePageData', (req, res) => {
  const labApi = req.query.labApi;

  connectToDatabase((err, db) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    getAllHomePageData(db, labApi, (dataErr, data) => {
      if (dataErr) {
        console.error(dataErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ success: true, data });
    });
  });
});

///////////////////////
// Config Page endpoints
///////////////////////

// Gets All Config Data
app.get('/GetAllConfig', (req, res) => {
  const labApi = req.query.labApi;

  connectToDatabase((err, db) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    getAllConfig(db, labApi, (configErr, configData) => {
      if (configErr) {
        console.error(configErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ success: true, configData });
    });
  });
});

// Edit Device Config
app.put('/EditDeviceConfig', (req, res) => {
  const labApi = req.query.labApi;
  const deviceConfig = req.body; // Assuming the device config is sent in the request body

  connectToDatabase((err, db) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    editDeviceConfig(db, labApi, deviceConfig, (editErr, editedConfig) => {
      if (editErr) {
        console.error(editErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ success: true, editedConfig });
    });
  });
});

// Remove Device endpoint
app.delete('/RemoveDevice', (req, res) => {
    const labApi = req.query.labApi;
    const deviceID = req.query.deviceID;
  
    connectToDatabase((err, db) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      removeDevice(db, labApi, deviceID, (removeErr, result) => {
        if (removeErr) {
          console.error(removeErr);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        res.json({ success: true, message: result });
      });
    });
  });

///////////////////////
// Alarm Page endpoints
///////////////////////

// Gets All Alarm Data
app.get('/GetAllAlarms', (req, res) => {
    const labApi = req.query.labApi;
  
    connectToDatabase((err, db) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      getAllAlarms(db, labApi, (alarmErr, alarmData) => {
        if (alarmErr) {
          console.error(alarmErr);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        res.json(alarmData);
      });
    });
});

// Add Alarm endpoint
app.post('/AddAlarm', (req, res) => {
    const labApi = req.query.labApi;
    const alarmObject = req.body; // Assuming the alarm object is sent in the request body
  
    connectToDatabase((err, db) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      addAlarm(db, labApi, alarmObject, (addAlarmErr, result) => {
        if (addAlarmErr) {
          console.error(addAlarmErr);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        res.json({ success: true, message: result });
      });
    });
});

// Edit Alarm endpoint
app.put('/EditAlarm', (req, res) => {
    const labApi = req.query.labApi;
    const updatedAlarm = req.body; // Assuming the updated alarm object is sent in the request body

    connectToDatabase((err, db) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        editAlarm(db, labApi, updatedAlarm, (editErr, result) => {
            if (editErr) {
                console.error(editErr);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({ success: true, message: result });
        });
    });
});

// Remove Alarm endpoint
// Sometimes locks db file??
app.delete('/RemoveAlarm', (req, res) => {
    const labApi = req.query.labApi;
    const alarmID = req.query.alarmID;

    connectToDatabase((err, db) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        removeAlarm(db, labApi, alarmID, (removeErr, result) => {
            if (removeErr) {
                console.error(removeErr);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({ success: true, message: result });
        });
    });
});


// Start the server
connectToDatabase((err, db) => {
  if (err) {
    console.error(err);
  } else {
    database = db; // Set the database variable
    // Populates non-lab collections
    insertTestData(database, (initErr, result) => {
        if (initErr) throw initErr;
        else {
            console.log(result);
        }
    })

    initializeLabs(database, (initErr, result) => {
      if (initErr) {
        console.error(initErr);
      } else {
        console.log(result);
        app.listen(port, () => {
          console.log(`Server is listening at http://localhost:${port}`);
        });
      }
    });
  }
});
