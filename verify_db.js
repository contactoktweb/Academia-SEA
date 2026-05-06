const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT count(*) FROM information_schema.columns 
              WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Estado de la Base de Datos');
    console.log('============================\n');
    
    let totalColumns = 0;
    tablesResult.rows.forEach((t, i) => {
      totalColumns += parseInt(t.column_count);
      console.log(`${i + 1}. ${t.table_name.padEnd(30)} (${t.column_count} columnas)`);
    });

    console.log('\n' + '='.repeat(50));
    console.log(`Total de tablas: ${tablesResult.rows.length}`);
    console.log(`Total de columnas: ${totalColumns}`);
    console.log('='.repeat(50));

    // Check indexes
    const indexResult = await client.query(`
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log(`\n🔍 Índices creados: ${indexResult.rows.length}`);

    await client.end();
    console.log('\n✅ Base de datos lista para usar!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
