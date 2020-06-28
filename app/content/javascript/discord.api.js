const discordApi = (() => {
    const apiUrl = '/api/v1/discord';

    function mapResponse(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    return {
        getGuilds: () => {
            return fetch(`${apiUrl}/guilds`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(mapResponse)
            .then(res => res.json());
        }
    }
})();

Object.freeze(discordApi);