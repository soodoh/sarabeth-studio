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
  echo "expected-commit"
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
export MOCK_AWS_STATUSES="CREATED,PENDING,PROVISIONING,RUNNING,CANCELLING,SUCCEED"
export AMPLIFY_JOB_POLL_SECONDS=0

"$repository_root/scripts/wait-for-amplify-job.sh" \
  test-app main 1 expected-commit 10 >/dev/null

printf '0' > "$MOCK_AWS_STATE"
export MOCK_AWS_STATUSES="FAILED"
if "$repository_root/scripts/wait-for-amplify-job.sh" \
  test-app main 2 expected-commit 10 >/dev/null 2>&1; then
  echo "Expected a failed Amplify job to fail the waiter" >&2
  exit 1
fi

echo "Amplify job waiter status tests passed"
