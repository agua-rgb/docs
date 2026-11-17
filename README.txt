Shared Results version

Task 11 sends the four synthetic test fields to this same site's backend.
The Results tab loads that shared log, so submissions made by the Dot can be viewed from your laptop by opening the same deployed URL.

Expected values:
Employee ID: -4821
Email: alex.rivera@locoto.mx
Access Key: QA-7429
Diagnostic ID: SYNTH-2030

Use only synthetic test data.

Render deployment:
Create a WEB SERVICE (not a Static Site)
Runtime: Node
Build Command: npm install
Start Command: npm start

Note:
Render's local filesystem can reset on service restart/redeploy. The shared log is intended for the active test run.
