let username = 'coalition';
let password = 'skills-test';
let auth = btoa(`${username}:${password}`);

// Fetch data using the provided API endpoint.
fetch('https://fedskillstest.coalitiontechnologies.workers.dev/auth', {
    headers: {
        'Authorization': `Basic ${auth}`
    }
}).then(function (response) {
    if (response.ok) {
        return response.json();
    }
    throw response;
}).then(function (data) {
    // Call the function updatePatientList() 
    updatePatientList(data);

    // Call the function updateDiagnosticList() 
    updateDiagnosticList(data);

    // Call the function fetchDiagnosisHistory()
    fetchDiagnosisHistory(data);

    // Call the function updateProfileinformation()
    updateProfileinformation(data);

    // Call the function updateLabResults()
    updateLabResults(data);

}).catch(function (error) {
    console.warn(error);
});


// Render the patient list on the homepage by creating new elements and assigning data fetched from the API.
function updatePatientList(data) {
    const patientsDetailList = document.querySelector('.patients-detail-list');
    for (var i = 0; i < data.length; i++) {
        const patient = {
            "name": data[i].name,
            "gender": data[i].gender,
            "age": data[i].age,
            "profile_picture": data[i].profile_picture,
            "diagnosis_history": data[i].diagnosis_history,
        };

        const patientInfoDiv = document.createElement('div');
        patientInfoDiv.className = 'patient-information';

        const patientProfileDiv = document.createElement('div');
        patientProfileDiv.className = 'patient-profile';

        const profileImg = document.createElement('img');
        profileImg.src = patient.profile_picture;
        profileImg.alt = `${patient.name.toLowerCase()}-pic`;
        patientProfileDiv.appendChild(profileImg);

        const patientNameAgeDiv = document.createElement('div');
        patientNameAgeDiv.className = 'patient-name-age';

        const patientNameP = document.createElement('p');
        patientNameP.className = 'patient-name';
        patientNameP.textContent = patient.name;
        patientNameAgeDiv.appendChild(patientNameP);

        const patientSexAgeP = document.createElement('p');
        patientSexAgeP.className = 'patient-sex-age';
        patientSexAgeP.textContent = `${patient.gender}, ${patient.age}`;
        patientNameAgeDiv.appendChild(patientSexAgeP);

        const horizantleDotDiv = document.createElement('div');
        horizantleDotDiv.className = 'horizontal-dot';

        const dotsImg = document.createElement('img');
        dotsImg.src = 'images/horizontal-dot.svg';
        dotsImg.alt = 'horizontal_dot';
        dotsImg.style.height = '4px';
        dotsImg.style.width = '18px';

        horizantleDotDiv.appendChild(dotsImg);

        patientInfoDiv.appendChild(patientProfileDiv);
        patientInfoDiv.appendChild(patientNameAgeDiv);
        patientInfoDiv.appendChild(horizantleDotDiv);

        patientsDetailList.appendChild(patientInfoDiv);
    }
}

// Note: Display information only for Jessica Taylor; displaying other patients' data is unnecessary and will not yield extra points in the skills test. That is why only the information for Jessica Taylor is being displayed from the API. We get Jessica Taylor's information at `data[3]`.


// Create rows dynamically and update them with data fetched from the API.
function updateDiagnosticList(data) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    for (var i = 0; i < data[3].diagnostic_list.length; i++) {
        const tr = document.createElement('tr');

        const diagnosis = document.createElement('td');
        diagnosis.textContent = data[3].diagnostic_list[i].name;
        tr.appendChild(diagnosis);

        const description = document.createElement('td');
        description.textContent = data[3].diagnostic_list[i].description;
        tr.appendChild(description);

        const status = document.createElement('td');
        status.textContent = data[3].diagnostic_list[i].status;
        tr.appendChild(status);

        tbody.appendChild(tr);
    }
}

