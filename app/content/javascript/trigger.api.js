const triggerApi = (() => {
    const apiUrl = '/api/v1/triggers';

    function mapResponse(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    return {
        getAll: (guildId) => {
            if (!guildId) return Promise.resolve([]);
            return fetch(`${apiUrl}?guildId=${guildId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(mapResponse)
            .then(res => res.json());
        },

        add: (item) => {
            return fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
            .then(mapResponse)
            .then(res => res.json());
        },

        update: (item) => {
            return fetch(`${apiUrl}/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
            .then(mapResponse);
        },

        delete: (item) => {
            return fetch(`${apiUrl}/${item.id}`, {
                method: 'DELETE'
            })
            .then(mapResponse);
        }
    }
})();

Object.freeze(triggerApi);