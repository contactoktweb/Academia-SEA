const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado\n');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolons but be careful with quoted strings
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📋 Ejecutando ${statements.length} sentencias SQL...\n`);

    let executed = 0;
    let errors = 0;

    for (const statement of statements) {
      try {
        await client.query(statement);
        executed++;
        console.log(`✅ Ejecutado: ${statement.substring(0, 60)}...`);
      } catch (error) {
        errors++;
        console.error(`❌ Error: ${error.message}`);
        console.error(`   SQL: ${statement.substring(0, 60)}...\n`);
      }
    }

    console.log(`\n📊 Resultados:`);
    console.log(`   ✅ Exitosas: ${executed}`);
    console.log(`   ❌ Errores: ${errors}`);

    // List tables
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n📊 Tablas creadas (${tablesResult.rows.length}):`);
    tablesResult.rows.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.table_name}`);
    });

    await client.end();
    console.log('\n✅ Listo!');

  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

main();
