const fsPromises = require('node:fs/promises')

/*
fsPromises.readFile('cover-letter.txt', 'utf-8')
    .then(text => {
        const parsed = text.replace({$hiringManager}, 'Nicanor Parravichini')
        console.log(parsed)

    })
    */
let coverLetter;

fsPromises.readFile('cover-letter.txt', 'utf-8')
    .then(data => {
        coverLetter = data.toString()
        fsPromises.readFile('cover-letter.json', 'utf-8')
            .then(variables => { //ESte then va despues de leer el json?
                const { hiringManager, jobTitle, companyName, portal } = JSON.parse(variables)
                updated = coverLetter.replace('HIRING_MANAGER', hiringManager).replace('JOB_TITLE', jobTitle).replace('COMPANY_NAME', companyName).replace('PORTAL', portal)
                console.log(updated)
            })
    })

    .catch(error => console.error('Error reading file', error))
