#!/usr/bin/env bash
set -euo pipefail

repository_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
temporary_directory=$(mktemp -d)
cleanup() { rm -rf "$temporary_directory"; }
trap cleanup EXIT

cat > "$temporary_directory/aws" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail

query=""
while (($#)); do
  if [[ "$1" == "--query" ]]; then
    query=$2
    break
  fi
  shift
done

if [[ "$query" == "job.summary.commitId" ]]; then
  echo "$MOCK_AWS_COMMIT"
  exit 0
fi

index=0
if [[ -f "$MOCK_AWS_STATE" ]]; then
  index=$(<"$MOCK_AWS_STATE")
fi
IFS=',' read -r -a statuses <<< "$MOCK_AWS_STATUSES"
status=${statuses[$index]}
next=$((index + 1))
if ((next >= ${#statuses[@]})); then
  next=$((${#statuses[@]} - 1))
fi
printf '%s' "$next" > "$MOCK_AWS_STATE"
echo "$status"
MOCK
chmod +x "$temporary_directory/aws"

export PATH="$temporary_directory:$PATH"
export MOCK_AWS_STATE="$temporary_directory/state"
export AMPLIFY_JOB_POLL_SECONDS=0
expected_commit=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

run_waiter() {
  printf '0' > "$MOCK_AWS_STATE"
  "$repository_root/scripts/wait-for-amplify-job.sh" \
    test-app main 1 "$expected_commit" 10 >/dev/null
}

export MOCK_AWS_STATUSES="CREATED,PENDING,PROVISIONING,RUNNING,CANCELLING,SUCCEED"
export MOCK_AWS_COMMIT="$expected_commit"
run_waiter

export MOCK_AWS_STATUSES="SUCCEED"
export MOCK_AWS_COMMIT="bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
if run_waiter 2>/dev/null; then
  echo "Expected a concrete commit mismatch to fail the waiter" >&2
  exit 1
fi

export MOCK_AWS_COMMIT="HEAD"
if run_waiter 2>/dev/null; then
  echo "Expected movable HEAD to fail the release waiter" >&2
  exit 1
fi

export MOCK_AWS_STATUSES="FAILED"
export MOCK_AWS_COMMIT="$expected_commit"
if run_waiter 2>/dev/null; then
  echo "Expected a failed Amplify job to fail the waiter" >&2
  exit 1
fi

echo "Amplify job waiter commit-pinning and status tests passed"
