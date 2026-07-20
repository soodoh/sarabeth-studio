#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <app-id> <check-id> [--skip-unavailable]" >&2
  exit 2
fi

app_id=$1
check_id=$2
skip_unavailable=${3:-}
if [[ -n "$skip_unavailable" && "$skip_unavailable" != "--skip-unavailable" ]]; then
  echo "Unknown option: $skip_unavailable" >&2
  exit 2
fi

validation_timeout=${REDIRECT_VALIDATION_TIMEOUT_SECONDS:-480}
retry_seconds=${REDIRECT_VALIDATION_RETRY_SECONDS:-10}
if [[ ! "$validation_timeout" =~ ^[0-9]+$ || ! "$retry_seconds" =~ ^[0-9]+$ ]]; then
  echo "Redirect validation timing values must be non-negative integers" >&2
  exit 2
fi

domain_error=$(mktemp)
if domain_status=$(aws amplify get-domain-association \
  --app-id "$app_id" \
  --domain-name sarabethbelon.com \
  --query 'domainAssociation.domainStatus' \
  --output text 2>"$domain_error"); then
  rm -f "$domain_error"
else
  domain_exit=$?
  if [[ "$skip_unavailable" == "--skip-unavailable" ]] && \
    grep -Eq '\(NotFoundException\).*GetDomainAssociation operation' "$domain_error"; then
    rm -f "$domain_error"
    echo "Skipping canonical redirect validation because the production domain association was not found"
    exit 0
  fi
  cat "$domain_error" >&2
  rm -f "$domain_error"
  exit "$domain_exit"
fi

if [[ "$domain_status" != "AVAILABLE" ]]; then
  if [[ "$skip_unavailable" == "--skip-unavailable" ]]; then
    echo "Skipping canonical redirect validation because the production domain is not available"
    exit 0
  fi
  echo "Production domain is not available for canonical redirect validation" >&2
  exit 1
fi

paths=(
  "/?redirect-check=$check_id"
  "/about?redirect-check=$check_id"
  "/contact?redirect-check=$check_id"
  "/engagements?redirect-check=$check_id"
  "/lessons?redirect-check=$check_id"
  "/media?redirect-check=$check_id"
  "/privacy?redirect-check=$check_id"
)
deadline=$((SECONDS + validation_timeout))
while (( SECONDS < deadline )); do
  all_redirects_valid=true
  for path in "${paths[@]}"; do
    remaining=$((deadline - SECONDS))
    if (( remaining <= 0 )); then
      all_redirects_valid=false
      break
    fi
    request_timeout=$((remaining < 10 ? remaining : 10))
    headers=$(mktemp)
    status=$(curl --silent --show-error --max-time "$request_timeout" \
      --dump-header "$headers" \
      --output /dev/null \
      --write-out '%{http_code}' \
      "https://www.sarabethbelon.com${path}" || true)
    location=$(awk -F ': ' 'tolower($1) == "location" { print $2 }' "$headers" | tail -1 | tr -d '\r')
    rm -f "$headers"
    expected_location="https://sarabethbelon.com${path}"
    if [[ "$status" != "301" || "$location" != "$expected_location" ]]; then
      all_redirects_valid=false
      break
    fi
  done
  if [[ "$all_redirects_valid" == "true" ]]; then
    echo "Canonical www redirects preserve all production paths and query strings"
    exit 0
  fi

  remaining=$((deadline - SECONDS))
  (( remaining > 0 )) || break
  sleep_for=$((remaining < retry_seconds ? remaining : retry_seconds))
  (( sleep_for > 0 )) && sleep "$sleep_for"
done

echo "Canonical www redirects did not stabilize within ${validation_timeout}s" >&2
exit 1
