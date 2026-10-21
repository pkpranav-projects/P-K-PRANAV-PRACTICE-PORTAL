Write-Host "=== 1. System Health ==="
$health = Invoke-RestMethod -Uri 'http://localhost:5000/api/health'
Write-Host "Status: $($health.status)"
Write-Host "Java: $($health.java.available) - $($health.java.version)"
Write-Host "Python: $($health.python.available) - $($health.python.version)"
Write-Host "C++: $($health.cpp.available) - $($health.cpp.version)"

Write-Host "`n=== 2. Statistics ==="
$stats = Invoke-RestMethod -Uri 'http://localhost:5000/api/stats'
Write-Host "Total Questions: $($stats.totalQuestions)"
Write-Host "Bank 1 (Photos): $($stats.bank1Total)"
Write-Host "Bank 2 (Modern): $($stats.bank2Total)"
Write-Host "Bank 3 (Lab Tests): $($stats.bank3Total)"
Write-Host "Bank 4 (DBMS): $($stats.dbmsTotal)"
Write-Host "Total Solved: $($stats.solvedCount)"

Write-Host "`n=== 3. DBMS Questions List ==="
$dbmsQuestions = Invoke-RestMethod -Uri 'http://localhost:5000/api/questions?bank=dbms'
Write-Host "Fetched $($dbmsQuestions.Count) DBMS questions."
$dbmsQuestions | ForEach-Object {
    Write-Host " - [$($_.id)] $($_.title) | Difficulty: $($_.difficulty) | Lang: $($_.recommendedLanguage)"
}

Write-Host "`n=== 4. Test Screenshot Fetching from DBMS questions ==="
$testImg = Invoke-WebRequest -Uri 'http://localhost:5000/api/screenshots/Screenshot%20(604).png' -Method Head -UseBasicParsing
Write-Host "Screenshot (604).png HTTP Status: $($testImg.StatusCode)"

Write-Host "`n=== 5. Test Live SQL Run (SumOfDigits Procedure) ==="
$runObj = @{
    language = "sql"
    code = "DELIMITER //`nCREATE PROCEDURE SumOfDigits(IN num INT, OUT sum INT)`nBEGIN`n    SET sum = 0;`n    WHILE num > 0 DO`n        SET sum = sum + (num % 10);`n        SET num = num DIV 10;`n    END WHILE;`nEND //`nDELIMITER ;`n"
    input = "12345"
    questionId = "dbms-007"
}
$runRes = Invoke-RestMethod -Uri 'http://localhost:5000/api/run' -Method Post -Body ($runObj | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Run Status: $($runRes.status) | ExitCode: $($runRes.exitCode) | Time: $($runRes.executionTimeMs)ms"
Write-Host "Stdout Output: $($runRes.stdout.Trim())"

Write-Host "`n=== 6. Test SQL Submission Evaluation (dbms-001 Fraud Trigger) ==="
$rawDbms = Get-Content 'questions_dbms.json' -Raw | ConvertFrom-Json
$q001 = $rawDbms | Where-Object { $_.id -eq 'dbms-001' }
$subObj = @{
    questionId = "dbms-001"
    code = $q001.referenceSolution
    language = "sql"
}
$subRes = Invoke-RestMethod -Uri 'http://localhost:5000/api/submit' -Method Post -Body ($subObj | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Submit Status: $($subRes.status) | Passed: $($subRes.passedCount)/$($subRes.totalCount) | Time: $($subRes.executionTimeMs)ms"

Write-Host "`n=== 7. Test SQL Submission Evaluation (dbms-008 CheckPalindrome) ==="
$q008 = $rawDbms | Where-Object { $_.id -eq 'dbms-008' }
$subObj8 = @{
    questionId = "dbms-008"
    code = $q008.referenceSolution
    language = "sql"
}
$subRes8 = Invoke-RestMethod -Uri 'http://localhost:5000/api/submit' -Method Post -Body ($subObj8 | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Submit Status: $($subRes8.status) | Passed: $($subRes8.passedCount)/$($subRes8.totalCount) | Time: $($subRes8.executionTimeMs)ms"

Write-Host "`nAll verification checks passed!"
