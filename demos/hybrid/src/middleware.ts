export async function onRequest({ request }, next) {
    // Check if the request's hostname matches 'help.tapni.com'
    if (request.headers.get('host') === 'help.tapni.com') {
        // Redirect to 'https://tapni.com/help'
        return new Response(null, {
            status: 301,
            headers: {
                Location: 'https://tapni.com/help',
            },
        });
    }

    // Continue to the next middleware or route handler
    return next();
}
