#! /bin/bash
supabase gen types typescript --project-id jldrgdhjxirkcedeiyev --schema public > ./src/types/database.types.ts | Set-Content -Encoding utf8 ./src/types/database.types.ts