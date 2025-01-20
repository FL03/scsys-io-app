#!/bin/bash
npx supabase db  "$@" -p "\$SUPABASE_DB_PASSWORD"