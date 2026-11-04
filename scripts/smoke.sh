#!/usr/bin/env bash
# Live smoke test for redcreekoutdoors.com. Runs in CI after every deploy and
# by hand (Actions > Live smoke > Run workflow). Fails on the first wrong answer.
#   bash scripts/smoke.sh [expected_build_sha]
set -u
BASE=https://redcreekoutdoors.com
want_sha="${1:-}"
fail=0
check() { # name, got, want
  if [[ "$2" == "$3" ]]; then echo "ok    $1"; else echo "FAIL  $1: got [$2] want [$3]"; fail=1; fi
}
# Retries ride out one-off network blips between the GitHub runner and the
# edge (2026-11-04: one empty fetch failed the daily run; a re-run passed).
# A real fault fails every attempt, so it still fails the check.
C="curl -s -m 20 --retry 2 --retry-delay 3 --retry-all-errors"
code() { $C -o /dev/null -w '%{http_code}' "$1"; }
hop() { $C -o /dev/null -w '%{http_code} %{redirect_url}' "$1"; }
page() { local b; b=$($C "$1"); [[ -n "$b" ]] || { sleep 3; b=$($C "$1"); }; printf '%s' "$b"; }

# Build on the domain (retry while the edge picks up a fresh deploy)
for i in 1 2 3 4 5 6; do
  health=$($C "$BASE/api/health")
  [[ -z "$want_sha" || "$health" == *"$want_sha"* ]] && break
  sleep 10
done
echo "      health: $health"
[[ "$health" == *'"ok":true'* ]] || { echo "FAIL  /api/health not served by the Worker"; fail=1; }
[[ -z "$want_sha" || "$health" == *"$want_sha"* ]] || { echo "FAIL  live build is not $want_sha"; fail=1; }

# One hop to the canonical host
check "http apex"  "$(hop http://redcreekoutdoors.com/)"           "301 https://redcreekoutdoors.com/"
check "https www"  "$(hop https://www.redcreekoutdoors.com/duck-hunts?x=1)" "301 https://redcreekoutdoors.com/duck-hunts?x=1"
www_http=$($C -o /dev/null -L -w '%{url_effective} %{num_redirects}' http://www.redcreekoutdoors.com/)
check "http www ends on apex" "${www_http% *}" "https://redcreekoutdoors.com/"

# Old GoDaddy URLs keep their address; the one content redirect
for p in / /hog-trapping-killeen-tx /hog-trapping-service /hog-damage-prevention /hog-removal-areas /terms-and-conditions /privacy-policy; do
  check "200 $p" "$(code "$BASE$p")" "200"
  canon=$(page "$BASE$p" | grep -o '<link rel="canonical" href="[^"]*"' | head -1 | sed 's/.*href="//;s/"$//')
  check "canonical $p" "$canon" "$BASE$p"
done
check "thermal-hunting-removal" "$(hop "$BASE/thermal-hunting-removal")" "301 $BASE/thermal-hog-hunts"
check "old sitemap.xml" "$(hop "$BASE/sitemap.xml")" "301 $BASE/sitemap-index.xml"

# New pages, sitemap, 404, title on the home page
for p in /faq /goose-hunts /book-a-hunt /hog-trap-request /sitemap-index.xml /robots.txt; do check "200 $p" "$(code "$BASE$p")" "200"; done
check "404 page" "$(code "$BASE/m/login")" "404"
title=$(page "$BASE/" | grep -o '<title>[^<]*' | sed 's/<title>//')
check "home title" "$title" "Hog Trapping &amp; Guided Hunts in Killeen, TX | Red Creek Outdoors"

[[ $fail == 0 ]] && echo "SMOKE OK" || echo "SMOKE FAILED"
exit $fail
