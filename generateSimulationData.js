import pkg from 'pg';
const { Pool } = pkg;

// Database Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "aqms",
  password : "2023",
  port:5432,
});

// Kathmandu Data Constants
const KATHMANDU_CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur", "Kirtipur", "Thimi"];
const KATHMANDU_STREETS = ["Thamel", "Baneshwor", "Patan", "Jawalakhel", "Boudha", "Gongabu", "Kalanki", "Maharajgunj", "Balaju", "Chabahil", "Lazimpat", "Durbarmarg", "Jhamsikhel", "Sanepa"];
const CLINIC_NAMES = ["Valley General", "Kathmandu Ortho Care", "Himalayan Derma", "Sagarmatha Cardio", "Patan ENT & Neuro"];
const DEPARTMENTS = ["General Medicine", "Pediatrics", "Orthopedics", "Dermatology", "Cardiology", "ENT", "Gynecology"];

const NAMES_FIRST_M = ["Aarav", "Rajan", "Bikash", "Suman", "Pradip", "Hari", "Ram", "Sanjay", "Anil", "Niranjan", "Keshav", "Dipendra", "Bishal", "Surya", "Rajendra", "Kiran"];
const NAMES_FIRST_F = ["Sita", "Gita", "Sushma", "Priya", "Anjali", "Sunita", "Kamala", "Saraswati", "Nisha", "Rina", "Binita", "Asmita", "Pooja", "Sharmila", "Rachana"];
const NAMES_LAST = ["Sharma", "Thapa", "Gurung", "Tamang", "Magar", "Rai", "Limbu", "Maharjan", "Shrestha", "Basnet", "Khada", "Bhattarai", "Adhikari", "Gautam", "Karki", "Khadka"];
const GENDERS = ["M", "F"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Utilities
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Math.random() * (max - min) + min;
const randElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randBoolean = (probability = 0.5) => Math.random() < probability;

const generatePhone = () => {
  const prefixes = ["984", "985", "986", "980", "981", "982"];
  const prefix = randElement(prefixes);
  const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().substring(1);
  return `${prefix}${suffix}`;
};

async function getRole(roleCode) {
    const res = await pool.query(`SELECT id FROM roles WHERE code = $1`, [roleCode]);
    return res.rows[0]?.id;
}

// Generate Realistic timestamps
const addMinutes = (dateStr, timeStr, minutes) => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const date = new Date(`${dateStr}T00:00:00`);
    date.setHours(hours, mins + minutes);
    return date;
}

