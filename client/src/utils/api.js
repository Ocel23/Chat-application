async function fetchData(url, requestOptions) {
    const allRequestOptions = {credentials: "include", ...requestOptions};
    try {
        const data = await fetch(url, allRequestOptions)
        if (!data.ok) {
            throw new requestError(data);
        }
        return data.json();
    } catch(err) {
        throw err;
    }
}


export function apiPost(url, data) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    return fetchData(url, requestOptions)
}

export function apiGet(url) {

    const requestOptions = {
        method: "GET",
    }

    return fetchData(url, requestOptions);
}

export function apiDelete(url) {

    const requestOptions = {
        method: "DELETE",
    }

    return fetchData(url, requestOptions);
}

export function apiPut(url, data) {

    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }

    return fetchData(url, requestOptions);
}

export class requestError extends Error {
    constructor (response) {
        super("Network response was not ok: " + response.statusText + " " + response.status);
        this.response = response;
    }
}