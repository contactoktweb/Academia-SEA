const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log('DATABASE_URL:', connectionString?.substring(0, 50) + '...' || 'NOT SET');

async function main() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    const versionResult = await client.query('SELECT version()');
    console.log('📦 PostgreSQL version:', versionResult.rows[0].version.substring(0, 80));
    
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`\n📊 Tablas existentes: ${tablesResult.rows.length}`);
    
    if (tablesResult.rows.length > 0) {
      console.log('Tablas encontradas:');
      tablesResult.rows.forEach(t => console.log(`  - ${t.table_name}`));
    } else {
      console.log('No hay tablas. Base de datos vacía.');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

main();
