let DB_URI

if (process.env.NODE_ENV === 'test') {
  DB_URI = 'jdbc:mysql://localhost:3306/'
} else {
  DB_URI = 'jdbc:mysql://localhost:3306/'
}

export default { DB_URI }

// FIXME: este config no se usa en ningun lado todavia
