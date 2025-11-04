#!/usr/bin/env python3
"""
Script to run all SQL schema files against the Neon PostgreSQL database

This script:
1. Reads DATABASE_URL from environment variables or .env files
2. Executes all SQL files in the db directory using asyncpg
3. Provides feedback on success/failure
"""

import os
import asyncio
import asyncpg
from pathlib import Path
from dotenv import load_dotenv

def load_env_variables():
    """Load environment variables from .env files"""
    # Load from .env file in backend directory
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
    
    # Also try .env.local
    env_local_path = Path(__file__).parent.parent / '.env.local'
    if env_local_path.exists():
        load_dotenv(env_local_path)

def get_database_url():
    """Get database URL from environment variables"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        # Try alternative environment variables
        database_url = os.environ.get('POSTGRES_URL')
    
    if not database_url:
        print("❌ DATABASE_URL environment variable is not set")
        print("Please ensure DATABASE_URL is set in your .env file")
        exit(1)
    
    return database_url

async def run_sql_file(sql_file_path, database_url):
    """Execute a single SQL file against the database using asyncpg"""
    try:
        # Read the SQL file content
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        if not sql_content.strip():
            print(f"⚠️  Empty file: {sql_file_path.name}")
            return True
        
        # Connect to the database
        conn = await asyncpg.connect(database_url)
        
        try:
            # Execute the SQL content
            await conn.execute(sql_content)
            print(f"✅ Successfully executed {sql_file_path.name}")
            return True
            
        except Exception as e:
            # Check if it's a "relation already exists" error
            if "already exists" in str(e):
                print(f"⚠️  Tables already exist in {sql_file_path.name}")
                print("   Continuing with next file...")
                return True
            print(f"❌ Failed to execute {sql_file_path.name}")
            print(f"   Error: {e}")
            return False
            
        finally:
            await conn.close()
            
    except Exception as e:
        print(f"❌ Error executing {sql_file_path.name}: {e}")
        return False

async def main():
    """Main function to run all schema files"""
    # Load environment variables
    load_env_variables()
    
    # Get database URL
    database_url = get_database_url()
    print(f"📋 Database URL: {database_url}")
    
    # Find all SQL files
    db_dir = Path(__file__).parent
    sql_files = list(db_dir.glob("*.sql"))
    
    if not sql_files:
        print("❌ No SQL files found in db directory")
        return
    
    print(f"📁 Found {len(sql_files)} SQL files to execute")
    
    # Recommended execution order (you can adjust this based on dependencies)
    execution_order = [
        'ask_tattty_schema.sql',
        'tattoo_styles_schema.sql', 
        'tattoo_moods_schema.sql',
        'tattoo_placements_schema.sql',
        'tattoo_sizes_schema.sql',
        'tattoo_colors_schema.sql',
        'skin_tones_schema.sql',
        'frontend_database_schema.sql'
    ]
    
    # Reorder files based on recommended execution order
    ordered_files = []
    for filename in execution_order:
        for sql_file in sql_files:
            if sql_file.name == filename:
                ordered_files.append(sql_file)
                break
    
    # Add any remaining files not in the order list
    for sql_file in sql_files:
        if sql_file not in ordered_files:
            ordered_files.append(sql_file)
    
    print("🚀 Executing SQL files in order:")
    for i, sql_file in enumerate(ordered_files, 1):
        print(f"   {i}. {sql_file.name}")
    
    print("\n" + "="*60)
    
    # Execute all files
    success_count = 0
    for sql_file in ordered_files:
        print(f"\n📋 Executing: {sql_file.name}")
        print("-" * 40)
        
        success = await run_sql_file(sql_file, database_url)
        if success:
            success_count += 1
        else:
            print(f"💥 Stopping execution due to error in {sql_file.name}")
            break
    
    print("\n" + "="*60)
    print(f"📊 Execution Summary:")
    print(f"   Total files: {len(ordered_files)}")
    print(f"   Successful: {success_count}")
    print(f"   Failed: {len(ordered_files) - success_count}")
    
    if success_count == len(ordered_files):
        print("🎉 All schema files executed successfully!")
        print("✅ Database is now ready for use")
    else:
        print("❌ Some schema files failed to execute")
        exit(1)

if __name__ == "__main__":
    asyncio.run(main())