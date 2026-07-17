#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 4 || $# -gt 5 ]]; then
  echo "Usage: $0 <app-id> <branch> <job-id> <expected-commit> [timeout-seconds]" >&2
  exit 2
fi

app_id=$1
branch=$2
job_id=$3
expected_commit=$4
timeout_seconds=${5:-1800}
poll_seconds=${AMPLIFY_JOB_POLL_SECONDS:-15}
deadline=$((SECONDS + timeout_seconds))

while (( SECONDS < deadline )); do
  status=$(aws amplify get-job \
    --app-id "$app_id" \
    --branch-name "$branch" \
    --job-id "$job_id" \
    --query 'job.summary.status' \
    --output text)

  case "$status" in
    SUCCEED)
      commit_id=$(aws amplify get-job \
        --app-id "$app_id" \
        --branch-name "$branch" \
        --job-id "$job_id" \
        --query 'job.summary.commitId' \
        --output text)
      if [[ "$commit_id" != "$expected_commit" ]]; then
        echo "Amplify job $job_id deployed commit $commit_id, expected $expected_commit" >&2
        exit 1
      fi
      echo "Amplify job $job_id succeeded for commit $commit_id"
      exit 0
      ;;
    FAILED | CANCELLED)
      echo "Amplify job $job_id finished with status $status" >&2
      exit 1
      ;;
    CREATED | PENDING | PROVISIONING | RUNNING | CANCELLING)
      sleep "$poll_seconds"
      ;;
    *)
      echo "Amplify job $job_id returned unexpected status $status" >&2
      exit 1
      ;;
  esac
done

echo "Timed out after ${timeout_seconds}s waiting for Amplify job $job_id" >&2
exit 1
