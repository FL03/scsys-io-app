#! /bin/bash

context=$(pwd)

echo "Building actors... ($context)"

(cd actors/adder && wasm-pack build --release -t web -d "$context"/public/wasm/adder)