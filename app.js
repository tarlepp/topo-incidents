async function init() {
    const data = await loadData();

    updateCurrentStatus(data[data.length - 1]);
    updateHistory(data);

    console.log('init');
}

async function loadData() {
    const response = await fetch('data.json');

    return await response.json();
}

function updateCurrentStatus(latestIncident) {
    const days = dateFns.differenceInDays(
        new Date(),
        dateFns.parse(latestIncident.date, 'Y-m-d')
    );

    document.getElementById('days').innerHTML = `${days}...`;
}

function updateHistory(incidents) {
    const ulElement = document.getElementById('history');

    ulElement.innerHTML = '';

    incidents.map(incident => {
        const liElement = document.createElement('li');

        liElement.innerHTML = `<strong>${incident.date}</strong> - ${incident.message}`.trim()

        ulElement.appendChild(liElement);
    });
}

init();

setInterval(() => init(), 900 * 1000);