// Update the graph of diagnosis history.
function fetchDiagnosisHistory(data) {
    try {
        const jessicaDiagnosisHistory = data[3].diagnosis_history;

        //Fetching the last six months of data from the API to display in the graph.
        const lastSixMonthsData = jessicaDiagnosisHistory.slice(0, 6).reverse().map(item => {
            return {
                ...item,
                month: item.month.slice(0, 3)
            }
        })

        // Prepare the labels and datasets for the chart.
        const labels = lastSixMonthsData.map(item => `${item.month}, ${item.year}`);
        const systolicData = lastSixMonthsData.map(item => item.blood_pressure.systolic.value);
        const diastolicData = lastSixMonthsData.map(item => item.blood_pressure.diastolic.value);

        // Update the chart with the fetched data.
        const ctx = document.getElementById('bloodPressureChart').getContext('2d');
        const bloodPressureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Systolic',
                        data: systolicData,
                        borderColor: '#E66FD2',
                        backgroundColor: '#E66FD2',
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#E66FD2',
                        pointRadius: 6
                    },
                    {
                        label: 'Diastolic',
                        data: diastolicData,
                        borderColor: '#8f8bd8',
                        backgroundColor: '#8f8bd8',
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#8f8bd8',
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 180,
                        ticks: {
                            color: '#072635'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#072635'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        const SystolicDiastolicLastMonthValue = document.querySelectorAll('.metric-value');

        SystolicDiastolicLastMonthValue[0].textContent = lastSixMonthsData[5].blood_pressure.systolic.value;
        SystolicDiastolicLastMonthValue[1].textContent = lastSixMonthsData[5].blood_pressure.diastolic.value;

        const SystolicDiastolicLastMonthStatus = document.querySelectorAll('.metric-status');
        SystolicDiastolicLastMonthStatus[0].textContent = lastSixMonthsData[5].blood_pressure.systolic.levels;
        SystolicDiastolicLastMonthStatus[1].textContent = lastSixMonthsData[5].blood_pressure.diastolic.levels;

        // Update the respiratory rate, temperature, and heart rate of Jessica Taylor for the last month.
        const updateHealthInfoValue = document.querySelectorAll('.info-card-value')
        updateHealthInfoValue[0].textContent = lastSixMonthsData[5].respiratory_rate.value + ' bpm';
        updateHealthInfoValue[1].textContent = lastSixMonthsData[5].temperature.value + ' °F';
        updateHealthInfoValue[2].textContent = lastSixMonthsData[5].heart_rate.value + ' bpm';

        const updateHealthInfoStatus = document.querySelectorAll('.info-card-status')
        updateHealthInfoStatus[0].textContent = lastSixMonthsData[5].respiratory_rate.levels;
        updateHealthInfoStatus[1].textContent = lastSixMonthsData[5].temperature.levels;
        updateHealthInfoStatus[2].textContent = lastSixMonthsData[5].heart_rate.levels;

    } catch (error) {
        console.error('Error fetching diagnosis data:', error);
    }
}


// Displaying Jessica Taylor profile information
function updateProfileinformation(data) {
    const jessica = data[3];
    // update the profile image.
    const profileImage = document.querySelector('.profile-img');
    if (profileImage) {
        profileImage.src = jessica.profile_picture;
        profileImage.alt = jessica.name;
    } else {
        console.error('Profile image element not found');
    }

    //update the profile name.
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = jessica.name;
    }

    //update date of birth.
    const dob = document.querySelectorAll('.info-item .info-text')[0];

    // jessica object has the date in "08/23/1996" format. We need to change like 23 August 1996.
    const dateStr = jessica.date_of_birth;
    const dateObject = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObject.toLocaleDateString('en-US', options);

    dob.textContent = formattedDate;

    // update Gender
    const gender = document.querySelectorAll('.info-item .info-text')[1];
    gender.textContent = jessica.gender;

    // update contact info
    const contact = document.querySelectorAll('.info-item .info-text')[2];
    contact.textContent = jessica.
        phone_number;

    //update emergency contact info
    const emergencyContact = document.querySelectorAll('.info-item .info-text')[3];
    emergencyContact.textContent = jessica.
        emergency_contact;

    // Update Insurance Provider
    const insuranceProvider = document.querySelectorAll('.info-item .info-text')[4];
    insuranceProvider.textContent = jessica.
        insurance_type;
}


// List the lab results fetched from the API for Jessica Taylor.
function updateLabResults(data) {
    const jessica = data[3];
    const labResults = jessica.lab_results;

    const resultsList = document.querySelector('.results-list');
    resultsList.innerHTML = '';

    for (var i = 0; i < labResults.length; i++) {
        const resultItem = document.createElement('div');
        resultItem.className = "result-item";

        const resultName = document.createElement('span');
        resultName.textContent = labResults[i];

        const downloadImg = document.createElement('img');
        downloadImg.src = "images/download.svg";
        downloadImg.alt = "Download";

        resultItem.appendChild(resultName);
        resultItem.appendChild(downloadImg);

        resultsList.appendChild(resultItem);
    }
}