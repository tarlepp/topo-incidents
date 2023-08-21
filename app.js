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
            date: t(entry, 'id').textContent.split('/').pop(),
        }))
        .reverse();

    updateCurrentStatus(items[items.length - 1]);
    updateHistory(items);
}

function updateCurrentStatus(latestIncident) {
    const days = dateFns.differenceInDays(
        new Date(),
        dateFns.parse(latestIncident.date, 'Y-m-d'),
    );

    document.getElementById('days').innerHTML = `${days}...`;
}

function updateHistory(incidents) {
    const ulElement = document.getElementById('history');

    ulElement.innerHTML = '';

    incidents.map(incident => {
        const liElement = document.createElement('li');

        liElement.innerHTML = `<strong>${incident.date}</strong> - ${incident.message}`.trim();

        ulElement.appendChild(liElement);
    });
}

init().finally();

setInterval(() => init(), 900 * 1000);
