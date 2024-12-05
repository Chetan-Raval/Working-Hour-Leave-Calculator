const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render('index', { error: null, result: null });
});

app.post('/', (req, res) => {
    const { workingHour, workingMinute, totalHour, totalMinute } = req.body;

    if (!workingHour || !workingMinute || !totalHour || !totalMinute) {
        return res.render('index', { error: 'Please fill out all fields', result: null });
    }

    // Convert input hours and minutes into total minutes
    const workingTotalMinutes = parseInt(workingHour) * 60 + parseInt(workingMinute);
    const totalDayMinutes = parseInt(totalHour) * 60 + parseInt(totalMinute);

    // Perform calculations
    const leaveMinutes = totalDayMinutes - workingTotalMinutes;
    const leavePercentage = (leaveMinutes / totalDayMinutes).toFixed(3);

    res.render('index', {
        error: null,
        result: {
            leaveHours: Math.floor(leaveMinutes / 60), // Convert minutes back to hours
            leaveMinutes: leaveMinutes % 60,          // Remaining minutes
            leavePercentage
        }
    });
});

app.get('*', (req, res) => {
    res.status(404).json({ message: "NOT FOUND" });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
