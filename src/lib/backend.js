//const cors='https://vps.urwick.co.uk:8888/'
const cors=''
const host='https://environment.data.gov.uk/flood-monitoring'

export function backendFetch(uri) {
    return fetch(`${cors}${host}/${uri}`, { })
        .then(response => response.json())
        .catch(() => {throw new Error(`backendFetch failed: ${uri}`)});
}

