async function init() {
    const data = await loadData();

    updateCurrentStatus(data.pop());
}

async function loadData() {
    const response = await fetch('data.json');

    return await response.json();
}

function updateCurrentStatus(currentStatus) {
    const days = dateFns.differenceInDays(
        new Date(),
        dateFns.parse(currentStatus.date, 'Y-m-d')
    );

    const element = document.getElementById('days');

    element.innerHTML = `${days}...`;
}

init();