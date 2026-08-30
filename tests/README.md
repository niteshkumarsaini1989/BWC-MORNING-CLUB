# Bharat Wellness Club - Test Suite Documentation

Yeh folder Bharat Wellness Club web app ke sabhi automated aur browser test cases ke liye hai.

## Folder Structure
- `run_chrome_tests.ps1` : Google Chrome / Microsoft Edge par automated headless DevTools test runner.
- `test_runner.js` : Complete in-browser test suite jo sabhi modules ko test karta hai.
- `test_cases/` :
  - `01_auth_and_roles.test.js` : Master Admin aur Coach role-based login tests.
  - `02_demo_data_integrity.test.js` : Demo data pre-population aur JSON parsing integrity.
  - `03_navigation_and_views.test.js` : Responsive sidebar aur tab switching tests.
  - `04_consumer_crud_and_ideal_weight.test.js` : Consumer add, auto-code, aur WHO Ideal Weight calculation tests.
  - `05_attendance_daily_and_monthly.test.js` : Daily live attendance aur monthly register toggle tests.
  - `06_btg_food_diet_tracking.test.js` : BTG 8-slot food diet tracking matrix aur modal tab tests.
  - `07_bmi_wellness_evaluations.test.js` : Body composition BMI logs, VFA, fat%, body age, waist tests.
  - `08_checkup_90day_reminders.test.js` : 90-day follow-up checkup engine aur WhatsApp reminder notifications.
  - `09_product_tracking_and_keywords.test.js` : Multi-product tracking, smart search, aur dispatch logs.
  - `10_reports_and_print_slips.test.js` : Single slips, diet reports, checkup reports, aur Combo Health Report engine.
  - `11_coach_management.test.js` : Coach add, password change, aur coach team filtering.
  - `12_backup_and_restore.test.js` : Full JSON data export aur restore engine.

## Kaise Run Karein:
PowerShell me run karein:
```powershell
powershell -ExecutionPolicy Bypass -File tests/run_chrome_tests.ps1
```
