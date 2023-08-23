const t = (entry, tagName) => entry.getElementsByTagName(tagName)[0];

async function init() {
    const atomFeed = (new DOMParser())
        .parseFromString(
            await (await fetch('releases.atom')).text(),
            'text/xml',
        );

    const items = [...atomFeed.getElementsByTagName('entry')]
        .map(entry => ({
            message: t(entry, 'title').textContent,
            date: luxon.DateTime.fromISO(t(entry, 'id').textContent.split('/').pop(), 'Y-m-d'),
        }))
        .reverse();

    updateCurrentStatus(items[items.length - 1]);
    updateHistory(items);
}

function updateCurrentStatus(latestIncident) {
    const days = luxon.Interval.fromDateTimes(
        latestIncident.date,
        new Date(),
    ).length('days');

    document.getElementById('days').innerHTML = `${Math.floor(days)}...`;
}

function updateHistory(incidents) {
    const ulElement = document.getElementById('history');

    ulElement.innerHTML = '';

    incidents.map(incident => {
        const liElement = document.createElement('li');

        liElement.innerHTML = `<strong>${incident.date.toFormat('yyyy-MM-dd (cccc)')}</strong> - ${incident.message}`.trim();

        ulElement.appendChild(liElement);
    });
}

init().finally();

setInterval(() => init(), 900 * 1000);
