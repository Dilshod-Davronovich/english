@echo off
SET PSQL_CONN="postgres://englishdatabase_user:LePHflOz7JXVSog8yWEWPu7RAwos4cAa@dpg-cvekpbnnoe9s73epbmdg-a.frankfurt-postgres.render.com:5432/englishdatabase"
echo Connecting to PostgreSQL...
psql %PSQL_CONN%
pause