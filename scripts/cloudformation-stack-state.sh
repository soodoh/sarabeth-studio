#!/usr/bin/env bash
set -euo pipefail

stack_status_retries=${CLOUDFORMATION_STATUS_RETRIES:-3}
stack_status_retry_seconds=${CLOUDFORMATION_STATUS_RETRY_SECONDS:-5}
stack_settle_timeout_seconds=${CLOUDFORMATION_SETTLE_TIMEOUT_SECONDS:-3600}
stack_settle_poll_seconds=${CLOUDFORMATION_SETTLE_POLL_SECONDS:-10}

get_stack_status() {
  local stack_name=$1
  local attempt=1
  local error_file
  local output
  error_file=$(mktemp)

  while ((attempt <= stack_status_retries)); do
    if output=$(aws cloudformation describe-stacks \
      --stack-name "$stack_name" \
      --query 'Stacks[0].StackStatus' \
      --output text 2>"$error_file"); then
      rm -f "$error_file"
      printf '%s\n' "$output"
      return 0
    fi

    if grep -Eq 'ValidationError.*(does not exist|not exist)|Stack with id .* does not exist' "$error_file"; then
      rm -f "$error_file"
      printf '%s\n' NOT_FOUND
      return 0
    fi

    if grep -Eqi 'Throttl|RequestLimitExceeded|ServiceUnavailable|InternalFailure|temporarily unavailable|timed out|timeout|Could not connect|connection (reset|refused)' "$error_file" && ((attempt < stack_status_retries)); then
      sleep "$stack_status_retry_seconds"
      attempt=$((attempt + 1))
      continue
    fi

    cat "$error_file" >&2
    rm -f "$error_file"
    return 1
  done
}

wait_for_stack_terminal() {
  local stack_name=$1
  local deadline=$((SECONDS + stack_settle_timeout_seconds))
  local status

  while ((SECONDS < deadline)); do
    status=$(get_stack_status "$stack_name")
    case "$status" in
      NOT_FOUND | *_COMPLETE | *_FAILED)
        printf '%s\n' "$status"
        return 0
        ;;
      *_IN_PROGRESS | REVIEW_IN_PROGRESS)
        sleep "$stack_settle_poll_seconds"
        ;;
      *)
        echo "Unexpected CloudFormation status for $stack_name: $status" >&2
        return 1
        ;;
    esac
  done

  echo "Timed out waiting for CloudFormation stack $stack_name to reach a terminal state" >&2
  return 1
}

settle_stack() {
  local stack_name=$1
  local status
  status=$(get_stack_status "$stack_name")

  if [[ "$status" == "UPDATE_IN_PROGRESS" ]]; then
    if ! aws cloudformation cancel-update-stack --stack-name "$stack_name"; then
      status=$(get_stack_status "$stack_name")
      if [[ "$status" == "UPDATE_IN_PROGRESS" ]]; then
        echo "Unable to cancel the in-progress update for $stack_name" >&2
        return 1
      fi
    fi
    wait_for_stack_terminal "$stack_name" >/dev/null
  elif [[ "$status" == *_IN_PROGRESS || "$status" == "REVIEW_IN_PROGRESS" ]]; then
    wait_for_stack_terminal "$stack_name" >/dev/null
  fi
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  operation=${1:-}
  stack_name=${2:-}
  if [[ -z "$operation" || -z "$stack_name" ]]; then
    echo "Usage: $0 <status|settle> <stack-name>" >&2
    exit 2
  fi

  case "$operation" in
    status)
      get_stack_status "$stack_name"
      ;;
    settle)
      settle_stack "$stack_name"
      ;;
    *)
      echo "Unknown operation: $operation" >&2
      exit 2
      ;;
  esac
fi
