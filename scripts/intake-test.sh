#!/usr/bin/env bash
# Live end-to-end test of the hog trap intake. MANUAL ONLY (Actions > Live
# intake test > Run workflow). It creates a real case and sends real email:
# the ops copy and the landowner receipt both go to ops@backcountrydrones.com.
# Every run is marked TEST in the name and message. Purge TEST cases from KV
# when the ops dashboard exists.
set -u
BASE=https://redcreekoutdoors.com
body=$(cat <<JSON
{"name":"TEST Intake Check","phone":"254-397-8938","email":"ops@backcountrydrones.com","role":"Test",
 "message":"TEST submission from the live intake test workflow. Ignore.",
 "property":{"address":"TEST, no property","acreage":"1","county":"Bell","sounder":"No idea yet"},
 "damage":["Pasture and rooting"],"control":["Nothing yet"],
 "acks":["assessment_first","price","no_guarantee"],
 "points":[{"kind":"sign","label":"Test pin","lat":31.1171,"lng":-97.7278}],
 "areas":[{"kind":"damage","points":[[31.117,-97.728],[31.118,-97.729],[31.119,-97.727]]}],
 "source":{"landing":"/hog-trap-request","referrerHost":"","submittedFrom":"/hog-trap-request","utm_source":"intake-test"}}
JSON
)
out=$(curl -s -w '\n%{http_code}' -X POST "$BASE/api/trap-request" -H 'content-type: application/json' -H "origin: $BASE" -d "$body")
code=${out##*$'\n'}; resp=${out%$'\n'*}
echo "HTTP $code $resp"
[[ "$code" == 200 && "$resp" == *'"ok":true'* && "$resp" == *'"ref":"RCH-'* ]] && echo "INTAKE OK" || { echo "INTAKE FAILED"; exit 1; }
