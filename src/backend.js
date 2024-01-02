const host='https://environment.data.gov.uk/flood-monitoring'

export function backendFetch(uri) {
    return fetch(`${host}/${uri}`)
        .then(response => response.json())
        .catch(() => {throw new Error(`backendFetch failed: ${uri}`)});
}

