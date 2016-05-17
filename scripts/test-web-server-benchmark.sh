#!/bin/bash

# Need to set defaults for
numberOfRequests=$1
concurrent=$2

if [[ -z "$numberOfRequests" ]]; then
	numberOfRequests=100
fi

if [[ -z "$concurrent" ]]; then
	concurrent=5
fi

echo "Running $numberOfRequests requests $concurrent at a time..."

ab -n ${1} -c ${2} http://localhost:8181/