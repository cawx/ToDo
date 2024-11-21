async function seedTask(app, title) {
  const connection = await app.mysql.getConnection();
  try {
    await connection.query("insert into task (title) values (?)", [title]);
  } finally {
    connection.release();
  }
}

async function clearTestData(app) {
  const connection = await app.mysql.getConnection();
  try {
    await connection.query("truncate task");
  } finally {
    connection.release();
  }
}

export default { seedTask, clearTestData };
