import { platform, release, arch, cpus, freemem, totalmem } from 'node:os'

console.log('SO: ', platform())
console.log('Version: ', release())
console.error('ARQ: ', arch())

console.log('#CPUs: ', cpus())
console.log('Free memory: ', freemem() / 1024 / 1024)
console.log('Total memory: ', totalmem() / 1024 / 1024)
