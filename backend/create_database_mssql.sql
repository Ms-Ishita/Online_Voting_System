-- Create the SQL Server database used by the backend.
-- Run this in SQL Server Management Studio or sqlcmd as a user with CREATE DATABASE rights.

IF DB_ID(N'online_voting_system') IS NULL
BEGIN
    CREATE DATABASE [online_voting_system];
END
GO

USE [online_voting_system];
GO

-- You can add table creation scripts here if needed.
