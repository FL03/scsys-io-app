#! /bin/bash

# Generate the types for the project
npx supabase gen types typescript --project-id "$1" --schema public > Set-Content -Encoding utf8 "$@"
