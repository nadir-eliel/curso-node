import mysql from 'mysql2/promise'

// Esto deberia ir a variables de entorno?
const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'pass123',
  database: 'movies'
}
const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    // TODO: como hacer para que me devuelva un array con los generos de la peli
    if (genre) {
      const genreLower = genre.toLowerCase()
      const [movies] = await connection
        .query(`SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(m.id) as id  
              FROM movies m 
              INNER JOIN movie_genre mg ON mg.movie_id = m.id 
              INNER JOIN genre g ON g.id = mg.genre_id 
              WHERE LOWER(g.name) = LOWER(?)`, [genreLower])
      return movies
    }

    const [movies, tableInfo] = await connection
      .query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movies')
    // console.log({ tableInfo })
    return movies
  }

  static async getById ({ id }) {
    const [movie] = await connection
      .query(`SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id
      FROM movies WHERE id = UUID_TO_BIN(?)`, [id])
    if (movie.length === 0) return null

    return movie[0]
  }

  static async create ({ input }) {
    // TODO: guardar la relacion con el genre en la tabla movie_genre
    // FIXME: esta funcion requiere 3 llamados a la BBDD, hay que buscar una forma mas eficiente
    const { title, year, duration, director, rate, poster } = input

    // TODO: cual es la diferencia entre usar este UUID y usar crypto.randomUUID()?
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult

    const [insertResult] = await connection
      .query(`INSERT INTO movies (id, title, year, duration, director, rate, poster)
              VALUES (UUID_TO_BIN(?),?,?,?,?,?,?)`,
      [uuid, title, year, duration, director, rate, poster])

    const [movie] = await connection
      .query(`SELECT title, year, duration, director, rate, poster, BIN_TO_UUID(id) as id
              FROM movies WHERE id = UUID_TO_BIN(?)`, [uuid])
    console.log(movie)
    return movie[0]
  }

  static async delete ({ id }) {
    const [deleteResult] = await connection
      .query('DELETE FROM movies WHERE id = UUID_TO_BIN(?)', [id])
    console.log(deleteResult)
    return true
  }

  static async update ({ id, input }) {
    // FIXME: por algun motivo no está validando el Modelo
    // deberian los campos opcionales tener un valor default o no pedirlo
    const { title, year, director, duration, poster, rate } = input

    const [movie] = await connection
      .query(`SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) 
              FROM movies WHERE id = UUID_TO_BIN(?)`, [id])
    if (movie.length === 0) return null

    const [updatedMovie] = await connection
      .query(`UPDATE movies SET title = ?, year = ?,
              director = ?, duration = ?, poster = ?, rate = ?
            WHERE id = UUID_TO_BIN(?)`, [title, year, director, duration, poster, rate, id])

    return updatedMovie // FIXME: aqui deberia devolver el recurso actualizado
  }
}
