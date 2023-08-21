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
            date: dateFns.parse(t(entry, 'id').textContent.split('/').pop(), 'Y-m-d'),
        }))
        .reverse();

    updateCurrentStatus(items[items.length - 1]);
    updateHistory(items);
}

function updateCurrentStatus(latestIncident) {
    const days = dateFns.differenceInDays(
        new Date(),
        latestIncident.date,
    );

    document.getElementById('days').innerHTML = `${days}...`;
}

function updateHistory(incidents) {
    const ulElement = document.getElementById('history');

    ulElement.innerHTML = '';

    incidents.map(incident => {
        const liElement = document.createElement('li');

        liElement.innerHTML = `<strong>${dateFns.format(incident.date, 'YYYY-MM-DD', {locale: 'fi'})}</strong> - ${incident.message}`.trim();

        ulElement.appendChild(liElement);
    });
}

init().finally();

setInterval(() => init(), 900 * 1000);