async function runSimulation() {
  console.log("Starting Hospital Data Database Simulation...");
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    // 1. Roles
    let patientRoleId = await getRole('PATIENT');
    if (!patientRoleId) {
        throw new Error("Patient role not found in database.");
    }
    const adminRoleId = await getRole('SUPERADMIN') || 1;

    // 2. Clinics & Departments (5 Clinics, 3-5 depts each)
    console.log("Generating Clinics and Departments...");
    const clinics = [];
    const departments = [];
    
    for (let i=0; i < 5; i++) {
        const cName = CLINIC_NAMES[i] || `Kathmandu Care ${i}`;
        const cRes = await client.query(
            `INSERT INTO clinics (name, address, contact, is_active) VALUES ($1, $2, $3, true) RETURNING id`,
            [cName, `${randElement(KATHMANDU_STREETS)}, Kathmandu`, generatePhone()]
        );
        const clinicId = cRes.rows[0].id;
        clinics.push(clinicId);

        const deptCount = randInt(3, 5);
        const selectedDepts = [...DEPARTMENTS].sort(() => 0.5 - Math.random()).slice(0, deptCount);
        
        for (const dName of selectedDepts) {
            const dRes = await client.query(
                `INSERT INTO departments (clinic_id, name, status) VALUES ($1, $2, true) RETURNING id`,
                [clinicId, dName]
            );
            departments.push({ id: dRes.rows[0].id, clinicId, name: dName });
        }
    }

    // 3. Doctors (15-30 doctors)
    console.log("Generating Doctors and Shifts...");
    const numDoctors = randInt(15, 30);
    const doctors = [];
    
    for (let i=0; i < numDoctors; i++) {
        const gender = randElement(GENDERS);
        const fName = gender === "M" ? randElement(NAMES_FIRST_M) : randElement(NAMES_FIRST_F);
        const doctorName = `Dr. ${fName} ${randElement(NAMES_LAST)}`;
        
        const docRes = await client.query(
            `INSERT INTO doctors (name, phone, email, status) VALUES ($1, $2, $3, true) RETURNING id`,
            [doctorName, generatePhone(), `doc_${fName.toLowerCase()}${i}@hospital.com`]
        );
        const doctorId = docRes.rows[0].id;
        
        // Assign to a department
        const dept = randElement(departments);
        await client.query(
            `INSERT INTO doctor_departments (doctor_id, department_id, clinic_id) VALUES ($1, $2, $3)`,
            [doctorId, dept.id, dept.clinicId]
        );
        
        doctors.push({ id: doctorId, clinicId: dept.clinicId, deptId: dept.id, name: doctorName, deptName: dept.name });

        // Doctor Shifts (Mon-Fri/Sat)
        for (let day = 0; day <= 6; day++) {
             const isDayOff = (day === 6) ? randBoolean(0.8) : false; // 80% chance Sat is off. Sun-Fri working
             if (!isDayOff) {
                 const shiftType = randElement(['MORNING', 'AFTERNOON', 'FULL']);
                 let start, end;
                 if (shiftType === 'MORNING') { start = '09:00:00'; end = '13:00:00'; }
                 else if (shiftType === 'AFTERNOON') { start = '14:00:00'; end = '18:00:00'; }
                 else { start = '09:00:00'; end = '17:00:00'; } // FULL

                 await client.query(
                     `INSERT INTO doctor_shifts (doctor_id, clinic_id, department_id, day_of_week, start_time, end_time, is_day_off) 
                      VALUES ($1, $2, $3, $4, $5, $6, false)`,
                     [doctorId, dept.clinicId, dept.id, day, start, end]
                 );
             } else {
                 await client.query(
                     `INSERT INTO doctor_shifts (doctor_id, clinic_id, department_id, day_of_week, is_day_off) 
                      VALUES ($1, $2, $3, $4, true)`,
                     [doctorId, dept.clinicId, dept.id, day]
                 );
             }
        }
    }

    // 4. Patients (500)
    console.log("Generating Patients...");
    const patientIds = [];
    
    // We do smaller batches to prevent massive memory usage, but inside transaction is fine for 500.
    for (let i = 0; i < 500; i++) {
         const gender = randElement(GENDERS);
         const firstName = gender === "M" ? randElement(NAMES_FIRST_M) : randElement(NAMES_FIRST_F);
         const lastName = randElement(NAMES_LAST);
         const fullName = `${firstName} ${lastName}`;
         const username = `pat_${firstName.toLowerCase()}${i}`;
         
         // Hardcoded bcrypt hash for "Password@123" to bypass needing bcrypt installed in the frontend
         const defaultPasswordHash = "$2b$10$EpG.X/T9eX4P0G5V/t03H.UOT7T3b06y4yvqy4Bq4/I/2XvYm9P6q";

         const userRes = await client.query(
             `INSERT INTO users (full_name, email, username, password, phone, gender, role_id, user_type) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, 'EXTERNAL') RETURNING id`,
             [fullName, `${username}@example.com`, username, defaultPasswordHash, generatePhone(), gender, patientRoleId]
         );
         
         const userId = userRes.rows[0].id;
         patientIds.push(userId);

         // Patient Profile
         await client.query(
             `INSERT INTO patient_profiles (user_id, age, address, blood_group, emergency_contact_name, emergency_contact_phone)
              VALUES ($1, $2, $3, $4, $5, $6)`,
             [userId, randInt(1, 85), `${randElement(KATHMANDU_STREETS)}, Kathmandu`, randElement(BLOOD_GROUPS), `${randElement(NAMES_FIRST_M)} ${lastName}`, generatePhone()]
         );
    }

    // 5. Appointments (5000 over 90 days)
    console.log("Generating Appointments (This may take a minute)...");
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let appointmentsGenerated = 0;
    
    for (let i = 0; i < 5000; i++) {
        const patientId = randElement(patientIds);
        const doc = randElement(doctors);
        
        // Random date in the past 60 days to future 30 days
        const offsetDays = randInt(-60, 30);
        const apptDate = new Date(today);
        apptDate.setDate(today.getDate() + offsetDays);
        const dateStr = apptDate.toISOString().split("T")[0];
        
        // Pick a random time between 09:00 and 16:30
        const hour = randInt(9, 16);
        const minute = randElement(["00", "15", "30", "45"]);
        const scheduledTimeStr = `${hour.toString().padStart(2, "0")}:${minute}:00`;
        
        let estDuration = 15;
        if (doc.deptName === 'Cardiology') estDuration = 30;
        else if (doc.deptName === 'General Medicine') estDuration = 10;
        else if (doc.deptName === 'Orthopedics') estDuration = 20;

        const isWalkIn = randBoolean(0.15); // 15% walk-ins
        
        // Determine status based on date
        let status = 'COMPLETED';
        if (offsetDays > 0) {
            status = 'BOOKED'; // Future appointments
        } else {
            // Historical
            const roll = Math.random();
            if (roll < 0.05) status = 'CANCELLED';
            else if (roll < 0.15) status = 'NO_SHOW';
            else status = 'COMPLETED';
        }

        // Generate Queue Number (Simple sequential per doctor per date locally in script)
        // For simplicity in a massive dump, we'll assign rand 1-50
        const queueNumber = randInt(1, 50);

        let checkedInTime = null;
        let actualStartTime = null;
        let actualEndTime = null;

        if (status === 'COMPLETED') {
             // Real execution times
             // Patients often arrive 5-20 mins early, 15% late
             let arrivalOffsetMins = randBoolean(0.85) ? randInt(-20, -5) : randInt(5, 30);
             checkedInTime = addMinutes(dateStr, scheduledTimeStr, arrivalOffsetMins);
             
             // Actual start time (Docs often start 0-15 mins late)
             // Peak hours penalty (10-12, 15-17)
             let waitPenalty = 0;
             if ((hour >= 10 && hour <= 12) || (hour >= 15 && hour <= 17)) waitPenalty = randInt(10, 25);
             
             actualStartTime = addMinutes(dateStr, scheduledTimeStr, randInt(0, 15) + waitPenalty);
             
             // Actual End Time (+- 30% of estDuration)
             const durationVariance = estDuration * 0.3;
             const actualDuration = estDuration + randInt(-durationVariance, durationVariance);
             
             // Cannot end before start
             actualEndTime = new Date(actualStartTime.getTime() + (actualDuration * 60000));
        }

        await client.query(
            `INSERT INTO appointments 
            (patient_id, clinic_id, department_id, doctor_id, created_by, status, appointment_type, appointment_date, scheduled_start_time, queue_number, is_walk_in, estimated_duration, checked_in_time, actual_start_time, actual_end_time, notes)
            VALUES ($1, $2, $3, $4, $5, $6, 'REGULAR_CHECKUP', $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [
                patientId, 
                doc.clinicId, 
                doc.deptId, 
                doc.id, 
                adminRoleId, 
                status, 
                dateStr, 
                scheduledTimeStr, 
                queueNumber, 
                isWalkIn, 
                estDuration, 
                checkedInTime ? checkedInTime.toISOString() : null, 
                actualStartTime ? actualStartTime.toISOString() : null, 
                actualEndTime ? actualEndTime.toISOString() : null,
                isWalkIn ? 'Walk in patient' : 'Regular Booking'
            ]
        );
        
        appointmentsGenerated++;
        if (appointmentsGenerated % 500 === 0) console.log(`${appointmentsGenerated} appointments generated...`);
    }

    await client.query("COMMIT");
    console.log(`\nSimulation Completed Successfully! Inserted 5 Clinics, ${numDoctors} Doctors, 500 Patients, and 5000 Appointments.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Simulation failed:", err);
  } finally {
    client.release();
    pool.end();
  }
}

runSimulation();
