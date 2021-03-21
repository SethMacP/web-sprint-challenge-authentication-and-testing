
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: "SethMac", password: "abc123"},
    {username: "MacSeth", password: "123abc"},
  ])
};
