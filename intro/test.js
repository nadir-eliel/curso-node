//TODO: analizar este codigo a fondo, para entender las promesas

function getInParallel(apiCalls) {
    return Promise.all(apiCalls.map(call => call()))
}

let promise = getInParallel([
    () => Promise.resolve("First API call!"),
    () => Promise.resolve("Second API call!")
])
if (promise) {
    promise.then(result => console.log(result)).catch(err => console.log(err))
}

module.exports.getInParallel = getInParallel