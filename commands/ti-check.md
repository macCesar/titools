---
name: ti-check
description: Verify Titanium project setup and report issues
---

Check the current Titanium project and report:

1. Read `tiapp.xml` — report SDK version, app ID, deployment targets
2. Check if Alloy project (app/views + app/controllers exist)
3. Check if PurgeTSS is configured (purgetss/config.cjs exists)
4. Check for common issues:
   - Missing icon files (DefaultIcon.png)
   - Empty modules section in tiapp.xml
   - Outdated SDK version
5. Report a summary of findings
