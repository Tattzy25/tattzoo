#!/usr/bin/env python3
"""
Dashboard Metrics Runner for ops.tattty.com
Runs the dashboard queries against Neon database
"""

import asyncio
import asyncpg
from config.settings import settings

async def run_dashboard_queries():
    """Run all dashboard metrics queries and display results"""
    try:
        # Create and initialize database pool directly
        # Fix connection string format for asyncpg (remove +asyncpg)
        dsn = settings.DATABASE_URL.replace("postgresql+asyncpg", "postgresql")
        
        pool = await asyncpg.create_pool(
            dsn=dsn,
            min_size=1,
            max_size=10,
            command_timeout=60,
            server_settings={
                "application_name": "tattzoo-dashboard"
            }
        )
        
        async with pool.acquire() as conn:
            print('=== DASHBOARD METRICS FOR ops.tattty.com ===')
            
            # 1. OVERALL PERFORMANCE
            print('\n1. OVERALL PERFORMANCE:')
            result = await conn.fetch('''
                SELECT 
                    action_type,
                    COUNT(*) as total_requests,
                    AVG(response_time_ms) as avg_response_time_ms,
                    SUM(CASE WHEN was_successful THEN 1 ELSE 0 END) as successful_requests,
                    SUM(CASE WHEN NOT was_successful THEN 1 ELSE 0 END) as failed_requests
                FROM ask_tattty_requests 
                WHERE created_at >= NOW() - INTERVAL '24 HOURS'
                GROUP BY action_type
                ORDER BY total_requests DESC
            ''')
            for row in result:
                action_type = row['action_type']
                total = row['total_requests']
                avg_time = row['avg_response_time_ms'] or 0
                success = row['successful_requests']
                failed = row['failed_requests']
                print(f'{action_type}: {total} requests, {avg_time:.0f}ms avg, {success} success, {failed} failed')
            
            # 2. ERROR ANALYSIS
            print('\n2. ERROR ANALYSIS:')
            errors = await conn.fetch('''
                SELECT 
                    action_type,
                    error_message,
                    COUNT(*) as error_count
                FROM ask_tattty_requests 
                WHERE NOT was_successful 
                    AND created_at >= NOW() - INTERVAL '24 HOURS'
                    AND error_message IS NOT NULL
                GROUP BY action_type, error_message
                ORDER BY error_count DESC
                LIMIT 10
            ''')
            for error in errors:
                action = error['action_type']
                count = error['error_count']
                message = error['error_message']
                print(f'{action}: {count}x - {message}')
            
            # 3. TOTAL REQUESTS TODAY
            print('\n3. TODAY\'S SUMMARY:')
            today = await conn.fetchval('''
                SELECT COUNT(*) FROM ask_tattty_requests 
                WHERE created_at >= CURRENT_DATE
            ''')
            print(f'Total requests today: {today}')
            
            # 4. DATABASE HEALTH CHECK
            print('\n4. DATABASE HEALTH:')
            table_exists = await conn.fetchval('''
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'ask_tattty_requests'
                )
            ''')
            print(f'ask_tattty_requests table exists: {table_exists}')
            
            if table_exists:
                row_count = await conn.fetchval('SELECT COUNT(*) FROM ask_tattty_requests')
                print(f'Total rows in ask_tattty_requests: {row_count}')
            
    except Exception as e:
        print(f'Error running dashboard queries: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(run_dashboard_queries())