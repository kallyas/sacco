#!/bin/bash
BACKUP_DIR = "backups"
TIMESTAMP =$(date +%Y %m %d_ %H %M %S)
mkdir - p $BACKUP_DIR
pg_dump
sacco_db > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
